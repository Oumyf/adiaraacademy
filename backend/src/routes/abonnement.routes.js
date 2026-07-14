const express = require('express')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')

const router = express.Router()

router.get('/statut', authentifier, async (req, res) => {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.utilisateur.id },
      select: { estPremium: true }
    })
    res.json({ premium: user?.estPremium ?? false })
  } catch { res.status(500).json({ message: 'Erreur' }) }
})

// Activation manuelle Premium (admin uniquement — Phase 3 intégrera le paiement réel)
router.patch('/activer', authentifier, autoriser('ADMIN'), async (req, res) => {
  const { userId } = req.body
  if (!userId) return res.status(400).json({ message: 'userId requis' })
  try {
    const user = await prisma.utilisateur.update({
      where: { id: userId },
      data: { estPremium: true },
      select: { id: true, nom: true, prenom: true, email: true, estPremium: true }
    })
    res.json({ message: 'Compte Premium activé', utilisateur: user })
  } catch { res.status(500).json({ message: 'Erreur' }) }
})

// Activation auto pour l'utilisateur connecté (placeholder Phase 3 — pas de paiement encore)
router.post('/souscrire', authentifier, async (req, res) => {
  try {
    await prisma.utilisateur.update({
      where: { id: req.utilisateur.id },
      data: { estPremium: true }
    })
    res.json({ message: 'Compte Premium activé (mode test)' })
  } catch { res.status(500).json({ message: 'Erreur' }) }
})

module.exports = router
