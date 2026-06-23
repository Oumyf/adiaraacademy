const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')

const router = express.Router()

router.get('/:id', authentifier, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: {
        questions: {
          orderBy: { ordre: 'asc' },
          select: { id: true, enonce: true, options: true, difficulte: true, ordre: true }
        }
      }
    })
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable' })
    res.json(quiz)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.post('/:id/soumettre', authentifier, async (req, res) => {
  const { reponses, dureeSec } = req.body
  const utilisateurId = req.utilisateur.id
  const quizId = req.params.id
  try {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true } })
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable' })
    let bonnesReponses = 0
    const corrections = quiz.questions.map(q => {
      const repDonnee = reponses[q.id] || ''
      const estCorrecte = repDonnee.trim().toLowerCase() === q.reponseCorrecte.trim().toLowerCase()
      if (estCorrecte) bonnesReponses++
      return { questionId: q.id, enonce: q.enonce, reponseDonnee: repDonnee, reponseCorrecte: q.reponseCorrecte, estCorrecte, explication: q.explication }
    })
    const score = Math.round((bonnesReponses / quiz.questions.length) * 100)
    const xpGagne = Math.round((score / 100) * quiz.xpMax)
    const tentative = await prisma.tentative.create({
      data: { utilisateurId, quizId, reponses, score, xpGagne, dureeSec, termineLeAt: new Date() }
    })
    await prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: { xpTotal: { increment: xpGagne }, derniereActivite: new Date() }
    })
    await prisma.progression.upsert({
      where: { utilisateurId_chapitreId: { utilisateurId, chapitreId: quiz.chapitreId } },
      update: { statut: score >= 50 ? 'TERMINE' : 'EN_COURS', score: { set: score }, xpGagne, tentatives: { increment: 1 } },
      create: { utilisateurId, chapitreId: quiz.chapitreId, statut: score >= 50 ? 'TERMINE' : 'EN_COURS', score, xpGagne, tentatives: 1, termineLeAt: score >= 50 ? new Date() : null }
    })
    res.json({ tentativeId: tentative.id, score, xpGagne, bonnesReponses, totalQuestions: quiz.questions.length, corrections })
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
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
