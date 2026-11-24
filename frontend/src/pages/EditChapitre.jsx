import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import Icone from '../components/Icones'

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

  if (!form && !erreur) return <div className="form-page"><p>Chargement…</p></div>

  return (
    <div className="form-page">
      <Link to={`/chapitres/${id}`} className="form-retour"><Icone nom="retour" taille={16} /> Retour au chapitre</Link>
      <div className="form-entete" style={{ marginBottom: '1.4rem' }}>
        <h1 style={{ margin: 0 }}>Modifier le chapitre</h1>
        {confirmerSupp ? (
          <div className="form-confirm">
            Supprimer ce chapitre ?
            <button onClick={() => setConfirmerSupp(false)} className="btn btn-doux btn-petit">Annuler</button>
            <button onClick={supprimer} disabled={suppression} className="btn btn-danger-plein btn-petit">{suppression ? 'Suppression…' : 'Oui, supprimer'}</button>
          </div>
        ) : (
          <button onClick={() => setConfirmerSupp(true)} className="btn btn-danger btn-petit">Supprimer</button>
        )}
      </div>

      {form && (
        <form onSubmit={soumettre} className="form-carte">
          <label className="champ-groupe">Titre *
            <input value={form.titre} onChange={e => maj('titre', e.target.value)} />
          </label>
          <div className="grille-2">
            <label className="champ-groupe">Ordre dans le cours
              <input type="number" min="1" value={form.ordre} onChange={e => maj('ordre', e.target.value)} />
            </label>
            <label className="champ-groupe">XP gagnés par l'élève
              <input type="number" min="0" value={form.xpObtenu} onChange={e => maj('xpObtenu', e.target.value)} />
            </label>
          </div>
          <label className="champ-groupe">Contenu (Markdown) *
            <textarea rows={18} className="mono" value={form.contenu} onChange={e => maj('contenu', e.target.value)} />
          </label>
          {erreur && <div className="ia-erreur" role="alert">{erreur}</div>}
          <button type="submit" disabled={envoi} className="btn btn-foret">{envoi ? 'Enregistrement…' : 'Enregistrer les modifications'}</button>
        </form>
      )}
      {erreur && !form && <div className="ia-erreur" role="alert">{erreur}</div>}
    </div>
  )
}
