const express = require('express')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')
const { verifierEtAttribuerBadges } = require('../helpers/badges')

const router = express.Router()

const normaliser = (s) =>
  String(s).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

router.get('/revision-express', authentifier, async (req, res) => {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.utilisateur.id },
      select: { estPremium: true, role: true }
    })
    if (!user?.estPremium && !['ADMIN', 'PROFESSEUR'].includes(user?.role)) {
      return res.status(403).json({ message: 'Contenu réservé aux membres Premium.' })
    }
    const questions = await prisma.question.findMany({
      where: { quiz: { chapitre: { cours: { publie: true } } } },
      include: {
        quiz: { select: { titre: true, type: true } }
      }
    })
    const melangees = questions.sort(() => Math.random() - 0.5).slice(0, 10)
    res.json(melangees)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.get('/:id', authentifier, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: {
        chapitre: { select: { cours: { select: { premium: true } } } },
        questions: {
          orderBy: { ordre: 'asc' },
          select: { id: true, enonce: true, options: true, difficulte: true, ordre: true }
        }
      }
    })
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable' })

    if (quiz.chapitre?.cours?.premium) {
      const user = await prisma.utilisateur.findUnique({
        where: { id: req.utilisateur.id },
        select: { estPremium: true, role: true }
      })
      if (!user?.estPremium && !['ADMIN', 'PROFESSEUR'].includes(user?.role)) {
        return res.status(403).json({ message: 'Contenu réservé aux membres Premium.', premium: true })
      }
    }

    const { chapitre, ...quizData } = quiz
    res.json(quizData)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.post('/:id/soumettre', authentifier, async (req, res) => {
  const { reponses, dureeSec } = req.body
  const utilisateurId = req.utilisateur.id
  const quizId = req.params.id
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        chapitre: { select: { cours: { select: { premium: true } } } }
      }
    })
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable' })

    if (quiz.chapitre?.cours?.premium) {
      const user = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
        select: { estPremium: true, role: true }
      })
      if (!user?.estPremium && !['ADMIN', 'PROFESSEUR'].includes(user?.role)) {
        return res.status(403).json({ message: 'Contenu réservé aux membres Premium.', premium: true })
      }
    }

    let bonnesReponses = 0
    const corrections = quiz.questions.map(q => {
      const repDonnee = reponses[q.id] || ''
      const estCorrecte = normaliser(repDonnee) === normaliser(q.reponseCorrecte)
      if (estCorrecte) bonnesReponses++
      return { questionId: q.id, enonce: q.enonce, reponseDonnee: repDonnee, reponseCorrecte: q.reponseCorrecte, estCorrecte, explication: q.explication }
    })

    const score = Math.round((bonnesReponses / quiz.questions.length) * 100)
    const xpGagne = Math.round((score / 100) * quiz.xpMax)

    const tentative = await prisma.tentative.create({
      data: { utilisateurId, quizId, reponses, score, xpGagne, dureeSec, termineLeAt: new Date() }
    })

    // Calcul du streak
    const userActuel = await prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: { derniereActivite: true, streak: true }
    })
    const maintenant = new Date()
    const aujourd_hui = new Date(maintenant); aujourd_hui.setHours(0, 0, 0, 0)
    const hier = new Date(aujourd_hui); hier.setDate(hier.getDate() - 1)
    let nouveauStreak = 1
    if (userActuel.derniereActivite) {
      const derniere = new Date(userActuel.derniereActivite); derniere.setHours(0, 0, 0, 0)
      if (derniere.getTime() === aujourd_hui.getTime()) nouveauStreak = userActuel.streak
      else if (derniere.getTime() === hier.getTime())   nouveauStreak = userActuel.streak + 1
    }

    const userMisAJour = await prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: { xpTotal: { increment: xpGagne }, derniereActivite: maintenant, streak: nouveauStreak },
      select: { xpTotal: true, streak: true }
    })
    await prisma.progression.upsert({
      where: { utilisateurId_chapitreId: { utilisateurId, chapitreId: quiz.chapitreId } },
      update: { statut: score >= 50 ? 'TERMINE' : 'EN_COURS', score: { set: score }, xpGagne, tentatives: { increment: 1 } },
      create: { utilisateurId, chapitreId: quiz.chapitreId, statut: score >= 50 ? 'TERMINE' : 'EN_COURS', score, xpGagne, tentatives: 1, termineLeAt: score >= 50 ? new Date() : null }
    })

    const nouveauxBadges = await verifierEtAttribuerBadges(utilisateurId)

    res.json({ tentativeId: tentative.id, score, xpGagne, xpTotal: userMisAJour.xpTotal, streak: userMisAJour.streak, bonnesReponses, totalQuestions: quiz.questions.length, corrections, nouveauxBadges })
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

router.delete('/:id', authentifier, autoriser('PROFESSEUR', 'ADMIN'), async (req, res) => {
  try {
    await prisma.quiz.delete({ where: { id: req.params.id } })
    res.json({ message: 'Quiz supprimé' })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.post('/', authentifier, autoriser('PROFESSEUR', 'ADMIN'), async (req, res) => {
  const { chapitreId, titre, type, dureMin, xpMax, questions } = req.body
  if (!chapitreId || !titre || !questions?.length)
    return res.status(400).json({ message: 'Donnees incompletes' })
  try {
    const quiz = await prisma.quiz.create({
      data: {
        chapitreId, titre, type: type || 'QCM', dureMin: dureMin || null, xpMax: xpMax || 50,
        questions: {
          create: questions.map((q, i) => ({
            enonce: q.enonce, options: q.options || null,
            reponseCorrecte: q.reponseCorrecte, explication: q.explication || null,
            difficulte: q.difficulte || 'MOYEN', ordre: i + 1
          }))
        }
      },
      include: { questions: true }
    })
    res.status(201).json(quiz)
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

module.exports = router
