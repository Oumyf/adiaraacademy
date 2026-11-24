const prisma = require('../prisma')

// Réglages du programme ambassadeur (modifiables par variables d'environnement)
const MONTANT_BASE_FCFA   = 2900
const NB_PAIEMENTS_REMISE = parseInt(process.env.PROMO_NB_PAIEMENTS_REMISE || '3', 10)     // l'élève profite de la réduction sur ses N premiers paiements
const NB_PAIEMENTS_COMMIS = parseInt(process.env.PROMO_NB_PAIEMENTS_COMMISSION || '6', 10) // le prof touche une commission sur les N premiers paiements de chaque élève

const normaliserCode = (c) => String(c || '').trim().toUpperCase().replace(/\s+/g, '')

function sansAccents(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
}

async function genererCodeUnique(prenom) {
  const base = 'PROF-' + sansAccents(prenom).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10)
  for (let i = 0; i < 20; i++) {
    const code = i === 0 ? base : base + Math.floor(10 + Math.random() * 90)
    if (!(await prisma.codePromo.findUnique({ where: { code } }))) return code
  }
  return base + Date.now().toString().slice(-4)
}

// Nombre de paiements réellement activés pour cet élève (hors activations manuelles gratuites)
async function nbPaiementsEffectues(utilisateurId) {
  return prisma.abonnement.count({
    where: { utilisateurId, montant: { gt: 0 }, dateDebut: { not: null } }
  })
}

// Prix que doit payer cet élève pour son prochain abonnement
async function calculerPrix(utilisateurId) {
  const user = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
    select: { codePromoUtilise: true }
  })
  const code = user?.codePromoUtilise
  if (!code || !code.actif) return { montant: MONTANT_BASE_FCFA, montantInitial: MONTANT_BASE_FCFA, reductionPct: 0, code: null }

  const deja = await nbPaiementsEffectues(utilisateurId)
  if (deja >= NB_PAIEMENTS_REMISE) return { montant: MONTANT_BASE_FCFA, montantInitial: MONTANT_BASE_FCFA, reductionPct: 0, code: code.code }

  const montant = Math.round(MONTANT_BASE_FCFA * (100 - code.reductionPct) / 100)
  return { montant, montantInitial: MONTANT_BASE_FCFA, reductionPct: code.reductionPct, code: code.code }
}

// À appeler une fois le paiement confirmé : crée la commission du prof (une seule par abonnement)
async function enregistrerCommission(abonnementId) {
  const abonnement = await prisma.abonnement.findUnique({
    where: { id: abonnementId },
    include: { utilisateur: { include: { codePromoUtilise: true } } }
  })
  if (!abonnement || abonnement.montant <= 0) return null
  const code = abonnement.utilisateur.codePromoUtilise
  if (!code || !code.actif) return null

  const existante = await prisma.commission.findUnique({ where: { abonnementId } })
  if (existante) return existante

  // rang de ce paiement parmi les paiements de l'élève
  const rang = await prisma.abonnement.count({
    where: {
      utilisateurId: abonnement.utilisateurId,
      montant: { gt: 0 },
      dateDebut: { not: null },
      creeLe: { lte: abonnement.creeLe }
    }
  })
  if (rang > NB_PAIEMENTS_COMMIS) return null

  const montant = Math.floor(abonnement.montant * code.commissionPct / 100)
  if (montant <= 0) return null
  return prisma.commission.create({
    data: {
      codePromoId: code.id,
      abonnementId,
      eleveId: abonnement.utilisateurId,
      montantBase: abonnement.montant,
      montant,
      referenceTransaction: abonnement.referenceTransaction
    }
  })
}

// Rattache un élève ou un parent à un code (inscription ou avant le premier paiement)
async function rattacherCode(utilisateurId, codeSaisi) {
  const code = await prisma.codePromo.findUnique({ where: { code: normaliserCode(codeSaisi) } })
  if (!code || !code.actif) return { ok: false, message: 'Ce code promo n\'existe pas ou n\'est plus valable.' }
  if (code.proprietaireId === utilisateurId) return { ok: false, message: 'Tu ne peux pas utiliser ton propre code.' }
  await prisma.utilisateur.update({ where: { id: utilisateurId }, data: { codePromoUtiliseId: code.id } })
  return { ok: true, code }
}

module.exports = {
  MONTANT_BASE_FCFA, NB_PAIEMENTS_REMISE, NB_PAIEMENTS_COMMIS,
  normaliserCode, genererCodeUnique, calculerPrix, enregistrerCommission, rattacherCode, nbPaiementsEffectues
}
