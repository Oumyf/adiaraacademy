import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../lib/api'

const champ = { padding: '10px 12px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', width: '100%', fontFamily: 'var(--sans)', outline: 'none', background: 'var(--blanc)' }

export default function CreerChapitre() {
  const { id: coursId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ titre: '', contenu: '', ordre: '', xpObtenu: '10' })
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const maj = (f, val) => setForm(p => ({ ...p, [f]: val }))

  const soumettre = async (e) => {
    e.preventDefault()
    if (!form.titre || !form.contenu || !form.ordre) return setErreur('Titre, contenu et ordre sont obligatoires.')
    setEnvoi(true)
    setErreur('')
    try {
      await api.post('/chapitres', {
        coursId,
        titre: form.titre,
        contenu: form.contenu,
        ordre: Number(form.ordre),
        xpObtenu: Number(form.xpObtenu) || 10,
      })
      navigate(`/cours/${coursId}`)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la création.')
      setEnvoi(false)
    }
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/cours/${coursId}`} style={{ fontSize: '13px', color: 'var(--texte-3)', textDecoration: 'none' }}>← Retour au cours</Link>
      </div>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: '400', marginBottom: '0.25rem' }}>Ajouter un chapitre</h1>
      <p style={{ color: 'var(--texte-2)', fontSize: '14px', marginBottom: '2rem' }}>Le contenu supporte le Markdown et les formules LaTeX (entre $…$).</p>

      <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-md)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Titre *</label>
          <input style={champ} value={form.titre} onChange={e => maj('titre', e.target.value)} placeholder="Ex : Les fonctions affines" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Ordre *</label>
            <input type="number" min="1" style={champ} value={form.ordre} onChange={e => maj('ordre', e.target.value)} placeholder="1" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>XP récompense</label>
            <input type="number" min="0" style={champ} value={form.xpObtenu} onChange={e => maj('xpObtenu', e.target.value)} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Contenu (Markdown) *</label>
          <textarea
            rows={16}
            style={{ ...champ, resize: 'vertical', lineHeight: '1.6', fontFamily: 'monospace' }}
            value={form.contenu}
            onChange={e => maj('contenu', e.target.value)}
            placeholder={"# Introduction\n\nÉcris ton contenu ici...\n\nFormule : $ax^2 + bx + c = 0$"}
          />
        </div>

        {erreur && <div style={{ padding: '10px 14px', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 'var(--r-md)', color: 'var(--erreur)', fontSize: '13px' }}>{erreur}</div>}

        <button type="submit" disabled={envoi} style={{ padding: '13px', background: envoi ? 'var(--bord)' : 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: '600', cursor: envoi ? 'not-allowed' : 'pointer' }}>
          {envoi ? 'Création...' : 'Ajouter le chapitre'}
        </button>
      </form>
    </div>
  )
}
