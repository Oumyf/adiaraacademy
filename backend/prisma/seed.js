const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('Seed AdiaraAcademy...')
  const badges = [
    { nom: 'Premier pas',   description: 'Premier quiz complete',    icone: 'cible',   condition: { type: 'quiz_complete', valeur: 1 } },
    { nom: 'Assidu',        description: '7 jours de streak',        icone: 'feu',     condition: { type: 'streak',        valeur: 7 } },
    { nom: 'Centenaire',    description: '100 XP accumules',         icone: 'etoile',  condition: { type: 'xp_total',      valeur: 100 } },
    { nom: 'Mathematicien', description: '500 XP accumules',         icone: 'calcul',  condition: { type: 'xp_total',      valeur: 500 } },
    { nom: 'Expert',        description: '1000 XP accumules',        icone: 'trophee', condition: { type: 'xp_total',      valeur: 1000 } },
    { nom: 'Quiz master',   description: '10 quiz completes',        icone: 'ampoule', condition: { type: 'quiz_complete', valeur: 10 } },
  ]
  for (const b of badges) {
    await prisma.badge.upsert({ where: { nom: b.nom }, update: {}, create: b })
  }
  console.log('OK - Badges crees')

  const hash = await bcrypt.hash('admin1234', 12)
  await prisma.utilisateur.upsert({
    where: { email: 'admin@adiaraacademy.sn' },
    update: {},
    create: { nom: 'Admin', prenom: 'AdiaraAcademy', email: 'admin@adiaraacademy.sn', motDePasse: hash, role: 'ADMIN', niveau: 'UNIVERSITE' }
  })
  console.log('OK - Admin cree : admin@adiaraacademy.sn / admin1234')
  console.log('Seed termine !')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
