import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../lib/api'

const MATIERES = ['MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE']
const NIVEAUX  = ['COLLEGE', 'LYCEE', 'UNIVERSITE']
const labelMatiere = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
const labelNiveau  = { COLLEGE: 'Collège', LYCEE: 'Lycée', UNIVERSITE: 'Université' }

const champ = { padding: '10px 12px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', width: '100%', fontFamily: 'var(--sans)', outline: 'none', background: 'var(--blanc)' }

export default function EditCours() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  useEffect(() => {
    api.get(`/cours/${id}`).then(r => {
      const c = r.data
      setForm({ titre: c.titre, description: c.description || '', matiere: c.matiere, niveau: c.niveau, classe: c.classe || '', imageUrl: c.imageUrl || '' })
    }).catch(() => setErreur('Impossible de charger le cours.'))
  }, [id])

  const maj = (f, val) => setForm(p => ({ ...p, [f]: val }))

  const soumettre = async (e) => {
    e.preventDefault()
    if (!form.titre || !form.matiere || !form.niveau) return setErreur('Titre, matière et niveau sont obligatoires.')
    setEnvoi(true); setErreur('')
    try {
      await api.patch(`/cours/${id}`, form)
      navigate(`/cours/${id}`)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la modification.')
      setEnvoi(false)
    }
  }

  if (!form && !erreur) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--texte-3)' }}>Chargement...</div>

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link to={`/cours/${id}`} style={{ fontSize: '13px', color: 'var(--texte-3)', display: 'inline-block', marginBottom: '1.5rem' }}>← Retour au cours</Link>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: '400', marginBottom: '2rem' }}>Modifier le cours</h1>

      {form && (
        <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Titre *</label>
            <input style={champ} value={form.titre} onChange={e => maj('titre', e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Description</label>
            <textarea rows={3} style={{ ...champ, resize: 'vertical' }} value={form.description} onChange={e => maj('description', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Matière *</label>
              <select style={champ} value={form.matiere} onChange={e => maj('matiere', e.target.value)}>
                {MATIERES.map(m => <option key={m} value={m}>{labelMatiere[m]}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Niveau *</label>
              <select style={champ} value={form.niveau} onChange={e => maj('niveau', e.target.value)}>
                {NIVEAUX.map(n => <option key={n} value={n}>{labelNiveau[n]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Classe (optionnel)</label>
            <input style={champ} value={form.classe} onChange={e => maj('classe', e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>URL de l'image (optionnel)</label>
            <input style={champ} value={form.imageUrl} onChange={e => maj('imageUrl', e.target.value)} />
          </div>
          {erreur && <div style={{ padding: '10px 14px', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 'var(--r-md)', color: 'var(--erreur)', fontSize: '13px' }}>{erreur}</div>}
          <button type="submit" disabled={envoi} style={{ padding: '13px', background: envoi ? 'var(--bord)' : 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: '600', cursor: envoi ? 'not-allowed' : 'pointer' }}>
            {envoi ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      )}
      {erreur && !form && <div style={{ color: 'var(--erreur)', textAlign: 'center' }}>{erreur}</div>}
    </div>
  )
}
