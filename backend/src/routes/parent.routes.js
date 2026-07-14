const express = require('express')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')

const router = express.Router()

// GET /api/parents/tableau-de-bord
router.get('/tableau-de-bord', authentifier, autoriser('PARENT', 'ADMIN'), async (req, res) => {
  try {
    const liens = await prisma.lienParentEnfant.findMany({
      where: { parentId: req.utilisateur.id },
      include: {
        enfant: {
          select: {
            id: true, nom: true, prenom: true, niveau: true, classe: true, ecole: true,
            xpTotal: true, streak: true, estPremium: true,
            progressions: {
              include: {
                chapitre: { select: { titre: true, cours: { select: { titre: true, matiere: true } } } }
              },
              orderBy: { misAJourLe: 'desc' },
              take: 5
            },
            badges: { include: { badge: true }, orderBy: { obtenuLe: 'desc' }, take: 6 },
            tentatives: {
              include: { quiz: { select: { titre: true, chapitreId: true } } },
              orderBy: { commenceLe: 'desc' },
              take: 10
            }
          }
        }
      }
    })
    res.json(liens.map(l => l.enfant))
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

// GET /api/parents/alertes/enfant/:id
// Alertes calculées : matières avec score moyen < 50% sur 3+ tentatives
router.get('/alertes/enfant/:id', authentifier, autoriser('PARENT', 'ADMIN'), async (req, res) => {
  try {
    if (req.utilisateur.role === 'PARENT') {
      const lien = await prisma.lienParentEnfant.findFirst({
        where: { parentId: req.utilisateur.id, enfantId: req.params.id }
      })
      if (!lien) return res.status(403).json({ message: 'Accès refusé' })
    }

    const tentatives = await prisma.tentative.findMany({
      where: { utilisateurId: req.params.id },
      include: { quiz: { include: { chapitre: { include: { cours: { select: { matiere: true } } } } } } }
    })

    const parMatiere = {}
    tentatives.forEach(t => {
      const matiere = t.quiz?.chapitre?.cours?.matiere
      if (!matiere) return
      if (!parMatiere[matiere]) parMatiere[matiere] = []
      parMatiere[matiere].push(t.score)
    })

    const alertes = []
    const LABELS = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
    Object.entries(parMatiere).forEach(([matiere, scores]) => {
      if (scores.length >= 3) {
        const moy = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        if (moy < 50) {
          alertes.push({ matiere, label: LABELS[matiere] || matiere, scoreMoyen: moy, nbTentatives: scores.length })
        }
      }
    })

    res.json(alertes)
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

// POST /api/parents/lier-enfant
router.post('/lier-enfant', authentifier, autoriser('PARENT', 'ADMIN'), async (req, res) => {
  const { emailEnfant } = req.body
  if (!emailEnfant) return res.status(400).json({ message: 'emailEnfant requis' })
  try {
    const enfant = await prisma.utilisateur.findUnique({ where: { email: emailEnfant } })
    if (!enfant) return res.status(404).json({ message: 'Aucun élève trouvé avec cet email' })
    if (enfant.role !== 'ELEVE') return res.status(400).json({ message: 'Ce compte n\'est pas un compte élève' })

    await prisma.lienParentEnfant.upsert({
      where: { parentId_enfantId: { parentId: req.utilisateur.id, enfantId: enfant.id } },
      update: {},
      create: { parentId: req.utilisateur.id, enfantId: enfant.id }
    })

    res.json({ message: `${enfant.prenom} ${enfant.nom} lié à votre compte.`, enfant: { id: enfant.id, nom: enfant.nom, prenom: enfant.prenom } })
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

// DELETE /api/parents/lier-enfant/:enfantId
router.delete('/lier-enfant/:enfantId', authentifier, autoriser('PARENT', 'ADMIN'), async (req, res) => {
  try {
    await prisma.lienParentEnfant.deleteMany({
      where: { parentId: req.utilisateur.id, enfantId: req.params.enfantId }
    })
    res.json({ message: 'Lien supprimé' })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

module.exports = router
