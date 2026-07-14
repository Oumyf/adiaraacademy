import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../lib/api'

const TYPES      = ['QCM', 'REPONSE_LIBRE', 'VRAI_FAUX']
const DIFFICULTES = ['FACILE', 'MOYEN', 'DIFFICILE']

const labelType = { QCM: 'QCM', REPONSE_LIBRE: 'Réponse libre', VRAI_FAUX: 'Vrai / Faux' }

const champ = { padding: '10px 12px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', width: '100%', fontFamily: 'var(--sans)', outline: 'none', background: 'var(--blanc)' }

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

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/chapitres/${chapitreId}`} style={{ fontSize: '13px', color: 'var(--texte-3)', textDecoration: 'none' }}>← Retour au chapitre</Link>
      </div>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: '400', marginBottom: '0.25rem' }}>Créer un quiz</h1>
      <p style={{ color: 'var(--texte-2)', fontSize: '14px', marginBottom: '2rem' }}>Ajoute autant de questions que nécessaire.</p>

      <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Infos générales */}
        <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '1.5rem', boxShadow: 'var(--ombre-md)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>Informations générales</h2>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Titre *</label>
            <input style={champ} value={form.titre} onChange={e => majForm('titre', e.target.value)} placeholder="Ex : Quiz — équations du 1er degré" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Type *</label>
              <select style={champ} value={form.type} onChange={e => majForm('type', e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{labelType[t]}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Durée (min)</label>
              <input type="number" min="1" style={champ} value={form.dureMin} onChange={e => majForm('dureMin', e.target.value)} placeholder="Libre" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>XP maximum</label>
              <input type="number" min="0" style={champ} value={form.xpMax} onChange={e => majForm('xpMax', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, i) => (
          <div key={i} style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '1.5rem', boxShadow: 'var(--ombre-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>Question {i + 1}</h2>
              {questions.length > 1 && (
                <button type="button" onClick={() => supprimerQuestion(i)} style={{ background: 'none', border: 'none', color: 'var(--erreur)', fontSize: '13px', cursor: 'pointer', padding: '4px 8px' }}>Supprimer</button>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Énoncé *</label>
              <textarea rows={2} style={{ ...champ, resize: 'vertical' }} value={q.enonce} onChange={e => majQuestion(i, 'enonce', e.target.value)} placeholder="Quelle est la valeur de x dans 2x + 3 = 7 ?" />
            </div>

            {form.type === 'QCM' && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Options (4 choix) *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt, oi) => (
                    <input key={oi} style={champ} value={opt} onChange={e => majOption(i, oi, e.target.value)} placeholder={`Option ${oi + 1}`} />
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: form.type === 'VRAI_FAUX' ? '1fr 1fr' : '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Réponse correcte *</label>
                {form.type === 'VRAI_FAUX' ? (
                  <select style={champ} value={q.reponseCorrecte} onChange={e => majQuestion(i, 'reponseCorrecte', e.target.value)}>
                    <option value="Vrai">Vrai</option>
                    <option value="Faux">Faux</option>
                  </select>
                ) : (
                  <input style={champ} value={q.reponseCorrecte} onChange={e => majQuestion(i, 'reponseCorrecte', e.target.value)} placeholder={form.type === 'QCM' ? 'Doit correspondre à une option' : 'Réponse attendue'} />
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Difficulté</label>
                <select style={champ} value={q.difficulte} onChange={e => majQuestion(i, 'difficulte', e.target.value)}>
                  {DIFFICULTES.map(d => <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Explication (optionnel)</label>
              <input style={champ} value={q.explication} onChange={e => majQuestion(i, 'explication', e.target.value)} placeholder="Affiché après la correction..." />
            </div>
          </div>
        ))}

        <button type="button" onClick={ajouterQuestion} style={{ padding: '11px', border: '2px dashed var(--bord)', borderRadius: 'var(--r-lg)', background: 'transparent', color: 'var(--texte-2)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
          + Ajouter une question
        </button>

        {erreur && <div style={{ padding: '10px 14px', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 'var(--r-md)', color: 'var(--erreur)', fontSize: '13px' }}>{erreur}</div>}

        <button type="submit" disabled={envoi} style={{ padding: '14px', background: envoi ? 'var(--bord)' : 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: '600', cursor: envoi ? 'not-allowed' : 'pointer' }}>
          {envoi ? 'Création...' : `Créer le quiz (${questions.length} question${questions.length > 1 ? 's' : ''})`}
        </button>
      </form>
    </div>
  )
}
