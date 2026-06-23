const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')

const router = express.Router()

router.get('/', async (req, res) => {
  const { matiere, niveau, classe } = req.query
  try {
    const cours = await prisma.cours.findMany({
      where: { publie: true, ...(matiere && { matiere }), ...(niveau && { niveau }), ...(classe && { classe }) },
      include: { auteur: { select: { nom: true, prenom: true } }, _count: { select: { chapitres: true } } },
      orderBy: { creeLe: 'desc' }
    })
    res.json(cours)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.get('/:id', async (req, res) => {
  try {
    const cours = await prisma.cours.findUnique({
      where: { id: req.params.id },
      include: {
        auteur: { select: { nom: true, prenom: true } },
        chapitres: { orderBy: { ordre: 'asc' }, include: { _count: { select: { quiz: true } } } }
      }
    })
    if (!cours) return res.status(404).json({ message: 'Cours introuvable' })
    res.json(cours)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.post('/', authentifier, autoriser('PROFESSEUR', 'ADMIN'), [
  body('titre').notEmpty(),
  body('description').notEmpty(),
  body('matiere').notEmpty(),
  body('niveau').isIn(['COLLEGE', 'LYCEE', 'UNIVERSITE']),
], async (req, res) => {
  const erreurs = validationResult(req)
  if (!erreurs.isEmpty()) return res.status(400).json({ erreurs: erreurs.array() })
  const { titre, description, matiere, niveau, classe, imageUrl } = req.body
  try {
    const cours = await prisma.cours.create({
      data: { titre, description, matiere, niveau, classe, imageUrl, auteurId: req.utilisateur.id }
    })
    res.status(201).json(cours)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.patch('/:id/publier', authentifier, autoriser('PROFESSEUR', 'ADMIN'), async (req, res) => {
  try {
    const cours = await prisma.cours.findUnique({ where: { id: req.params.id } })
    if (!cours) return res.status(404).json({ message: 'Cours introuvable' })
    if (cours.auteurId !== req.utilisateur.id && req.utilisateur.role !== 'ADMIN')
      return res.status(403).json({ message: 'Action non autorisee' })
    const mis = await prisma.cours.update({ where: { id: req.params.id }, data: { publie: !cours.publie } })
    res.json(mis)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.delete('/:id', authentifier, autoriser('PROFESSEUR', 'ADMIN'), async (req, res) => {
  try {
    const cours = await prisma.cours.findUnique({ where: { id: req.params.id } })
    if (!cours) return res.status(404).json({ message: 'Cours introuvable' })
    if (cours.auteurId !== req.utilisateur.id && req.utilisateur.role !== 'ADMIN')
      return res.status(403).json({ message: 'Action non autorisee' })
    await prisma.cours.delete({ where: { id: req.params.id } })
    res.json({ message: 'Cours supprime' })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

module.exports = router
