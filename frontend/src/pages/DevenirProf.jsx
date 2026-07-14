import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const MATIERES = ['MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE']
const LABEL_M  = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
const VILLES   = ['Dakar', 'Thiès', 'Saint-Louis', 'Mbour']

export default function DevenirProf() {
  const { utilisateur } = useAuth()
  const navigate = useNavigate()
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

  const MAX_MATIERES = 3

  const toggleMatiere = m => {
    setForm(f => {
      if (f.matieres.includes(m)) return { ...f, matieres: f.matieres.filter(x => x !== m) }
      if (f.matieres.length >= MAX_MATIERES) return f
      return { ...f, matieres: [...f.matieres, m] }
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.matieres.length) { setErreur('Sélectionnez au moins une matière.'); return }
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
      setErreur(err.response?.data?.message || 'Une erreur est survenue.')
    } finally {
      setChargement(false)
    }
  }

  if (!utilisateur) {
    return (
      <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍🏫</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: '400', marginBottom: '0.75rem' }}>Devenir prof particulier</h1>
        <p style={{ color: 'var(--texte-2)', fontSize: '14px', lineHeight: '1.7', marginBottom: '2rem' }}>
          Rejoignez notre réseau de professeurs vérifiés et aidez les élèves sénégalais à progresser.
        </p>
        <Link to="/inscription" style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--terre)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
          Créer un compte
        </Link>
      </div>
    )
  }

  if (succes) {
    return (
      <div style={{ maxWidth: '540px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: '400', marginBottom: '0.75rem' }}>Candidature envoyée !</h2>
        <p style={{ color: 'var(--texte-2)', fontSize: '14px', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Notre équipe vérifiera votre diplôme et votre profil sous <strong>48h</strong>.
          Vous recevrez une notification une fois votre profil activé.
        </p>
        <div style={{ padding: '1rem 1.25rem', background: '#FEF6E4', borderRadius: 'var(--r-lg)', border: '1px solid var(--or)', fontSize: '13px', color: '#92400E', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          <strong>Note :</strong> La vérification des diplômes est manuelle. Seuls les professeurs vérifiés apparaissent dans la liste publique.
        </div>
        <Link to="/tuteurs" style={{ display: 'inline-block', padding: '10px 24px', background: 'var(--foret)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
          Voir la liste des profs
        </Link>
      </div>
    )
  }

  if (candidatureExistante) {
    return (
      <div style={{ maxWidth: '580px', margin: '3rem auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: '400', marginBottom: '1.5rem' }}>Ma candidature</h1>
        <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '1.75rem', boxShadow: 'var(--ombre-sm)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{candidatureExistante.verifie ? '✅' : '⏳'}</span>
            <span style={{ fontWeight: '600', color: candidatureExistante.verifie ? 'var(--succes)' : 'var(--or)' }}>
              {candidatureExistante.verifie ? 'Profil vérifié et actif' : 'En attente de vérification'}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--texte-2)', lineHeight: '1.7' }}>
            <div><strong>Matières :</strong> {candidatureExistante.matieres?.map(m => LABEL_M[m]).join(', ')}</div>
            <div><strong>Ville :</strong> {candidatureExistante.ville}</div>
            {candidatureExistante.tarifHeure && <div><strong>Tarif :</strong> {candidatureExistante.tarifHeure.toLocaleString('fr-FR')} FCFA/h</div>}
          </div>
        </div>
        {candidatureExistante.verifie && (
          <Link to="/tuteurs" style={{ display: 'inline-block', padding: '10px 22px', background: 'var(--terre)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
            Voir mon profil public →
          </Link>
        )}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: '400', marginBottom: '6px' }}>Devenir prof particulier</h1>
        <p style={{ color: 'var(--texte-2)', fontSize: '14px', lineHeight: '1.6' }}>
          Partagez votre expertise et gagnez <strong>90%</strong> des revenus générés (commission 10% AdiaraAcademy).
          Notre équipe vérifie chaque profil avant publication.
        </p>
      </div>

      <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-sm)' }}>
        <form onSubmit={handleSubmit}>

          {/* Bio */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--texte-2)', marginBottom: '6px' }}>
              Présentation <span style={{ color: 'var(--erreur)' }}>*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Décrivez votre parcours, vos méthodes pédagogiques, votre expérience..."
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              required
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', resize: 'vertical', fontFamily: 'var(--sans)', outline: 'none', color: 'var(--texte)' }}
              onFocus={e => e.target.style.borderColor = 'var(--foret)'}
              onBlur={e => e.target.style.borderColor = 'var(--bord)'}
            />
          </div>

          {/* Matières */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--texte-2)', marginBottom: '8px' }}>
              Matières enseignées <span style={{ color: 'var(--erreur)' }}>*</span>
              <span style={{ fontWeight: '400', color: 'var(--texte-3)', marginLeft: '8px' }}>
                ({form.matieres.length}/{MAX_MATIERES} max)
              </span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {MATIERES.map(m => {
                const selectionne = form.matieres.includes(m)
                const desactive = !selectionne && form.matieres.length >= MAX_MATIERES
                return (
                  <button key={m} type="button" onClick={() => toggleMatiere(m)} disabled={desactive}
                    style={{ padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '500', border: '2px solid', borderColor: selectionne ? 'var(--foret)' : 'var(--bord)', background: selectionne ? 'var(--foret)' : 'var(--blanc)', color: selectionne ? '#fff' : desactive ? 'var(--texte-3)' : 'var(--texte-2)', cursor: desactive ? 'not-allowed' : 'pointer', opacity: desactive ? 0.5 : 1 }}>
                    {selectionne ? '✓ ' : ''}{LABEL_M[m]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Ville */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--texte-2)', marginBottom: '6px' }}>
              Ville <span style={{ color: 'var(--erreur)' }}>*</span>
            </label>
            <select value={form.ville} onChange={e => setForm(f => ({ ...f, ville: e.target.value }))} required
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', background: 'var(--blanc)', color: form.ville ? 'var(--texte)' : 'var(--texte-3)', outline: 'none' }}>
              <option value="">Sélectionner une ville</option>
              {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {/* Tarif */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--texte-2)', marginBottom: '6px' }}>
              Tarif horaire (FCFA) <span style={{ color: 'var(--texte-3)', fontWeight: '400' }}>— optionnel</span>
            </label>
            <input type="number" min="0" placeholder="ex: 5000" value={form.tarifHeure} onChange={e => setForm(f => ({ ...f, tarifHeure: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', outline: 'none', color: 'var(--texte)' }}
              onFocus={e => e.target.style.borderColor = 'var(--foret)'}
              onBlur={e => e.target.style.borderColor = 'var(--bord)'}
            />
          </div>

          {/* Note légale */}
          <div style={{ padding: '12px 14px', background: 'var(--sable)', borderRadius: 'var(--r-md)', fontSize: '12px', color: 'var(--texte-3)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            La commission de 10% est calculée exclusivement par AdiaraAcademy au moment du paiement.
            Les séances avec des élèves mineurs nécessitent la validation préalable du compte parent rattaché.
          </div>

          {erreur && <div style={{ background: '#FEE2E2', color: 'var(--erreur)', padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: '13px', marginBottom: '1rem' }}>{erreur}</div>}

          <button type="submit" disabled={chargement}
            style={{ width: '100%', padding: '13px', background: chargement ? 'var(--bord)' : 'var(--terre)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: '700', cursor: chargement ? 'not-allowed' : 'pointer' }}>
            {chargement ? 'Envoi en cours...' : 'Soumettre ma candidature'}
          </button>
        </form>
      </div>
    </div>
  )
}
