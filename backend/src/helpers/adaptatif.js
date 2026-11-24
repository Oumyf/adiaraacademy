// Quiz adaptatif — échelle de difficulté.
//  - On démarre au niveau MOYEN.
//  - 2 bonnes réponses d'affilée : on monte d'un niveau.
//  - 1 mauvaise réponse : on descend d'un niveau tout de suite.
//  - 5 questions au maximum.
// Tout est recalculé côté serveur à partir des réponses : l'élève ne peut pas tricher sur son niveau.

const NIVEAUX = ['FACILE', 'MOYEN', 'DIFFICILE']
const XP_PAR_NIVEAU = { FACILE: 6, MOYEN: 10, DIFFICILE: 16 }
const POIDS = { FACILE: 1, MOYEN: 2, DIFFICILE: 3 }
const NB_QUESTIONS = 5
const MIN_POOL = 6

const normaliser = (s) =>
  String(s ?? '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Un quiz est adaptatif s'il a assez de questions et au moins deux niveaux différents.
function estAdaptatif(questions) {
  if (!questions || questions.length < MIN_POOL) return false
  return new Set(questions.map(q => q.difficulte)).size >= 2
}

function totalQuestions(questions) {
  return Math.min(NB_QUESTIONS, questions.length)
}

// Rejoue l'historique (liste de { difficulte, estCorrecte }) et renvoie le niveau courant.
function niveauApres(historique) {
  let n = 1, serie = 0
  for (const h of historique) {
    if (h.estCorrecte) {
      serie++
      if (serie >= 2 && n < 2) { n++; serie = 0 }
      else if (serie >= 2) serie = 0
    } else {
      serie = 0
      if (n > 0) n--
    }
  }
  return { niveau: NIVEAUX[n], indice: n, serie }
}

// Choisit la prochaine question : au niveau visé, sinon au niveau le plus proche (on préfère plus facile).
function choisirQuestion(pool, dejaPosees, niveauIndice, hasard = Math.random) {
  const restantes = pool.filter(q => !dejaPosees.has(q.id))
  if (!restantes.length) return null
  for (const ecart of [0, -1, 1, -2, 2]) {
    const i = niveauIndice + ecart
    if (i < 0 || i > 2) continue
    const candidates = restantes.filter(q => q.difficulte === NIVEAUX[i])
    if (candidates.length) return candidates[Math.floor(hasard() * candidates.length)]
  }
  return restantes[0]
}

// historique brut du client : [{ questionId, reponse }] dans l'ordre. Correction refaite ici.
function reconstruire(pool, historiqueBrut) {
  const parId = new Map(pool.map(q => [q.id, q]))
  const vus = new Set()
  const hist = []
  for (const h of (Array.isArray(historiqueBrut) ? historiqueBrut : [])) {
    const q = parId.get(h?.questionId)
    if (!q || vus.has(q.id)) continue
    vus.add(q.id)
    hist.push({ question: q, difficulte: q.difficulte, estCorrecte: normaliser(h.reponse) === normaliser(q.reponseCorrecte), reponse: h.reponse ?? '' })
  }
  return hist
}

function questionSuivante(pool, historiqueBrut, hasard) {
  const hist = reconstruire(pool, historiqueBrut)
  const total = totalQuestions(pool)
  if (hist.length >= total) return { fini: true, total, repondues: hist.length }
  const { niveau, indice } = niveauApres(hist)
  const q = choisirQuestion(pool, new Set(hist.map(h => h.question.id)), indice, hasard)
  if (!q) return { fini: true, total, repondues: hist.length }
  return { fini: false, question: q, niveauVise: niveau, numero: hist.length + 1, total }
}

// Score pondéré et XP à partir des réponses données (clé = id de question).
function noter(pool, reponses) {
  const corrections = []
  let points = 0, pointsMax = 0, xp = 0, bonnes = 0
  for (const q of pool) {
    if (!(q.id in (reponses || {}))) continue
    const estCorrecte = normaliser(reponses[q.id]) === normaliser(q.reponseCorrecte)
    pointsMax += POIDS[q.difficulte]
    if (estCorrecte) { points += POIDS[q.difficulte]; xp += XP_PAR_NIVEAU[q.difficulte]; bonnes++ }
    corrections.push({ questionId: q.id, enonce: q.enonce, reponseDonnee: reponses[q.id] || '', reponseCorrecte: q.reponseCorrecte, estCorrecte, explication: q.explication, niveau: q.difficulte })
  }
  const score = pointsMax ? Math.round((points / pointsMax) * 100) : 0
  return { corrections, score, xp, bonnes, total: corrections.length }
}

module.exports = { estAdaptatif, totalQuestions, niveauApres, choisirQuestion, questionSuivante, noter, XP_PAR_NIVEAU, NIVEAUX }
