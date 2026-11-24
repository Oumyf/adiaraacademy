import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Icone from '../components/Icones'

const MATIERES = ['MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE']
const LABEL_M  = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
const VILLES   = ['Dakar', 'Thiès', 'Saint-Louis', 'Mbour']
const MAX_MATIERES = 3

export default function DevenirProf() {
  const { utilisateur } = useAuth()
  const [form, setForm] = useState({ bio: '', matieres: [], tarifHeure: '', ville: '' })
  const [succes, setSucces] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)
  const [candidatureExistante, setCandidatureExistante] = useState(null)

  useEffect(() => {
    if (utilisateur) {
      api.get('/professeurs/ma-candidature')
        .then(r => { if (r.data) setCandidatureExistante(r.data) })
        .catch(() => {})
    }
  }, [utilisateur])

  const toggleMatiere = m => {
    setForm(f => {
      if (f.matieres.includes(m)) return { ...f, matieres: f.matieres.filter(x => x !== m) }
      if (f.matieres.length >= MAX_MATIERES) return f
      return { ...f, matieres: [...f.matieres, m] }
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.matieres.length) { setErreur('Sélectionne au moins une matière.'); return }
    setErreur(null)
    setChargement(true)
    try {
      await api.post('/professeurs/candidature', {
        bio: form.bio,
        matieres: form.matieres,
        tarifHeure: form.tarifHeure ? Number(form.tarifHeure) : null,
        ville: form.ville
      })
      setSucces(true)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue. Réessaie dans un instant.')
    } finally {
      setChargement(false)
    }
  }

  if (!utilisateur) {
    return (
      <div className="etat-carte">
        <span className="etat-ico"><Icone nom="eleves" taille={30} /></span>
        <h1>Donne des cours particuliers</h1>
        <p>Rejoins le réseau de professeurs vérifiés d'AdiaraAcademy et accompagne des élèves sénégalais, du collège à l'université.</p>
        <div style={{ marginTop: '1.4rem' }}>
          <Link to="/inscription" className="btn btn-foret">Créer un compte</Link>
        </div>
      </div>
    )
  }

  if (succes) {
    return (
      <div className="etat-carte">
        <span className="etat-ico"><Icone nom="check" taille={30} /></span>
        <h1>Candidature envoyée</h1>
        <p>Notre équipe vérifie ton diplôme et ton profil sous <strong>48 h</strong>. Tu recevras une notification dès que ton profil sera activé.</p>
        <div className="note-douce" style={{ margin: '1.4rem 0' }}>
          La vérification des diplômes est manuelle. Seuls les professeurs vérifiés apparaissent dans la liste publique.
        </div>
        <Link to="/tuteurs" className="btn btn-foret">Voir la liste des profs</Link>
      </div>
    )
  }

  if (candidatureExistante) {
    return (
      <div className="etat-carte">
        <span className="etat-ico"><Icone nom={candidatureExistante.verifie ? 'bouclier' : 'horloge'} taille={30} /></span>
        <h1>{candidatureExistante.verifie ? 'Ton profil est actif' : 'Candidature en cours de vérification'}</h1>
        <div className="dp-resume">
          <div><strong>Matières :</strong> {candidatureExistante.matieres?.map(m => LABEL_M[m]).join(', ')}</div>
          <div><strong>Ville :</strong> {candidatureExistante.ville}</div>
          {candidatureExistante.tarifHeure && <div><strong>Tarif :</strong> {candidatureExistante.tarifHeure.toLocaleString('fr-FR')} FCFA par heure</div>}
        </div>
        {candidatureExistante.verifie
          ? <Link to="/tuteurs" className="btn btn-foret">Voir les profs du site</Link>
          : <p>Tu seras prévenu dès que la vérification sera terminée.</p>}
      </div>
    )
  }

  return (
    <div className="form-page etroit">
      <h1>Devenir prof particulier</h1>
      <p className="form-intro">Tu gardes <strong>90 %</strong> des revenus de tes cours, AdiaraAcademy prélève 10 %. Chaque profil est vérifié par notre équipe avant d'être publié.</p>

      <form onSubmit={handleSubmit} className="form-carte">
        <label className="champ-groupe">Présentation *
          <textarea rows={4} required value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            placeholder="Ton parcours, tes méthodes, ton expérience avec les élèves" />
        </label>

        <div className="champ-groupe" role="group" aria-labelledby="lab-matieres">
          <span id="lab-matieres">Matières enseignées * <span className="form-aide">({form.matieres.length}/{MAX_MATIERES} au maximum)</span></span>
          <div className="puces">
            {MATIERES.map(m => {
              const actif = form.matieres.includes(m)
              const desactive = !actif && form.matieres.length >= MAX_MATIERES
              return (
                <button key={m} type="button" onClick={() => toggleMatiere(m)} disabled={desactive} aria-pressed={actif} className={`puce ${actif ? 'actif' : ''}`}>
                  {actif && <Icone nom="check" taille={14} />}{LABEL_M[m]}
                </button>
              )
            })}
          </div>
        </div>

        <label className="champ-groupe">Ville *
          <select value={form.ville} onChange={e => setForm(f => ({ ...f, ville: e.target.value }))} required>
            <option value="">Choisir une ville</option>
            {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>

        <label className="champ-groupe">Tarif par heure, en FCFA (facultatif)
          <input type="number" min="0" placeholder="5000" value={form.tarifHeure} onChange={e => setForm(f => ({ ...f, tarifHeure: e.target.value }))} />
        </label>

        <div className="note-douce">
          La commission de 10 % est calculée par AdiaraAcademy au moment du paiement. Les séances avec des élèves mineurs nécessitent la validation préalable du compte parent rattaché.
        </div>

        {erreur && <div className="ia-erreur" role="alert">{erreur}</div>}
        <button type="submit" disabled={chargement} className="btn btn-foret">{chargement ? 'Envoi…' : 'Envoyer ma candidature'}</button>
      </form>
    </div>
  )
}
