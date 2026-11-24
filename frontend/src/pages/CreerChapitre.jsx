import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import Icone from '../components/Icones'

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
    <div className="form-page">
      <Link to={`/cours/${coursId}`} className="form-retour"><Icone nom="retour" taille={16} /> Retour au cours</Link>
      <h1>Ajouter un chapitre</h1>
      <p className="form-intro">Le contenu accepte le Markdown, les tableaux et les formules LaTeX écrites entre $…$.</p>

      <form onSubmit={soumettre} className="form-carte">
        <label className="champ-groupe">Titre *
          <input value={form.titre} onChange={e => maj('titre', e.target.value)} placeholder="Ex : Les fonctions affines" />
        </label>
        <div className="grille-2">
          <label className="champ-groupe">Ordre dans le cours *
            <input type="number" min="1" value={form.ordre} onChange={e => maj('ordre', e.target.value)} placeholder="1" />
          </label>
          <label className="champ-groupe">XP gagnés par l'élève
            <input type="number" min="0" value={form.xpObtenu} onChange={e => maj('xpObtenu', e.target.value)} />
          </label>
        </div>
        <label className="champ-groupe">Contenu (Markdown) *
          <textarea rows={16} className="mono" value={form.contenu} onChange={e => maj('contenu', e.target.value)}
            placeholder={"# Introduction\n\nÉcris ton contenu ici.\n\nFormule : $ax^2 + bx + c = 0$"} />
        </label>
        {erreur && <div className="ia-erreur" role="alert">{erreur}</div>}
        <button type="submit" disabled={envoi} className="btn btn-foret">{envoi ? 'Création…' : 'Ajouter le chapitre'}</button>
      </form>
    </div>
  )
}
