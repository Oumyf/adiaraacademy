const express = require('express')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')

const router = express.Router()

const INCLUDE_PROF = {
  utilisateur: {
    select: { id: true, nom: true, prenom: true, niveau: true, ecole: true, xpTotal: true }
  }
}

// GET /api/professeurs — liste publique (tous les profs vérifiés)
router.get('/', async (req, res) => {
  try {
    const { matiere, ville } = req.query
    const profils = await prisma.profilProfesseur.findMany({
      where: {
        verifie: true,
        disponible: true,
        ...(matiere && { matieres: { has: matiere } }),
        ...(ville && { ville: { contains: ville, mode: 'insensitive' } })
      },
      include: INCLUDE_PROF,
      orderBy: { creeLe: 'desc' }
    })
    res.json(profils)
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

// GET /api/professeurs/ma-candidature — profil du prof connecté (y compris non vérifié)
router.get('/ma-candidature', authentifier, async (req, res) => {
  try {
    const profil = await prisma.profilProfesseur.findUnique({ where: { userId: req.utilisateur.id } })
    res.json(profil || null)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// GET /api/professeurs/admin/candidatures — admin : toutes les candidatures en attente
// Doit être AVANT /:id pour ne pas être capturé par le paramètre
router.get('/admin/candidatures', authentifier, autoriser('ADMIN'), async (req, res) => {
  try {
    const candidatures = await prisma.profilProfesseur.findMany({
      where: { verifie: false },
      include: INCLUDE_PROF,
      orderBy: { creeLe: 'desc' }
    })
    res.json(candidatures)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// GET /api/professeurs/:id — profil public
router.get('/:id', async (req, res) => {
  try {
    const profil = await prisma.profilProfesseur.findUnique({
      where: { id: req.params.id },
      include: INCLUDE_PROF
    })
    if (!profil) return res.status(404).json({ message: 'Profil introuvable' })
    res.json(profil)
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// POST /api/professeurs/candidature — soumettre sa candidature
router.post('/candidature', authentifier, async (req, res) => {
  const { bio, matieres, tarifHeure, ville } = req.body
  if (!bio || !matieres?.length || !ville) {
    return res.status(400).json({ message: 'bio, matieres (tableau) et ville sont requis' })
  }
  try {
    const profil = await prisma.profilProfesseur.upsert({
      where: { userId: req.utilisateur.id },
      update: { bio, matieres, tarifHeure: tarifHeure ? Number(tarifHeure) : null, ville },
      create: { userId: req.utilisateur.id, bio, matieres, tarifHeure: tarifHeure ? Number(tarifHeure) : null, ville, verifie: false, disponible: true }
    })
    res.status(201).json({
      message: 'Candidature soumise. Notre équipe vérifiera votre profil sous 48h.',
      profil
    })
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

// PATCH /api/professeurs/:id/verifier — admin seulement
router.patch('/:id/verifier', authentifier, autoriser('ADMIN'), async (req, res) => {
  try {
    const profil = await prisma.profilProfesseur.update({
      where: { id: req.params.id },
      data: { verifie: true },
      include: INCLUDE_PROF
    })
    await prisma.utilisateur.update({
      where: { id: profil.userId },
      data: { role: 'PROFESSEUR' }
    })
    res.json({ message: 'Profil vérifié et rôle PROFESSEUR accordé', profil })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

module.exports = router
