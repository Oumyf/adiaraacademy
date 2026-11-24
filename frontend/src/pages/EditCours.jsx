import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import Icone from '../components/Icones'

const MATIERES = ['MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE']
const NIVEAUX  = ['COLLEGE', 'LYCEE', 'UNIVERSITE']
const labelMatiere = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
const labelNiveau  = { COLLEGE: 'Collège', LYCEE: 'Lycée', UNIVERSITE: 'Université' }

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

  if (!form && !erreur) return <div className="form-page etroit"><p>Chargement…</p></div>

  return (
    <div className="form-page etroit">
      <Link to={`/cours/${id}`} className="form-retour"><Icone nom="retour" taille={16} /> Retour au cours</Link>
      <h1>Modifier le cours</h1>

      {form && (
        <form onSubmit={soumettre} className="form-carte" style={{ marginTop: '1.4rem' }}>
          <label className="champ-groupe">Titre *
            <input value={form.titre} onChange={e => maj('titre', e.target.value)} />
          </label>
          <label className="champ-groupe">Description
            <textarea rows={3} value={form.description} onChange={e => maj('description', e.target.value)} />
          </label>
          <div className="grille-2">
            <label className="champ-groupe">Matière *
              <select value={form.matiere} onChange={e => maj('matiere', e.target.value)}>
                {MATIERES.map(m => <option key={m} value={m}>{labelMatiere[m]}</option>)}
              </select>
            </label>
            <label className="champ-groupe">Niveau *
              <select value={form.niveau} onChange={e => maj('niveau', e.target.value)}>
                {NIVEAUX.map(n => <option key={n} value={n}>{labelNiveau[n]}</option>)}
              </select>
            </label>
          </div>
          <label className="champ-groupe">Classe (facultatif)
            <input value={form.classe} onChange={e => maj('classe', e.target.value)} />
          </label>
          <label className="champ-groupe">Adresse de l'image (facultatif)
            <input value={form.imageUrl} onChange={e => maj('imageUrl', e.target.value)} />
          </label>
          {erreur && <div className="ia-erreur" role="alert">{erreur}</div>}
          <button type="submit" disabled={envoi} className="btn btn-foret">{envoi ? 'Enregistrement…' : 'Enregistrer les modifications'}</button>
        </form>
      )}
      {erreur && !form && <div className="ia-erreur" role="alert">{erreur}</div>}
    </div>
  )
}
