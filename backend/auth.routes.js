const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const prisma = require('../prisma')

const router = express.Router()

// ── Utilitaire : générer un JWT ──────────
const genererToken = (utilisateur) => {
  return jwt.sign(
    {
      id:    utilisateur.id,
      email: utilisateur.email,
      role:  utilisateur.role,
      nom:   utilisateur.nom,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// ────────────────────────────────────────
// POST /api/auth/inscription
// ────────────────────────────────────────
router.post('/inscription', [
  body('nom').notEmpty().withMessage('Nom requis'),
  body('prenom').notEmpty().withMessage('Prénom requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('motDePasse').isLength({ min: 6 }).withMessage('Mot de passe : 6 caractères minimum'),
  body('niveau').isIn(['COLLEGE', 'LYCEE', 'UNIVERSITE']).withMessage('Niveau invalide'),
], async (req, res) => {
  const erreurs = validationResult(req)
  if (!erreurs.isEmpty()) {
    return res.status(400).json({ erreurs: erreurs.array() })
  }

  const { nom, prenom, email, motDePasse, niveau, classe, ecole } = req.body

  try {
    const existant = await prisma.utilisateur.findUnique({ where: { email } })
    if (existant) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' })
    }

    const hash = await bcrypt.hash(motDePasse, 12)

    const utilisateur = await prisma.utilisateur.create({
      data: { nom, prenom, email, motDePasse: hash, niveau, classe, ecole },
      select: { id: true, nom: true, prenom: true, email: true, role: true, niveau: true, xpTotal: true }
    })

    const token = genererToken(utilisateur)
    res.status(201).json({ token, utilisateur })

  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', detail: err.message })
  }
})

// ────────────────────────────────────────
// POST /api/auth/connexion
// ────────────────────────────────────────
router.post('/connexion', [
  body('email').isEmail().withMessage('Email invalide'),
  body('motDePasse').notEmpty().withMessage('Mot de passe requis'),
], async (req, res) => {
  const erreurs = validationResult(req)
  if (!erreurs.isEmpty()) {
    return res.status(400).json({ erreurs: erreurs.array() })
  }

  const { email, motDePasse } = req.body

  try {
    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } })
    if (!utilisateur) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    const valide = await bcrypt.compare(motDePasse, utilisateur.motDePasse)
    if (!valide) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Mettre à jour la dernière activité
    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { derniereActivite: new Date() }
    })

    const token = genererToken(utilisateur)
    const { motDePasse: _, ...utilisateurSansMdp } = utilisateur

    res.json({ token, utilisateur: utilisateurSansMdp })

  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion', detail: err.message })
  }
})

module.exports = router
