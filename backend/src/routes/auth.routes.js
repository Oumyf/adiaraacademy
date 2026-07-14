const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const prisma = require('../prisma')
const { verifierEtAttribuerBadges } = require('../helpers/badges')

const router = express.Router()

const genererToken = (utilisateur) => {
  return jwt.sign(
    { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role, nom: utilisateur.nom },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

const calculerStreak = (derniereActivite, streakActuel) => {
  if (!derniereActivite) return 1
  const maintenant = new Date()
  const hier = new Date(maintenant)
  hier.setDate(hier.getDate() - 1)
  const dernierJour = new Date(derniereActivite)

  const memeJour = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (memeJour(dernierJour, maintenant)) return streakActuel
  if (memeJour(dernierJour, hier)) return streakActuel + 1
  return 1
}

router.post('/inscription', [
  body('nom').notEmpty().withMessage('Nom requis'),
  body('prenom').notEmpty().withMessage('Prenom requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('motDePasse').isLength({ min: 6 }).withMessage('Mot de passe : 6 caracteres minimum'),
], async (req, res) => {
  const erreurs = validationResult(req)
  if (!erreurs.isEmpty()) return res.status(400).json({ erreurs: erreurs.array() })
  const { nom, prenom, email, motDePasse, role, niveau, classe, ecole } = req.body

  const roleValide = ['ELEVE', 'PARENT'].includes(role) ? role : 'ELEVE'
  const niveauFinal = roleValide === 'PARENT' ? 'LYCEE' : (niveau || 'LYCEE')
  const niveauxValides = ['COLLEGE', 'LYCEE', 'UNIVERSITE']
  if (roleValide === 'ELEVE' && !niveauxValides.includes(niveauFinal)) {
    return res.status(400).json({ message: 'Niveau invalide' })
  }

  try {
    const existant = await prisma.utilisateur.findUnique({ where: { email } })
    if (existant) return res.status(409).json({ message: 'Cet email est deja utilise' })
    const hash = await bcrypt.hash(motDePasse, 12)
    const utilisateur = await prisma.utilisateur.create({
      data: { nom, prenom, email, motDePasse: hash, role: roleValide, niveau: niveauFinal, classe, ecole, streak: 1, derniereActivite: new Date() },
      select: { id: true, nom: true, prenom: true, email: true, role: true, niveau: true, xpTotal: true, streak: true, estPremium: true }
    })
    res.status(201).json({ token: genererToken(utilisateur), utilisateur })
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'inscription", detail: err.message })
  }
})

router.post('/connexion', [
  body('email').isEmail(),
  body('motDePasse').notEmpty(),
], async (req, res) => {
  const erreurs = validationResult(req)
  if (!erreurs.isEmpty()) return res.status(400).json({ erreurs: erreurs.array() })
  const { email, motDePasse } = req.body
  try {
    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } })
    if (!utilisateur) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    const valide = await bcrypt.compare(motDePasse, utilisateur.motDePasse)
    if (!valide) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })

    const nouveauStreak = calculerStreak(utilisateur.derniereActivite, utilisateur.streak)
    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { derniereActivite: new Date(), streak: nouveauStreak }
    })

    const nouveauxBadges = await verifierEtAttribuerBadges(utilisateur.id)

    const { motDePasse: _, ...utilisateurSansMdp } = utilisateur
    res.json({
      token: genererToken(utilisateur),
      utilisateur: { ...utilisateurSansMdp, streak: nouveauStreak },
      nouveauxBadges
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion' })
  }
})

module.exports = router
