// Lecture et validation des cours écrits en Markdown dans prisma/contenu/*.md
// Format : voir prisma/contenu/LISEZMOI.md
const fs = require('fs')
const path = require('path')

const DIFF = { F: 'FACILE', M: 'MOYEN', D: 'DIFFICILE' }
const MATIERES = ['MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE']
const NIVEAUX = ['COLLEGE', 'LYCEE', 'UNIVERSITE']

// Mélange stable (même résultat à chaque chargement) pour que la bonne réponse
// ne soit pas toujours à la même place.
function melanger(options, graine) {
  let h = 2166136261
  for (const c of graine) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0 }
  const rnd = () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296 }
  const a = [...options]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

function lireQuiz(bloc, ctx, erreurs) {
  const lignes = bloc.split('\n')
  const entete = lignes.shift().replace(/^---\s*QUIZ\s*:?/i, '').trim()
  const [titre, ...opts] = entete.split('|').map(s => s.trim())
  const meta = Object.fromEntries(opts.map(o => o.split(':').map(s => s.trim())))
  const questions = []
  let q = null
  for (const l of lignes) {
    let m
    if ((m = l.match(/^\?\s*\[([FMD])\]\s*(.+)$/))) {
      q = { difficulte: DIFF[m[1]], enonce: m[2].trim(), options: [], reponseCorrecte: null, explication: '' }
      questions.push(q)
    } else if (q && (m = l.match(/^-\s+(.+?)(\s+\[ok\])?\s*$/))) {
      q.options.push(m[1].trim())
      if (m[2]) { if (q.reponseCorrecte !== null) erreurs.push(`${ctx} : deux bonnes réponses pour « ${q.enonce.slice(0, 50)} »`); q.reponseCorrecte = m[1].trim() }
    } else if (q && (m = l.match(/^>\s*(.+)$/))) {
      q.explication += (q.explication ? ' ' : '') + m[1].trim()
    }
  }
  questions.forEach((x, i) => {
    x.ordre = i + 1
    if (x.options.length === 4) x.options = melanger(x.options, x.enonce)
    const nom = `${ctx} question ${i + 1}`
    if (x.options.length !== 4) erreurs.push(`${nom} : 4 options attendues (${x.options.length} trouvées)`)
    if (new Set(x.options).size !== x.options.length) erreurs.push(`${nom} : options en double`)
    if (x.reponseCorrecte === null) erreurs.push(`${nom} : aucune bonne réponse marquée [ok]`)
    if (!x.explication) erreurs.push(`${nom} : explication manquante`)
  })
  if (questions.length < 6) erreurs.push(`${ctx} : au moins 6 questions attendues (${questions.length})`)
  if (new Set(questions.map(x => x.difficulte)).size < 2) erreurs.push(`${ctx} : il faut au moins 2 niveaux de difficulté`)
  return { titre, type: 'QCM', dureMin: Number(meta.duree) || Math.max(5, Math.round(questions.length * 0.9)), xpMax: Number(meta.xp) || 50, questions }
}

function lireFichier(fichier, erreurs) {
  const texte = fs.readFileSync(fichier, 'utf8').replace(/\r\n/g, '\n')
  const nom = path.basename(fichier)
  const [tete, ...chapitresBruts] = texte.split(/^---\s*CHAPITRE\s*:/m)
  const cours = { fichier: nom, chapitres: [] }
  for (const l of tete.split('\n')) {
    const m = l.match(/^(matiere|niveau|classe|titre|description|premium)\s*:\s*(.+)$/i)
    if (m) cours[m[1].toLowerCase()] = m[2].trim()
  }
  cours.premium = /^(oui|true|1)$/i.test(cours.premium || '')
  if (!MATIERES.includes(cours.matiere)) erreurs.push(`${nom} : matiere invalide (${cours.matiere})`)
  if (!NIVEAUX.includes(cours.niveau)) erreurs.push(`${nom} : niveau invalide (${cours.niveau})`)
  for (const k of ['titre', 'description', 'classe']) if (!cours[k]) erreurs.push(`${nom} : « ${k} » manquant`)

  chapitresBruts.forEach((brut, i) => {
    const [corps, ...quizBruts] = brut.split(/^(?=---\s*QUIZ)/m)
    const lignes = corps.split('\n')
    const entete = lignes.shift().trim()
    const [titre, ...opts] = entete.split('|').map(s => s.trim())
    const meta = Object.fromEntries(opts.map(o => o.split(':').map(s => s.trim())))
    const ctx = `${nom} chapitre ${i + 1}`
    const contenu = lignes.join('\n').trim()
    if (contenu.length < 600) erreurs.push(`${ctx} : leçon trop courte (${contenu.length} caractères)`)
    const quiz = quizBruts.map(b => lireQuiz(b, `${ctx} quiz`, erreurs))
    if (quiz.length === 0) erreurs.push(`${ctx} : aucun quiz`)
    cours.chapitres.push({ titre, ordre: i + 1, xpObtenu: Number(meta.xp) || 20, contenu: `# ${titre}\n\n${contenu}`, quiz })
  })
  if (cours.chapitres.length === 0) erreurs.push(`${nom} : aucun chapitre`)
  return cours
}

function lireContenu(dossier = path.join(__dirname, 'contenu')) {
  const erreurs = []
  const cours = fs.readdirSync(dossier).filter(f => f.endsWith('.md') && f.toUpperCase() !== 'LISEZMOI.MD').sort()
    .map(f => lireFichier(path.join(dossier, f), erreurs))
  return { cours, erreurs }
}

module.exports = { lireContenu }
