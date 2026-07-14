import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../lib/api'

const champ = { padding: '10px 12px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', width: '100%', fontFamily: 'var(--sans)', outline: 'none', background: 'var(--blanc)' }

export default function EditChapitre() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [coursId, setCoursId] = useState(null)
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [suppression, setSuppression] = useState(false)
  const [confirmerSupp, setConfirmerSupp] = useState(false)

  useEffect(() => {
    api.get(`/chapitres/${id}`).then(r => {
      const ch = r.data
      setCoursId(ch.cours?.id)
      setForm({ titre: ch.titre, contenu: ch.contenu, ordre: ch.ordre, xpObtenu: ch.xpObtenu })
    }).catch(() => setErreur('Impossible de charger le chapitre.'))
  }, [id])

  const maj = (f, val) => setForm(p => ({ ...p, [f]: val }))

  const soumettre = async (e) => {
    e.preventDefault()
    if (!form.titre || !form.contenu) return setErreur('Titre et contenu sont obligatoires.')
    setEnvoi(true); setErreur('')
    try {
      await api.patch(`/chapitres/${id}`, { ...form, ordre: Number(form.ordre), xpObtenu: Number(form.xpObtenu) })
      navigate(`/chapitres/${id}`)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la modification.')
      setEnvoi(false)
    }
  }

  const supprimer = async () => {
    setSuppression(true)
    try {
      await api.delete(`/chapitres/${id}`)
      navigate(coursId ? `/cours/${coursId}` : '/cours')
    } catch {
      setErreur('Erreur lors de la suppression.')
      setSuppression(false)
      setConfirmerSupp(false)
    }
  }

  if (!form && !erreur) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--texte-3)' }}>Chargement...</div>

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link to={`/chapitres/${id}`} style={{ fontSize: '13px', color: 'var(--texte-3)', display: 'inline-block', marginBottom: '1.5rem' }}>← Retour au chapitre</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: '400', margin: 0 }}>Modifier le chapitre</h1>
        {confirmerSupp ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--erreur)', fontWeight: '500' }}>Supprimer ?</span>
            <button onClick={() => setConfirmerSupp(false)} style={{ padding: '7px 12px', background: 'transparent', color: 'var(--texte-2)', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '13px', cursor: 'pointer' }}>Annuler</button>
            <button onClick={supprimer} disabled={suppression} style={{ padding: '7px 12px', background: 'var(--erreur)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '13px', cursor: suppression ? 'not-allowed' : 'pointer' }}>
              {suppression ? '...' : 'Oui, supprimer'}
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmerSupp(true)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--erreur)', color: 'var(--erreur)', borderRadius: 'var(--r-md)', fontSize: '13px', cursor: 'pointer' }}>
            Supprimer
          </button>
        )}
      </div>

      {form && (
        <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Titre *</label>
            <input style={champ} value={form.titre} onChange={e => maj('titre', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Ordre</label>
              <input type="number" min="1" style={champ} value={form.ordre} onChange={e => maj('ordre', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>XP récompense</label>
              <input type="number" min="0" style={champ} value={form.xpObtenu} onChange={e => maj('xpObtenu', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Contenu (Markdown) *</label>
            <textarea rows={18} style={{ ...champ, resize: 'vertical', lineHeight: '1.6', fontFamily: 'monospace' }} value={form.contenu} onChange={e => maj('contenu', e.target.value)} />
          </div>
          {erreur && <div style={{ padding: '10px 14px', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 'var(--r-md)', color: 'var(--erreur)', fontSize: '13px' }}>{erreur}</div>}
          <button type="submit" disabled={envoi} style={{ padding: '13px', background: envoi ? 'var(--bord)' : 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: '600', cursor: envoi ? 'not-allowed' : 'pointer' }}>
            {envoi ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      )}
    </div>
  )
}
