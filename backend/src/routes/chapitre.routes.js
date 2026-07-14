const express = require('express')
const jwt = require('jsonwebtoken')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')

const chapitreRouter = express.Router()

// Auth optionnelle pour le GET — vérifie le premium si le cours l'est
chapitreRouter.get('/:id', async (req, res) => {
  try {
    const chapitre = await prisma.chapitre.findUnique({
      where: { id: req.params.id },
      include: {
        cours: { select: { id: true, titre: true, matiere: true, premium: true } },
        quiz: { select: { id: true, titre: true, type: true, dureMin: true, xpMax: true, _count: { select: { questions: true } } } }
      }
    })
    if (!chapitre) return res.status(404).json({ message: 'Chapitre introuvable' })

    if (chapitre.cours.premium) {
      let accesAutorise = false
      const token = req.headers.authorization?.split(' ')[1]
      if (token) {
        try {
          const { id } = jwt.verify(token, process.env.JWT_SECRET)
          const user = await prisma.utilisateur.findUnique({
            where: { id },
            select: { estPremium: true, role: true }
          })
          accesAutorise = user?.estPremium || ['ADMIN', 'PROFESSEUR'].includes(user?.role)
        } catch {}
      }
      if (!accesAutorise) {
        const extrait = chapitre.contenu
          .split('\n')
          .filter(l => !l.startsWith('#'))
          .join('\n')
          .replace(/\*\*/g, '')
          .trim()
          .slice(0, 500)
        return res.json({ ...chapitre, contenu: extrait, verrouille: true })
      }
    }

    res.json({ ...chapitre, verrouille: false })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

chapitreRouter.post('/', authentifier, autoriser('PROFESSEUR', 'ADMIN'), async (req, res) => {
  const { coursId, titre, contenu, ordre, xpObtenu } = req.body
  if (!coursId || !titre || !contenu || ordre == null)
    return res.status(400).json({ message: 'coursId, titre, contenu et ordre sont requis' })
  try {
    const chapitre = await prisma.chapitre.create({
      data: { coursId, titre, contenu, ordre, xpObtenu: xpObtenu || 10 }
    })
    res.status(201).json(chapitre)
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

chapitreRouter.patch('/:id', authentifier, autoriser('PROFESSEUR', 'ADMIN'), async (req, res) => {
  const { titre, contenu, ordre, xpObtenu } = req.body
  try {
    const mis = await prisma.chapitre.update({
      where: { id: req.params.id },
      data: {
        ...(titre && { titre }),
        ...(contenu && { contenu }),
        ...(ordre != null && { ordre }),
        ...(xpObtenu != null && { xpObtenu })
      }
    })
    res.json(mis)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

chapitreRouter.delete('/:id', authentifier, autoriser('PROFESSEUR', 'ADMIN'), async (req, res) => {
  try {
    await prisma.chapitre.delete({ where: { id: req.params.id } })
    res.json({ message: 'Chapitre supprimé' })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

const progressionRouter = express.Router()

progressionRouter.get('/moi', authentifier, async (req, res) => {
  const utilisateurId = req.utilisateur.id
  try {
    const [user, progressions, tentatives, badges] = await Promise.all([
      prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
        select: { nom: true, prenom: true, xpTotal: true, streak: true, niveau: true, classe: true, estPremium: true, role: true }
      }),
      prisma.progression.findMany({
        where: { utilisateurId },
        include: { chapitre: { select: { id: true, titre: true, cours: { select: { titre: true, matiere: true } } } } },
        orderBy: { misAJourLe: 'desc' }
      }),
      prisma.tentative.findMany({
        where: { utilisateurId },
        select: { score: true, xpGagne: true, commenceLe: true, quiz: { select: { titre: true } } },
        orderBy: { commenceLe: 'desc' },
        take: 10
      }),
      prisma.badgeUtilisateur.findMany({
        where: { utilisateurId },
        include: { badge: true },
        orderBy: { obtenuLe: 'desc' }
      })
    ])
    const totalChapitres = progressions.length
    const chapitresTermines = progressions.filter(p => p.statut === 'TERMINE').length
    const scoreMoyen = tentatives.length
      ? Math.round(tentatives.reduce((acc, t) => acc + t.score, 0) / tentatives.length)
      : 0
    res.json({
      profil: user,
      stats: { totalChapitres, chapitresTermines, scoreMoyen, totalBadges: badges.length },
      progressions,
      dernieresTentatives: tentatives,
      badges
    })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

progressionRouter.get('/cours/:coursId', authentifier, async (req, res) => {
  const utilisateurId = req.utilisateur.id
  try {
    const cours = await prisma.cours.findUnique({
      where: { id: req.params.coursId },
      include: { chapitres: { orderBy: { ordre: 'asc' } } }
    })
    if (!cours) return res.status(404).json({ message: 'Cours introuvable' })
    const progressions = await prisma.progression.findMany({
      where: { utilisateurId, chapitreId: { in: cours.chapitres.map(c => c.id) } }
    })
    const progressionParChapitre = Object.fromEntries(progressions.map(p => [p.chapitreId, p]))
    const chapitresAvecProgression = cours.chapitres.map(ch => ({
      ...ch,
      progression: progressionParChapitre[ch.id] || { statut: 'NON_COMMENCE', score: null }
    }))
    res.json({ cours: { id: cours.id, titre: cours.titre, matiere: cours.matiere }, chapitres: chapitresAvecProgression })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

module.exports = { chapitreRouter, progressionRouter }
