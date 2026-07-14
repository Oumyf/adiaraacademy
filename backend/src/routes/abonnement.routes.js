const express = require('express')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')
const { envoyerEmail, emailBienvenuePremi } = require('../helpers/email')

const router = express.Router()

const DUREE_JOURS  = 30
const MONTANT_FCFA = 2900

function genererReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let ref = 'AA-'
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)]
  return ref
}

async function activerPremium(utilisateurId, abonnementId) {
  const dateDebut = new Date()
  const dateFin   = new Date(dateDebut)
  dateFin.setDate(dateFin.getDate() + DUREE_JOURS)

  await prisma.abonnement.update({
    where: { id: abonnementId },
    data: { statut: 'ACTIF', dateDebut, dateFin }
  })
  await prisma.utilisateur.update({
    where: { id: utilisateurId },
    data: { estPremium: true }
  })
  return dateFin
}

// GET /api/abonnements/statut — statut abonnement + auto-expiration
router.get('/statut', authentifier, async (req, res) => {
  const utilisateurId = req.utilisateur.id
  try {
    const [user, abonnementActif] = await Promise.all([
      prisma.utilisateur.findUnique({ where: { id: utilisateurId }, select: { estPremium: true } }),
      prisma.abonnement.findFirst({
        where: { utilisateurId, statut: 'ACTIF' },
        orderBy: { dateFin: 'desc' }
      })
    ])

    if (abonnementActif && abonnementActif.dateFin && abonnementActif.dateFin < new Date()) {
      await prisma.abonnement.update({ where: { id: abonnementActif.id }, data: { statut: 'EXPIRE' } })
      await prisma.utilisateur.update({ where: { id: utilisateurId }, data: { estPremium: false } })
      return res.json({ premium: false, abonnement: null, expire: true })
    }

    res.json({
      premium: user?.estPremium ?? false,
      abonnement: abonnementActif ? {
        dateFin:         abonnementActif.dateFin,
        methodePaiement: abonnementActif.methodePaiement,
        joursRestants:   abonnementActif.dateFin
          ? Math.max(0, Math.ceil((new Date(abonnementActif.dateFin) - new Date()) / 86400000))
          : null
      } : null
    })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// POST /api/abonnements/initier — crée un abonnement EN_ATTENTE, retourne les instructions de paiement
router.post('/initier', authentifier, async (req, res) => {
  const { methodePaiement } = req.body
  if (!['ORANGE_MONEY', 'WAVE'].includes(methodePaiement)) {
    return res.status(400).json({ message: 'Méthode invalide. Choisissez ORANGE_MONEY ou WAVE.' })
  }
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.utilisateur.id },
      select: { estPremium: true }
    })
    if (user?.estPremium) return res.status(400).json({ message: 'Vous êtes déjà Premium.' })

    // Annuler les EN_ATTENTE précédents pour cet utilisateur
    await prisma.abonnement.updateMany({
      where: { utilisateurId: req.utilisateur.id, statut: 'EN_ATTENTE' },
      data: { statut: 'ANNULE' }
    })

    const reference = genererReference()
    const abonnement = await prisma.abonnement.create({
      data: {
        utilisateurId:        req.utilisateur.id,
        statut:               'EN_ATTENTE',
        montant:              MONTANT_FCFA,
        methodePaiement,
        referenceTransaction: reference
      }
    })

    const instructions = methodePaiement === 'ORANGE_MONEY'
      ? {
          type:    'ORANGE_MONEY',
          // TODO: remplacer par le vrai numéro marchand Orange Money
          numero:  '77 XXX XXXX',
          ussd:    `*144*1*77XXXXXXX*${MONTANT_FCFA}#`,
          message: `Envoyez ${MONTANT_FCFA} FCFA au 77 XXX XXXX. Objet : ${reference}`
        }
      : {
          type:    'WAVE',
          // TODO: intégrer l'API Wave Checkout (checkout.wave.com)
          message: `Envoyez ${MONTANT_FCFA} FCFA via Wave. Objet : ${reference}`
        }

    res.json({ reference, abonnementId: abonnement.id, instructions, montant: MONTANT_FCFA })
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

// POST /api/abonnements/confirmer-test — SIMULATION paiement (dev/bêta uniquement)
router.post('/confirmer-test', authentifier, async (req, res) => {
  const { reference } = req.body
  if (!reference) return res.status(400).json({ message: 'reference requise' })
  try {
    const abonnement = await prisma.abonnement.findUnique({ where: { referenceTransaction: reference } })
    if (!abonnement)
      return res.status(404).json({ message: 'Référence introuvable.' })
    if (abonnement.utilisateurId !== req.utilisateur.id)
      return res.status(403).json({ message: 'Cette référence ne vous appartient pas.' })
    if (abonnement.statut !== 'EN_ATTENTE')
      return res.status(400).json({ message: 'Abonnement déjà traité.' })

    const dateFin = await activerPremium(req.utilisateur.id, abonnement.id)

    const user = await prisma.utilisateur.findUnique({
      where: { id: req.utilisateur.id },
      select: { email: true, prenom: true }
    })
    const { sujet, html } = emailBienvenuePremi(user.prenom, dateFin)
    await envoyerEmail({ destinataire: user.email, sujet, html })

    res.json({ message: 'Paiement confirmé ! Compte Premium activé.', dateFin, premium: true })
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

// POST /api/abonnements/webhook — reçoit les callbacks de paiement réels (OM / Wave)
router.post('/webhook', express.raw({ type: '*/*' }), async (req, res) => {
  // TODO: vérifier la signature HMAC une fois les vraies clés API disponibles
  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { reference, statut } = payload

    if (statut !== 'SUCCESS' || !reference)
      return res.status(400).json({ message: 'Webhook invalide' })

    const abonnement = await prisma.abonnement.findUnique({ where: { referenceTransaction: reference } })
    if (!abonnement || abonnement.statut !== 'EN_ATTENTE')
      return res.status(404).json({ message: 'Abonnement introuvable ou déjà traité' })

    const dateFin = await activerPremium(abonnement.utilisateurId, abonnement.id)

    const user = await prisma.utilisateur.findUnique({
      where: { id: abonnement.utilisateurId },
      select: { email: true, prenom: true }
    })
    const { sujet, html } = emailBienvenuePremi(user.prenom, dateFin)
    await envoyerEmail({ destinataire: user.email, sujet, html })

    res.json({ received: true })
  } catch (err) { res.status(500).json({ message: 'Erreur webhook' }) }
})

// DELETE /api/abonnements/annuler — annule l'abonnement actif (pas de remboursement auto)
router.delete('/annuler', authentifier, async (req, res) => {
  try {
    const abonnement = await prisma.abonnement.findFirst({
      where: { utilisateurId: req.utilisateur.id, statut: 'ACTIF' }
    })
    if (!abonnement) return res.status(404).json({ message: 'Aucun abonnement actif.' })

    await prisma.abonnement.update({ where: { id: abonnement.id }, data: { statut: 'ANNULE' } })
    await prisma.utilisateur.update({ where: { id: req.utilisateur.id }, data: { estPremium: false } })

    res.json({ message: 'Abonnement annulé. Accès Premium révoqué immédiatement.' })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// PATCH /api/abonnements/activer — activation manuelle ADMIN
router.patch('/activer', authentifier, autoriser('ADMIN'), async (req, res) => {
  const { userId } = req.body
  if (!userId) return res.status(400).json({ message: 'userId requis' })
  try {
    const dateDebut = new Date()
    const dateFin   = new Date(dateDebut)
    dateFin.setDate(dateFin.getDate() + DUREE_JOURS)

    const reference = genererReference()
    await prisma.abonnement.create({
      data: {
        utilisateurId:        userId,
        statut:               'ACTIF',
        montant:              0,
        methodePaiement:      'ORANGE_MONEY',
        referenceTransaction: reference,
        dateDebut,
        dateFin
      }
    })
    const user = await prisma.utilisateur.update({
      where: { id: userId },
      data: { estPremium: true },
      select: { id: true, nom: true, prenom: true, email: true, estPremium: true }
    })
    res.json({ message: 'Compte Premium activé manuellement', utilisateur: user, dateFin })
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

// Garder /souscrire pour la compatibilité (redirige vers confirmer-test sans référence)
router.post('/souscrire', authentifier, async (req, res) => {
  try {
    const reference = genererReference()
    const abonnement = await prisma.abonnement.create({
      data: {
        utilisateurId:        req.utilisateur.id,
        statut:               'EN_ATTENTE',
        montant:              0,
        methodePaiement:      'ORANGE_MONEY',
        referenceTransaction: reference
      }
    })
    const dateFin = await activerPremium(req.utilisateur.id, abonnement.id)
    res.json({ message: 'Compte Premium activé (mode test)', dateFin, premium: true })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

module.exports = router
