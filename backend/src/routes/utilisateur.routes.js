const express = require('express')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')

const router = express.Router()

router.get('/profil', authentifier, async (req, res) => {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.utilisateur.id },
      select: { id: true, nom: true, prenom: true, email: true, role: true, niveau: true, classe: true, ecole: true, xpTotal: true, streak: true, creeLe: true }
    })
    res.json(user)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.get('/classement', async (req, res) => {
  try {
    const classement = await prisma.utilisateur.findMany({
      where: { role: 'ELEVE' },
      select: { id: true, nom: true, prenom: true, xpTotal: true, streak: true, ecole: true, niveau: true },
      orderBy: { xpTotal: 'desc' },
      take: 20
    })
    res.json(classement.map((u, i) => ({ ...u, rang: i + 1 })))
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.patch('/profil', authentifier, async (req, res) => {
  const { nom, prenom, classe, ecole } = req.body
  try {
    const user = await prisma.utilisateur.update({
      where: { id: req.utilisateur.id },
      data: { ...(nom && { nom }), ...(prenom && { prenom }), ...(classe && { classe }), ...(ecole && { ecole }) },
      select: { id: true, nom: true, prenom: true, email: true, classe: true, ecole: true }
    })
    res.json(user)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

router.get('/', authentifier, autoriser('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.utilisateur.findMany({
      select: { id: true, nom: true, prenom: true, email: true, role: true, niveau: true, xpTotal: true, creeLe: true },
      orderBy: { creeLe: 'desc' }
    })
    res.json(users)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

module.exports = router
