// Conception de cours assistée par IA (professeurs et administrateurs).
// Tout est créé en BROUILLON : un humain relit, corrige puis publie.
const express = require('express')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')
const { iaActive, appeler, extraireJSON, consommerGeneration, MODELE_COURS } = require('../helpers/ia')

const router = express.Router()
router.use(authentifier, autoriser('PROFESSEUR', 'ADMIN'))
router.use((req, res, next) => {
  if (!iaActive()) return res.status(503).json({ message: "L'IA n'est pas activée : ajoute DEEPSEEK_API_KEY dans backend/.env puis redémarre le serveur." })
  if (!consommerGeneration(req.utilisateur.id)) return res.status(429).json({ message: "Limite quotidienne de génération atteinte. Reviens demain." })
  next()
})

const MATIERES = ['MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE']
const NIVEAUX = ['COLLEGE', 'LYCEE', 'UNIVERSITE']
const NOM_MATIERE = { MATHEMATIQUES: 'mathématiques', PHYSIQUE: 'physique', CHIMIE: 'chimie', SCIENCES_VIE_TERRE: 'sciences de la vie et de la terre (SVT)', INFORMATIQUE: 'informatique' }
const NOM_NIVEAU = { COLLEGE: 'collège', LYCEE: 'lycée', UNIVERSITE: 'université' }

const SYSTEME = `Tu es un professeur expérimenté du système éducatif sénégalais qui conçoit des cours pour la plateforme AdiaraAcademy.
Principes :
- Suis le programme officiel sénégalais du niveau demandé (BFEM au collège, Baccalauréat au lycée, licence à l'université). Si tu n'es pas certain d'un point du programme, reste sur les notions universelles du niveau.
- Écris en français clair, adapté à l'âge des élèves, avec un ton chaleureux. Utilise des exemples ancrés dans le quotidien au Sénégal (marché, transport, football, cuisine, téléphone, agriculture) quand ils éclairent vraiment la notion.
- Sois rigoureux : n'invente aucun fait, aucune date, aucune valeur numérique que tu ne connais pas avec certitude. Les calculs doivent être exacts.
- Les formules s'écrivent en LaTeX : $...$ en ligne, $$...$$ en bloc.
- Réponds uniquement avec ce qu'on te demande, dans le format demandé.`

const nettoyer = (s, max = 400) => String(s ?? '').replace(/[<>]/g, '').trim().slice(0, max)

// 1) Plan du cours (rien n'est enregistré).
router.post('/cours/plan', async (req, res) => {
  const matiere = req.body.matiere, niveau = req.body.niveau
  if (!MATIERES.includes(matiere) || !NIVEAUX.includes(niveau)) return res.status(400).json({ message: 'Matière ou niveau invalide.' })
  const theme = nettoyer(req.body.theme, 200)
  if (!theme) return res.status(400).json({ message: 'Indique le thème du cours.' })
  const classe = nettoyer(req.body.classe, 60)
  const nb = Math.min(8, Math.max(3, Number(req.body.nbChapitres) || 5))
  try {
    const { texte } = await appeler({
      systeme: SYSTEME, modele: MODELE_COURS, maxTokens: 1800, delaiMs: 60000,
      contenu: `Conçois le plan d'un cours de ${NOM_MATIERE[matiere]} pour le niveau ${NOM_NIVEAU[niveau]}${classe ? ` (classe : ${classe})` : ''}.
Thème : <theme>${theme}</theme>
Le cours doit avoir exactement ${nb} chapitres, du plus simple au plus avancé, dans un ordre pédagogique logique.
Réponds uniquement avec ce JSON :
{"titre": "...", "description": "2 phrases qui donnent envie d'apprendre", "chapitres": [{"titre": "...", "objectifs": ["...", "...", "..."]}]}`
    })
    const plan = extraireJSON(texte)
    if (!plan.titre || !Array.isArray(plan.chapitres) || !plan.chapitres.length) throw new Error('Plan incomplet. Réessaie.')
    res.json({
      titre: nettoyer(plan.titre, 150), description: nettoyer(plan.description, 500),
      chapitres: plan.chapitres.slice(0, 8).map(c => ({ titre: nettoyer(c.titre, 150), objectifs: (c.objectifs || []).slice(0, 5).map(o => nettoyer(o, 200)) })).filter(c => c.titre)
    })
  } catch (err) { res.status(502).json({ message: err.message }) }
})

// 2) Création du cours (brouillon) avec ses chapitres vides.
router.post('/cours/creer', async (req, res) => {
  const { matiere, niveau } = req.body
  if (!MATIERES.includes(matiere) || !NIVEAUX.includes(niveau)) return res.status(400).json({ message: 'Matière ou niveau invalide.' })
  const titre = nettoyer(req.body.titre, 150)
  const chapitres = (Array.isArray(req.body.chapitres) ? req.body.chapitres : []).slice(0, 8)
    .map(c => ({ titre: nettoyer(c.titre, 150), objectifs: (c.objectifs || []).slice(0, 5).map(o => nettoyer(o, 200)) })).filter(c => c.titre)
  if (!titre || !chapitres.length) return res.status(400).json({ message: 'Titre et chapitres requis.' })
  try {
    const cours = await prisma.cours.create({
      data: {
        titre, description: nettoyer(req.body.description, 500) || titre, matiere, niveau,
        classe: nettoyer(req.body.classe, 60) || null, publie: false, premium: Boolean(req.body.premium), auteurId: req.utilisateur.id,
        chapitres: { create: chapitres.map((c, i) => ({ titre: c.titre, ordre: i + 1, xpObtenu: 20, contenu: `_Rédaction en cours…_\n\nObjectifs :\n${c.objectifs.map(o => `- ${o}`).join('\n')}` })) }
      },
      include: { chapitres: { orderBy: { ordre: 'asc' }, select: { id: true, titre: true, ordre: true } } }
    })
    res.status(201).json({ coursId: cours.id, chapitres: cours.chapitres, objectifs: chapitres.map(c => c.objectifs) })
  } catch (err) { res.status(500).json({ message: 'Erreur lors de la création du cours.' }) }
})

async function chapitreAutorise(req, res) {
  const chapitre = await prisma.chapitre.findUnique({ where: { id: req.params.id }, include: { cours: true } })
  if (!chapitre) { res.status(404).json({ message: 'Chapitre introuvable' }); return null }
  if (chapitre.cours.auteurId !== req.utilisateur.id && req.utilisateur.role !== 'ADMIN') { res.status(403).json({ message: 'Action non autorisée' }); return null }
  return chapitre
}

const contexte = (c) => `Cours : « ${c.cours.titre} » (${NOM_MATIERE[c.cours.matiere]}, ${NOM_NIVEAU[c.cours.niveau]}${c.cours.classe ? `, ${c.cours.classe}` : ''}).\nChapitre ${c.ordre} : « ${c.titre} ».`

// 3) Rédaction du contenu d'un chapitre.
router.post('/chapitres/:id/generer-contenu', async (req, res) => {
  try {
    const chapitre = await chapitreAutorise(req, res); if (!chapitre) return
    const objectifs = nettoyer(req.body.objectifs?.join?.('\n- ') ?? '', 800)
    const { texte, tronque } = await appeler({
      systeme: SYSTEME, modele: MODELE_COURS, maxTokens: 4000, delaiMs: 90000,
      contenu: `${contexte(chapitre)}
${objectifs ? `Objectifs :\n- ${objectifs}\n` : ''}Rédige la leçon complète en Markdown, d'environ 800 à 1100 mots, avec cette structure :
## Pour commencer  (une accroche concrète tirée du quotidien au Sénégal)
## Les notions clés  (définitions et propriétés, avec formules en LaTeX)
## Exemples résolus  (2 à 3 exemples, étape par étape, calculs exacts)
## À retenir  (liste courte)
## À toi de jouer  (3 exercices simples, sans la correction)
Commence directement par le premier titre, sans introduction ni conclusion hors structure.`
    })
    if (tronque) throw new Error('Le chapitre est trop long, réessaie.')
    await prisma.chapitre.update({ where: { id: chapitre.id }, data: { contenu: texte } })
    res.json({ ok: true, mots: texte.split(/\s+/).length })
  } catch (err) { res.status(502).json({ message: err.message }) }
})

// 4) Quiz du chapitre : 8 questions sur trois niveaux, donc adaptatif.
router.post('/chapitres/:id/generer-quiz', async (req, res) => {
  try {
    const chapitre = await chapitreAutorise(req, res); if (!chapitre) return
    const { texte, tronque } = await appeler({
      systeme: SYSTEME, modele: MODELE_COURS, maxTokens: 3500, delaiMs: 90000,
      contenu: `${contexte(chapitre)}
Voici la leçon :
<lecon>
${chapitre.contenu.slice(0, 7000)}
</lecon>
Écris un quiz de 8 questions à choix multiples (QCM) sur cette leçon : 3 FACILE, 3 MOYEN, 2 DIFFICILE.
Règles : 4 options par question, une seule correcte ; "reponseCorrecte" doit être EXACTEMENT le texte d'une des options ; les mauvaises options doivent être plausibles (erreurs fréquentes) ; une explication courte et pédagogique ; formules en LaTeX entre $ ... $ ; calculs vérifiés.
Réponds uniquement avec ce JSON :
{"questions": [{"enonce": "...", "options": ["...", "...", "...", "..."], "reponseCorrecte": "...", "explication": "...", "difficulte": "FACILE"}]}`
    })
    if (tronque) throw new Error('Quiz tronqué, réessaie.')
    const brut = extraireJSON(texte).questions
    const norm = (x) => String(x).trim().toLowerCase()
    const valides = (Array.isArray(brut) ? brut : []).filter(q =>
      q?.enonce && Array.isArray(q.options) && q.options.length >= 2 && q.options.length <= 6 &&
      q.options.some(o => norm(o) === norm(q.reponseCorrecte)) &&
      new Set(q.options.map(norm)).size === q.options.length &&
      ['FACILE', 'MOYEN', 'DIFFICILE'].includes(q.difficulte)
    ).slice(0, 10)
    if (valides.length < 6) throw new Error("Le quiz généré n'est pas assez fiable. Réessaie.")
    const quiz = await prisma.$transaction(async (tx) => {
      await tx.quiz.deleteMany({ where: { chapitreId: chapitre.id, titre: { startsWith: 'Quiz — ' } } })
      return tx.quiz.create({
        data: {
          chapitreId: chapitre.id, titre: `Quiz — ${chapitre.titre}`.slice(0, 150), type: 'QCM', xpMax: 50,
          questions: { create: valides.map((q, i) => ({
            enonce: nettoyer(q.enonce, 1000), options: q.options.map(o => nettoyer(o, 300)),
            reponseCorrecte: q.options.find(o => norm(o) === norm(q.reponseCorrecte)).trim(),
            explication: nettoyer(q.explication, 800) || null, difficulte: q.difficulte, ordre: i + 1
          })) }
        }
      })
    })
    res.json({ ok: true, quizId: quiz.id, questions: valides.length })
  } catch (err) { res.status(502).json({ message: err.message }) }
})

module.exports = router
