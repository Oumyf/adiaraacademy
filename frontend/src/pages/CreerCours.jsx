import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../lib/api'
import Icone from '../components/Icones'

const MATIERES = ['MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE']
const NIVEAUX  = ['COLLEGE', 'LYCEE', 'UNIVERSITE']

const labelMatiere = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
const labelNiveau  = { COLLEGE: 'Collège', LYCEE: 'Lycée', UNIVERSITE: 'Université' }

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
      setErreur(data?.erreurs?.[0]?.msg || data?.message || 'Erreur lors de la création.')
      setEnvoi(false)
    }
  }

  return (
    <div className="form-page etroit">
      <Link to="/dashboard" className="form-retour"><Icone nom="retour" taille={16} /> Tableau de bord</Link>
      <h1>Créer un cours</h1>
      <p className="form-intro">Le cours reste masqué aux élèves tant que tu ne l'as pas publié. Tu pourras ensuite y ajouter des chapitres et des quiz.</p>

      <form onSubmit={soumettre} className="form-carte champs-form">
        <label className="champ-groupe">Titre *
          <input value={form.titre} onChange={e => maj('titre', e.target.value)} placeholder="Ex : Équations du second degré" />
        </label>
        <label className="champ-groupe">Description
          <textarea rows={3} value={form.description} onChange={e => maj('description', e.target.value)} placeholder="Présentation rapide du cours" />
        </label>
        <div className="grille-2">
          <label className="champ-groupe">Matière *
            <select value={form.matiere} onChange={e => maj('matiere', e.target.value)}>
              <option value="">Choisir</option>
              {MATIERES.map(m => <option key={m} value={m}>{labelMatiere[m]}</option>)}
            </select>
          </label>
          <label className="champ-groupe">Niveau *
            <select value={form.niveau} onChange={e => maj('niveau', e.target.value)}>
              <option value="">Choisir</option>
              {NIVEAUX.map(n => <option key={n} value={n}>{labelNiveau[n]}</option>)}
            </select>
          </label>
        </div>
        <label className="champ-groupe">Classe (facultatif)
          <input value={form.classe} onChange={e => maj('classe', e.target.value)} placeholder="Ex : 3ème, Terminale S" />
        </label>
        <label className="champ-groupe">Adresse de l'image (facultatif)
          <input value={form.imageUrl} onChange={e => maj('imageUrl', e.target.value)} placeholder="https://…" />
        </label>

        {erreur && <div className="ia-erreur" role="alert">{erreur}</div>}
        <button type="submit" disabled={envoi} className="btn btn-foret">{envoi ? 'Création…' : 'Créer le cours'}</button>
      </form>
    </div>
  )
}
