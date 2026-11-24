import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import Icone from '../components/Icones'

const TYPES      = ['QCM', 'REPONSE_LIBRE', 'VRAI_FAUX']
const DIFFICULTES = ['FACILE', 'MOYEN', 'DIFFICILE']

const labelType = { QCM: 'QCM', REPONSE_LIBRE: 'Réponse libre', VRAI_FAUX: 'Vrai / Faux' }

const questionVide = (type) => ({
  enonce: '',
  options: type === 'QCM' ? ['', '', '', ''] : [],
  reponseCorrecte: type === 'VRAI_FAUX' ? 'Vrai' : '',
  explication: '',
  difficulte: 'MOYEN',
})

export default function CreerQuiz() {
  const { id: chapitreId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ titre: '', type: 'QCM', dureMin: '', xpMax: '50' })
  const [questions, setQuestions] = useState([questionVide('QCM')])
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const majForm = (f, val) => {
    setForm(p => ({ ...p, [f]: val }))
    if (f === 'type') setQuestions([questionVide(val)])
  }

  const majQuestion = (i, f, val) =>
    setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [f]: val } : q))

  const majOption = (qi, oi, val) =>
    setQuestions(qs => qs.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, j) => j === oi ? val : o) } : q))

  const ajouterQuestion = () => setQuestions(qs => [...qs, questionVide(form.type)])
  const supprimerQuestion = (i) => setQuestions(qs => qs.filter((_, idx) => idx !== i))

  const soumettre = async (e) => {
    e.preventDefault()
    if (!form.titre) return setErreur('Le titre est obligatoire.')
    for (const [i, q] of questions.entries()) {
      if (!q.enonce) return setErreur(`La question ${i + 1} n'a pas d'énoncé.`)
      if (!q.reponseCorrecte) return setErreur(`La question ${i + 1} n'a pas de réponse correcte.`)
      if (form.type === 'QCM' && q.options.some(o => !o.trim())) return setErreur(`La question ${i + 1} a des options vides.`)
    }
    setEnvoi(true)
    setErreur('')
    try {
      const payload = {
        chapitreId,
        titre: form.titre,
        type: form.type,
        dureMin: form.dureMin ? Number(form.dureMin) : undefined,
        xpMax: Number(form.xpMax) || 50,
        questions: questions.map(q => ({
          enonce: q.enonce,
          options: form.type === 'QCM' ? q.options : undefined,
          reponseCorrecte: q.reponseCorrecte,
          explication: q.explication || undefined,
          difficulte: q.difficulte,
        })),
      }
      await api.post('/quiz', payload)
      navigate(`/chapitres/${chapitreId}`)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la création.')
      setEnvoi(false)
    }
  }

  const niveaux = new Set(questions.map(q => q.difficulte)).size
  const adaptatif = questions.length >= 6 && niveaux >= 2

  return (
    <div className="form-page">
      <Link to={`/chapitres/${chapitreId}`} className="form-retour"><Icone nom="retour" taille={16} /> Retour au chapitre</Link>
      <h1>Créer un quiz</h1>
      <p className="form-intro">Ajoute autant de questions que nécessaire. Avec au moins 6 questions et deux niveaux de difficulté, le quiz devient adaptatif.</p>

      <form onSubmit={soumettre} style={{ display: 'grid', gap: '1.2rem' }}>
        <div className="form-carte">
          <h2 className="form-sous-titre">Informations générales</h2>
          <label className="champ-groupe">Titre *
            <input value={form.titre} onChange={e => majForm('titre', e.target.value)} placeholder="Ex : Quiz sur les équations du 1er degré" />
          </label>
          <div className="grille-3">
            <label className="champ-groupe">Type *
              <select value={form.type} onChange={e => majForm('type', e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{labelType[t]}</option>)}
              </select>
            </label>
            <label className="champ-groupe">Durée (minutes)
              <input type="number" min="1" value={form.dureMin} onChange={e => majForm('dureMin', e.target.value)} placeholder="Libre" />
            </label>
            <label className="champ-groupe">XP maximum
              <input type="number" min="0" value={form.xpMax} onChange={e => majForm('xpMax', e.target.value)} />
            </label>
          </div>
        </div>

        <div className={`note-adaptatif ${adaptatif ? 'ok' : ''}`} role="status">
          {adaptatif
            ? 'Quiz adaptatif activé : chaque élève reçoit 5 questions choisies selon ses réponses.'
            : `Pour rendre ce quiz adaptatif, il faut au moins 6 questions et deux niveaux de difficulté. Pour l'instant : ${questions.length} question${questions.length > 1 ? 's' : ''}, ${niveaux} niveau${niveaux > 1 ? 'x' : ''}.`}
        </div>

        {questions.map((q, i) => (
          <div key={i} className="form-carte">
            <div className="form-entete">
              <h2 className="form-sous-titre">Question {i + 1}</h2>
              {questions.length > 1 && (
                <button type="button" onClick={() => supprimerQuestion(i)} className="btn btn-danger btn-petit">Supprimer</button>
              )}
            </div>

            <label className="champ-groupe">Énoncé *
              <textarea rows={2} value={q.enonce} onChange={e => majQuestion(i, 'enonce', e.target.value)} placeholder="Quelle est la valeur de x dans 2x + 3 = 7 ?" />
            </label>

            {form.type === 'QCM' && (
              <div className="champ-groupe" role="group" aria-label="Options">
                <span>Options (4 choix) *</span>
                {q.options.map((opt, oi) => (
                  <input key={oi} value={opt} onChange={e => majOption(i, oi, e.target.value)} placeholder={`Option ${oi + 1}`} aria-label={`Option ${oi + 1}`} />
                ))}
              </div>
            )}

            <div className="grille-2">
              <label className="champ-groupe">Réponse correcte *
                {form.type === 'VRAI_FAUX' ? (
                  <select value={q.reponseCorrecte} onChange={e => majQuestion(i, 'reponseCorrecte', e.target.value)}>
                    <option value="Vrai">Vrai</option>
                    <option value="Faux">Faux</option>
                  </select>
                ) : (
                  <input value={q.reponseCorrecte} onChange={e => majQuestion(i, 'reponseCorrecte', e.target.value)} placeholder={form.type === 'QCM' ? 'Doit correspondre à une option' : 'Réponse attendue'} />
                )}
              </label>
              <label className="champ-groupe">Difficulté
                <select value={q.difficulte} onChange={e => majQuestion(i, 'difficulte', e.target.value)}>
                  {DIFFICULTES.map(d => <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
                </select>
              </label>
            </div>

            <label className="champ-groupe">Explication (facultatif)
              <input value={q.explication} onChange={e => majQuestion(i, 'explication', e.target.value)} placeholder="Affichée après la correction" />
            </label>
          </div>
        ))}

        <button type="button" onClick={ajouterQuestion} className="btn-ajout"><Icone nom="plus" taille={16} /> Ajouter une question</button>

        {erreur && <div className="ia-erreur" role="alert">{erreur}</div>}

        <button type="submit" disabled={envoi} className="btn btn-foret">
          {envoi ? 'Création…' : `Créer le quiz (${questions.length} question${questions.length > 1 ? 's' : ''})`}
        </button>
      </form>
    </div>
  )
}
