import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Icone from '../components/Icones'

const LABEL_M = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }

export default function TuteurProfil() {
  const { id } = useParams()
  const { utilisateur } = useAuth()
  const [profil, setProfil] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    api.get(`/professeurs/${id}`).then(r => setProfil(r.data)).catch(() => setProfil(null)).finally(() => setChargement(false))
  }, [id])

  if (chargement) return <div className="vide"><div className="squelette" style={{ width: 260, height: 18, borderRadius: 9 }} /></div>
  if (!profil) return (
    <div className="vide">
      <Icone nom="eleves" taille={36} />
      <h2>Profil introuvable</h2>
      <Link to="/tuteurs" className="btn btn-foret">Voir tous les profs</Link>
    </div>
  )

  return (
    <div>
      <div className="entete-page entete-brique">
        <div className="entete-page-int" style={{ maxWidth: 760 }}>
          <Link to="/tuteurs" className="lien-retour"><Icone nom="retour" taille={16} /> Tous les profs</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <span className="tuteur-avatar grand">{profil.utilisateur?.prenom?.[0]}{profil.utilisateur?.nom?.[0]}</span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>{profil.utilisateur?.prenom} {profil.utilisateur?.nom}</h1>
              <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
                {profil.verifie && <span className="puce-clair"><Icone nom="check" taille={14} /> Profil vérifié</span>}
                {profil.ville && <span className="puce-clair"><Icone nom="lieu" taille={14} /> {profil.ville}</span>}
                {profil.disponible && <span className="puce-clair">Disponible</span>}
              </p>
            </div>
            {profil.tarifHeure && (
              <div className="tuteur-tarif-haut"><b>{profil.tarifHeure.toLocaleString('fr-FR')}</b><span>FCFA par heure</span></div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.8rem 1.25rem 4rem', display: 'grid', gap: 18 }}>
        <section className="carte-dash">
          <h2>Matières enseignées</h2>
          <div className="puces-dash" style={{ marginBottom: 0 }}>{profil.matieres?.map(m => <span key={m}>{LABEL_M[m]}</span>)}</div>
          {profil.bio && <>
            <h2 style={{ marginTop: '1.5rem' }}>À propos</h2>
            <p style={{ color: 'var(--texte-2)', lineHeight: 1.75, maxWidth: '68ch' }}>{profil.bio}</p>
          </>}
        </section>

        <section className="promo-bandeau promo-prof" style={{ alignItems: 'flex-start' }}>
          <div>
            <strong>Demander une séance</strong>
            <span>La réservation en ligne avec paiement Orange Money ou Wave arrive bientôt.</span>
          </div>
          {!utilisateur
            ? <Link to="/inscription" className="btn btn-or">Créer un compte</Link>
            : <span className="puce-clair">Réservation bientôt disponible</span>}
        </section>
      </div>
    </div>
  )
}
