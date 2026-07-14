import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

const MATIERES = ['MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE']
const NIVEAUX  = ['COLLEGE', 'LYCEE', 'UNIVERSITE']

const labelMatiere = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
const labelNiveau  = { COLLEGE: 'Collège', LYCEE: 'Lycée', UNIVERSITE: 'Université' }

const champ = { padding: '10px 12px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', width: '100%', fontFamily: 'var(--sans)', outline: 'none', background: 'var(--blanc)' }

export default function CreerCours() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ titre: '', description: '', matiere: '', niveau: '', classe: '', imageUrl: '' })
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const maj = (champ, val) => setForm(f => ({ ...f, [champ]: val }))

  const soumettre = async (e) => {
    e.preventDefault()
    if (!form.titre || !form.matiere || !form.niveau) return setErreur('Titre, matière et niveau sont obligatoires.')
    setEnvoi(true)
    setErreur('')
    try {
      const { data } = await api.post('/cours', { titre: form.titre, description: form.description, matiere: form.matiere, niveau: form.niveau, classe: form.classe || undefined, imageUrl: form.imageUrl || undefined })
      navigate(`/cours/${data.id}`)
    } catch (err) {
      const data = err.response?.data
      const msg = data?.erreurs?.[0]?.msg || data?.message || 'Erreur lors de la création.'
      setErreur(msg)
      setEnvoi(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: '400', marginBottom: '0.25rem' }}>Créer un cours</h1>
      <p style={{ color: 'var(--texte-2)', fontSize: '14px', marginBottom: '2rem' }}>Le cours sera masqué jusqu'à sa publication.</p>

      <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-md)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--texte)' }}>Titre *</label>
          <input style={champ} value={form.titre} onChange={e => maj('titre', e.target.value)} placeholder="Ex : Équations du second degré" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Description</label>
          <textarea rows={3} style={{ ...champ, resize: 'vertical' }} value={form.description} onChange={e => maj('description', e.target.value)} placeholder="Présentation rapide du cours..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Matière *</label>
            <select style={champ} value={form.matiere} onChange={e => maj('matiere', e.target.value)}>
              <option value="">-- Choisir --</option>
              {MATIERES.map(m => <option key={m} value={m}>{labelMatiere[m]}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Niveau *</label>
            <select style={champ} value={form.niveau} onChange={e => maj('niveau', e.target.value)}>
              <option value="">-- Choisir --</option>
              {NIVEAUX.map(n => <option key={n} value={n}>{labelNiveau[n]}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Classe (optionnel)</label>
          <input style={champ} value={form.classe} onChange={e => maj('classe', e.target.value)} placeholder="Ex : 3e, Terminale S..." />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>URL de l'image (optionnel)</label>
          <input style={champ} value={form.imageUrl} onChange={e => maj('imageUrl', e.target.value)} placeholder="https://..." />
        </div>

        {erreur && <div style={{ padding: '10px 14px', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 'var(--r-md)', color: 'var(--erreur)', fontSize: '13px' }}>{erreur}</div>}

        <button type="submit" disabled={envoi} style={{ padding: '13px', background: envoi ? 'var(--bord)' : 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: '600', cursor: envoi ? 'not-allowed' : 'pointer' }}>
          {envoi ? 'Création...' : 'Créer le cours'}
        </button>
      </form>
    </div>
  )
}
