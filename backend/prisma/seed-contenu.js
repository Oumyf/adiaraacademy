// Charge les cours écrits dans prisma/contenu/*.md (sans toucher aux données existantes).
// Usage : npm run db:contenu            -> ajoute les cours qui n'existent pas encore
//         npm run db:contenu -- --verifier   -> contrôle les fichiers sans écrire en base
const { lireContenu } = require('./lireContenu')

async function main() {
  const { cours, erreurs } = lireContenu()
  const nbCh = cours.reduce((s, c) => s + c.chapitres.length, 0)
  const nbQ = cours.reduce((s, c) => s + c.chapitres.reduce((t, ch) => t + ch.quiz.reduce((u, q) => u + q.questions.length, 0), 0), 0)
  if (erreurs.length) {
    console.error(`\n${erreurs.length} problème(s) dans le contenu :`)
    erreurs.forEach(e => console.error('  - ' + e))
    process.exit(1)
  }
  console.log(`Contenu valide : ${cours.length} cours, ${nbCh} chapitres, ${nbQ} questions.`)
  if (process.argv.includes('--verifier')) return

  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()
  try {
    const auteur = await prisma.utilisateur.findUnique({ where: { email: 'prof@adiaraacademy.sn' } })
    if (!auteur) throw new Error("Le compte prof@adiaraacademy.sn n'existe pas : lance d'abord « npm run db:seed ».")
    let ajoutes = 0, ignores = 0
    for (const c of cours) {
      const existe = await prisma.cours.findFirst({ where: { titre: c.titre, classe: c.classe, matiere: c.matiere } })
      if (existe) { ignores++; continue }
      await prisma.cours.create({ data: {
        titre: c.titre, description: c.description, matiere: c.matiere, niveau: c.niveau, classe: c.classe,
        premium: c.premium, publie: true, auteurId: auteur.id,
        chapitres: { create: c.chapitres.map(ch => ({
          titre: ch.titre, ordre: ch.ordre, xpObtenu: ch.xpObtenu, contenu: ch.contenu,
          quiz: { create: ch.quiz.map(q => ({
            titre: q.titre, type: q.type, dureMin: q.dureMin, xpMax: q.xpMax,
            questions: { create: q.questions.map(x => ({ enonce: x.enonce, options: x.options, reponseCorrecte: x.reponseCorrecte, explication: x.explication, difficulte: x.difficulte, ordre: x.ordre })) },
          })) },
        })) },
      } })
      ajoutes++
    }
    console.log(`Ajoutés : ${ajoutes}. Déjà présents (ignorés) : ${ignores}.`)
  } finally { await prisma.$disconnect() }
}
main().catch(e => { console.error(e.message || e); process.exit(1) })
