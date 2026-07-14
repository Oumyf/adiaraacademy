const express = require('express')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')
const { envoyerEmail, emailRappelStreak, emailExpirationProche } = require('../helpers/email')

const router = express.Router()

// POST /api/notifications/streak-rappel — déclenché par cron (ADMIN)
// Envoie un email aux utilisateurs qui ont un streak > 2 et ne se sont pas connectés aujourd'hui
router.post('/streak-rappel', authentifier, autoriser('ADMIN'), async (req, res) => {
  try {
    const aujourd_hui = new Date(); aujourd_hui.setHours(0, 0, 0, 0)

    const utilisateurs = await prisma.utilisateur.findMany({
      where: {
        streak: { gt: 2 },
        derniereActivite: { lt: aujourd_hui }
      },
      select: { id: true, email: true, prenom: true, streak: true }
    })

    let envoyes = 0
    for (const user of utilisateurs) {
      const { sujet, html } = emailRappelStreak(user.prenom, user.streak)
      await envoyerEmail({ destinataire: user.email, sujet, html })
      envoyes++
    }

    res.json({ message: `${envoyes} rappel(s) envoyé(s)`, total: utilisateurs.length })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// POST /api/notifications/expiration-prochaine — alerte 7 jours avant expiration (ADMIN)
router.post('/expiration-prochaine', authentifier, autoriser('ADMIN'), async (req, res) => {
  try {
    const dans7jours = new Date()
    dans7jours.setDate(dans7jours.getDate() + 7)
    const dans8jours = new Date(dans7jours)
    dans8jours.setDate(dans8jours.getDate() + 1)

    const abonnements = await prisma.abonnement.findMany({
      where: {
        statut: 'ACTIF',
        dateFin: { gte: dans7jours, lt: dans8jours }
      },
      include: { utilisateur: { select: { email: true, prenom: true } } }
    })

    let envoyes = 0
    for (const abo of abonnements) {
      const joursRestants = Math.ceil((new Date(abo.dateFin) - new Date()) / 86400000)
      const { sujet, html } = emailExpirationProche(abo.utilisateur.prenom, joursRestants)
      await envoyerEmail({ destinataire: abo.utilisateur.email, sujet, html })
      envoyes++
    }

    res.json({ message: `${envoyes} alerte(s) d'expiration envoyée(s)` })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

module.exports = router
