const prisma = require('../prisma')

async function verifierEtAttribuerBadges(utilisateurId) {
  const [utilisateur, tousLesBadges, badgesUtilisateur] = await Promise.all([
    prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: { xpTotal: true, streak: true, _count: { select: { tentatives: true } } }
    }),
    prisma.badge.findMany(),
    prisma.badgeUtilisateur.findMany({ where: { utilisateurId }, select: { badgeId: true } })
  ])

  if (!utilisateur) return []

  const badgesDejaObtenus = new Set(badgesUtilisateur.map(b => b.badgeId))
  const nbQuiz = utilisateur._count.tentatives

  const nouveauxBadges = []
  for (const badge of tousLesBadges) {
    if (badgesDejaObtenus.has(badge.id)) continue
    const { type, valeur } = badge.condition
    let obtenu = false
    if (type === 'quiz_complete') obtenu = nbQuiz >= valeur
    else if (type === 'xp_total')    obtenu = utilisateur.xpTotal >= valeur
    else if (type === 'streak')      obtenu = utilisateur.streak >= valeur

    if (obtenu) {
      await prisma.badgeUtilisateur.create({ data: { utilisateurId, badgeId: badge.id } })
      nouveauxBadges.push(badge)
    }
  }
  return nouveauxBadges
}

module.exports = { verifierEtAttribuerBadges }
