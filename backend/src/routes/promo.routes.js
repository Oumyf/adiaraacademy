const express = require('express')
const prisma = require('../prisma')
const { authentifier, autoriser } = require('../middleware/auth.middleware')
const {
  NB_PAIEMENTS_REMISE, NB_PAIEMENTS_COMMIS,
  normaliserCode, genererCodeUnique, calculerPrix, rattacherCode, nbPaiementsEffectues
} = require('../helpers/promo')

const router = express.Router()

// GET /api/promo/verifier/:code — public : le code est-il valable, et quelle réduction donne-t-il ?
router.get('/verifier/:code', async (req, res) => {
  try {
    const code = await prisma.codePromo.findUnique({
      where: { code: normaliserCode(req.params.code) },
      include: { proprietaire: { select: { prenom: true } } }
    })
    if (!code || !code.actif) return res.json({ valide: false })
    res.json({
      valide: true,
      reductionPct: code.reductionPct,
      nbPaiements: NB_PAIEMENTS_REMISE,
      partenaire: code.proprietaire.prenom
    })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// POST /api/promo/appliquer — utilisateur connecté, avant son premier paiement
router.post('/appliquer', authentifier, async (req, res) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ message: 'Code requis.' })
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.utilisateur.id },
      select: { codePromoUtiliseId: true, estPremium: true }
    })
    if (user.codePromoUtiliseId) return res.status(400).json({ message: 'Un code est déjà associé à ton compte.' })
    if (await nbPaiementsEffectues(req.utilisateur.id) > 0 || user.estPremium)
      return res.status(400).json({ message: 'Un code ne peut être ajouté qu\'avant le premier paiement.' })

    const r = await rattacherCode(req.utilisateur.id, code)
    if (!r.ok) return res.status(400).json({ message: r.message })
    res.json({ message: 'Code appliqué.', prix: await calculerPrix(req.utilisateur.id) })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// GET /api/promo/prix — prix que l'utilisateur connecté paiera
router.get('/prix', authentifier, async (req, res) => {
  try { res.json(await calculerPrix(req.utilisateur.id)) }
  catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// GET /api/promo/mon-code — tableau de bord du partenaire
router.get('/mon-code', authentifier, async (req, res) => {
  try {
    const code = await prisma.codePromo.findUnique({
      where: { proprietaireId: req.utilisateur.id },
      include: {
        parraines: { select: { id: true, prenom: true, nom: true, creeLe: true, estPremium: true }, orderBy: { creeLe: 'desc' } },
        commissions: { orderBy: { creeLe: 'desc' } }
      }
    })
    if (!code) return res.json({ code: null })

    const aPayer = code.commissions.filter(c => c.statut === 'A_PAYER').reduce((s, c) => s + c.montant, 0)
    const payee  = code.commissions.filter(c => c.statut === 'PAYEE').reduce((s, c) => s + c.montant, 0)
    const payants = new Set(code.commissions.map(c => c.eleveId)).size

    res.json({
      code: code.code,
      actif: code.actif,
      reductionPct: code.reductionPct,
      commissionPct: code.commissionPct,
      nbPaiementsRemise: NB_PAIEMENTS_REMISE,
      nbPaiementsCommission: NB_PAIEMENTS_COMMIS,
      stats: { inscrits: code.parraines.length, abonnesPayants: payants, aPayer, payee },
      // pas d'e-mail : seulement le prénom et l'initiale du nom
      eleves: code.parraines.map(p => ({
        id: p.id, nom: `${p.prenom} ${(p.nom || '').charAt(0).toUpperCase()}.`, inscritLe: p.creeLe, premium: p.estPremium
      })),
      commissions: code.commissions.map(c => ({ id: c.id, montant: c.montant, statut: c.statut, creeLe: c.creeLe, payeeLe: c.payeeLe }))
    })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// ---------- Administration ----------

// GET /api/promo/admin — tous les codes avec les montants à verser
router.get('/admin', authentifier, autoriser('ADMIN'), async (req, res) => {
  try {
    const codes = await prisma.codePromo.findMany({
      include: {
        proprietaire: { select: { prenom: true, nom: true, email: true } },
        parraines: { select: { id: true } },
        commissions: true
      },
      orderBy: { creeLe: 'desc' }
    })
    res.json(codes.map(c => ({
      id: c.id, code: c.code, actif: c.actif,
      reductionPct: c.reductionPct, commissionPct: c.commissionPct,
      partenaire: `${c.proprietaire.prenom} ${c.proprietaire.nom}`, email: c.proprietaire.email,
      inscrits: c.parraines.length,
      aPayer: c.commissions.filter(x => x.statut === 'A_PAYER').reduce((s, x) => s + x.montant, 0),
      payee:  c.commissions.filter(x => x.statut === 'PAYEE').reduce((s, x) => s + x.montant, 0),
      references: c.commissions.filter(x => x.statut === 'A_PAYER').map(x => x.referenceTransaction)
    })))
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

// POST /api/promo/admin — créer un code pour un utilisateur existant (par e-mail)
router.post('/admin', authentifier, autoriser('ADMIN'), async (req, res) => {
  const { email, code, reductionPct, commissionPct } = req.body
  if (!email) return res.status(400).json({ message: 'E-mail du partenaire requis.' })
  const red = reductionPct === undefined || reductionPct === '' ? 20 : parseInt(reductionPct, 10)
  const com = commissionPct === undefined || commissionPct === '' ? 20 : parseInt(commissionPct, 10)
  if (!(red >= 0 && red <= 50) || !(com >= 0 && com <= 50))
    return res.status(400).json({ message: 'La réduction et la commission doivent être comprises entre 0 et 50 %.' })
  try {
    const user = await prisma.utilisateur.findUnique({ where: { email: String(email).trim().toLowerCase() } })
    if (!user) return res.status(404).json({ message: 'Aucun compte avec cet e-mail. Le partenaire doit d\'abord créer son compte.' })
    if (await prisma.codePromo.findUnique({ where: { proprietaireId: user.id } }))
      return res.status(409).json({ message: 'Ce partenaire a déjà un code.' })

    const codeFinal = code ? normaliserCode(code) : await genererCodeUnique(user.prenom)
    if (await prisma.codePromo.findUnique({ where: { code: codeFinal } }))
      return res.status(409).json({ message: 'Ce code existe déjà.' })

    const cree = await prisma.codePromo.create({
      data: { code: codeFinal, proprietaireId: user.id, reductionPct: red, commissionPct: com }
    })
    res.status(201).json(cree)
  } catch (err) { res.status(500).json({ message: 'Erreur', detail: err.message }) }
})

// PATCH /api/promo/admin/:id/actif — activer ou désactiver un code
router.patch('/admin/:id/actif', authentifier, autoriser('ADMIN'), async (req, res) => {
  try {
    const c = await prisma.codePromo.update({ where: { id: req.params.id }, data: { actif: !!req.body.actif } })
    res.json(c)
  } catch (err) { res.status(404).json({ message: 'Code introuvable' }) }
})

// POST /api/promo/admin/:id/payer — marque toutes les commissions à payer de ce code comme versées
router.post('/admin/:id/payer', authentifier, autoriser('ADMIN'), async (req, res) => {
  try {
    const r = await prisma.commission.updateMany({
      where: { codePromoId: req.params.id, statut: 'A_PAYER' },
      data: { statut: 'PAYEE', payeeLe: new Date() }
    })
    res.json({ message: `${r.count} commission(s) marquée(s) comme versée(s).`, nombre: r.count })
  } catch (err) { res.status(500).json({ message: 'Erreur' }) }
})

module.exports = router
