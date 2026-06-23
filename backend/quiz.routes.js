const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')

const router = express.Router()

// ────────────────────────────────────────
// GET /api/quiz/:id
// Détail d'un quiz avec ses questions
// (les réponses correctes sont masquées)
// ────────────────────────────────────────
router.get('/:id', authentifier, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: {
        questions: {
          orderBy: { ordre: 'asc' },
          select: {
            id: true, enonce: true, options: true,
            difficulte: true, ordre: true
            // reponseCorrecte NON incluse volontairement
          }
        }
      }
    })
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable' })
    res.json(quiz)
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du quiz' })
  }
})

// ────────────────────────────────────────
// POST /api/quiz/:id/soumettre
// Soumettre les réponses et obtenir la correction
// ────────────────────────────────────────
router.post('/:id/soumettre', authentifier, [
  body('reponses').isObject().withMessage('Réponses requises (objet { question_id: réponse })'),
], async (req, res) => {
  const erreurs = validationResult(req)
  if (!erreurs.isEmpty()) return res.status(400).json({ erreurs: erreurs.array() })

  const { reponses, dureeSec } = req.body
  const utilisateurId = req.utilisateur.id
  const quizId = req.params.id

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true, chapitre: true }
    })
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable' })

    // ── Correction ───────────────────────
    let bonnesReponses = 0
    const corrections = quiz.questions.map(q => {
      const repDonnee = reponses[q.id] || ''
      const estCorrecte = repDonnee.trim().toLowerCase() === q.reponseCorrecte.trim().toLowerCase()
      if (estCorrecte) bonnesReponses++
      return {
        questionId:       q.id,
        enonce:           q.enonce,
        reponseDonnee:    repDonnee,
        reponseCorrecte:  q.reponseCorrecte,
        estCorrecte,
        explication:      q.explication
      }
    })

    const score = Math.round((bonnesReponses / quiz.questions.length) * 100)
    const xpGagne = Math.round((score / 100) * quiz.xpMax)

    // ── Enregistrer la tentative ─────────
    const tentative = await prisma.tentative.create({
      data: {
        utilisateurId,
        quizId,
        reponses,
        score,
        xpGagne,
        dureeSec,
        termineLeAt: new Date()
      }
    })

    // ── Mettre à jour XP utilisateur ─────
    await prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: {
        xpTotal: { increment: xpGagne },
        derniereActivite: new Date()
      }
    })

    // ── Mettre à jour la progression sur le chapitre ──
    await prisma.progression.upsert({
      where: { utilisateurId_chapitreId: { utilisateurId, chapitreId: quiz.chapitreId } },
      update: {
        statut: score >= 50 ? 'TERMINE' : 'EN_COURS',
        score:  { set: score },
        xpGagne,
        tentatives: { increment: 1 }
      },
      create: {
        utilisateurId,
        chapitreId: quiz.chapitreId,
        statut: score >= 50 ? 'TERMINE' : 'EN_COURS',
        score,
        xpGagne,
        tentatives: 1,
        termineLeAt: score >= 50 ? new Date() : null
      }
    })

    // ── Vérification badges ───────────────
    await verifierEtAttribuerBadges(utilisateurId)

    res.json({
      tentativeId: tentative.id,
      score,
      xpGagne,
      bonnesReponses,
      totalQuestions: quiz.questions.length,
      corrections
    })

  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la soumission', detail: err.message })
  }
})

// ────────────────────────────────────────
// POST /api/quiz (PROF/ADMIN)
// Créer un quiz avec ses questions
// ────────────────────────────────────────
router.post('/', authentifier, autoriser('PROFESSEUR', 'ADMIN'), [
  body('chapitreId').notEmpty().withMessage('Chapitre requis'),
  body('titre').notEmpty().withMessage('Titre requis'),
  body('questions').isArray({ min: 1 }).withMessage('Au moins une question requise'),
], async (req, res) => {
  const erreurs = validationResult(req)
  if (!erreurs.isEmpty()) return res.status(400).json({ erreurs: erreurs.array() })

  const { chapitreId, titre, type, dureMin, xpMax, questions } = req.body

  try {
    const quiz = await prisma.quiz.create({
      data: {
        chapitreId, titre,
        type:   type   || 'QCM',
        dureMin: dureMin || null,
        xpMax:  xpMax  || 50,
        questions: {
          create: questions.map((q, i) => ({
            enonce:          q.enonce,
            options:         q.options || null,
            reponseCorrecte: q.reponseCorrecte,
            explication:     q.explication || null,
            difficulte:      q.difficulte || 'MOYEN',
            ordre:           i + 1
          }))
        }
      },
      include: { questions: true }
    })
    res.status(201).json(quiz)
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du quiz', detail: err.message })
  }
})

// ────────────────────────────────────────
// Vérification et attribution des badges
// ────────────────────────────────────────
async function verifierEtAttribuerBadges(utilisateurId) {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: {
        _count: { select: { tentatives: true } },
        badges: { select: { badgeId: true } }
      }
    })

    const badges = await prisma.badge.findMany()
    const badgesDejaObtenus = user.badges.map(b => b.badgeId)

    for (const badge of badges) {
      if (badgesDejaObtenus.includes(badge.id)) continue

      const cond = badge.condition
      let declenche = false

      if (cond.type === 'xp_total'     && user.xpTotal >= cond.valeur) declenche = true
      if (cond.type === 'streak'        && user.streak  >= cond.valeur) declenche = true
      if (cond.type === 'quiz_complete' && user._count.tentatives >= cond.valeur) declenche = true

      if (declenche) {
        await prisma.badgeUtilisateur.create({
          data: { utilisateurId, badgeId: badge.id }
        })
      }
    }
  } catch (_) { /* ne pas bloquer la réponse si les badges échouent */ }
}

module.exports = router
