import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const LABEL_M = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }

export default function TuteurProfil() {
  const { id } = useParams()
  const { utilisateur } = useAuth()
  const [profil, setProfil] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    api.get(`/professeurs/${id}`)
      .then(r => setProfil(r.data))
      .catch(() => setProfil(null))
      .finally(() => setChargement(false))
  }, [id])

  if (chargement) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--texte-3)' }}>Chargement...</div>
  if (!profil) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--erreur)' }}>
      Profil introuvable. <Link to="/tuteurs" style={{ color: 'var(--foret)' }}>Retour à la liste</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link to="/tuteurs" style={{ fontSize: '13px', color: 'var(--texte-3)', display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Retour aux profs
      </Link>

      {/* En-tête profil */}
      <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-md)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--terre)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: '24px', flexShrink: 0 }}>
            {profil.utilisateur?.prenom?.[0]}{profil.utilisateur?.nom?.[0]}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: '400', marginBottom: '6px' }}>
              {profil.utilisateur?.prenom} {profil.utilisateur?.nom}
            </h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {profil.verifie && (
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--succes)', background: '#E6F4EC', padding: '3px 10px', borderRadius: '999px' }}>
                  ✓ Profil vérifié
                </span>
              )}
              {profil.ville && <span style={{ fontSize: '13px', color: 'var(--texte-3)' }}>📍 {profil.ville}</span>}
              {profil.disponible && <span style={{ fontSize: '11px', fontWeight: '600', color: '#276749', background: '#E6F4EC', padding: '3px 10px', borderRadius: '999px' }}>Disponible</span>}
            </div>
          </div>
          {profil.tarifHeure && (
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: 'var(--terre)' }}>{profil.tarifHeure.toLocaleString('fr-FR')}</div>
              <div style={{ fontSize: '12px', color: 'var(--texte-3)' }}>FCFA / heure</div>
            </div>
          )}
        </div>

        {/* Matières */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--texte-3)', letterSpacing: '.5px', marginBottom: '8px' }}>MATIÈRES ENSEIGNÉES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profil.matieres?.map(m => (
              <span key={m} style={{ background: 'var(--sable)', color: 'var(--foret)', fontSize: '13px', fontWeight: '600', padding: '5px 14px', borderRadius: '999px', border: '1px solid var(--bord)' }}>
                {LABEL_M[m]}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        {profil.bio && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--texte-3)', letterSpacing: '.5px', marginBottom: '8px' }}>À PROPOS</div>
            <p style={{ fontSize: '14px', color: 'var(--texte-2)', lineHeight: '1.7', margin: 0 }}>{profil.bio}</p>
          </div>
        )}
      </div>

      {/* CTA réservation */}
      <div style={{ background: 'linear-gradient(135deg, #6B2A1A 0%, var(--terre) 100%)', borderRadius: 'var(--r-xl)', padding: '1.75rem 2rem', color: '#fff' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: '400', marginBottom: '8px' }}>
          Demander une séance
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.75)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
          La réservation en ligne avec paiement Orange Money / Wave sera disponible prochainement.
          Pour une séance dès maintenant, contactez directement le professeur.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!utilisateur ? (
            <Link to="/inscription" style={{ padding: '10px 22px', background: '#fff', color: 'var(--terre)', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
              Créer un compte pour réserver
            </Link>
          ) : (
            <div style={{ padding: '10px 22px', background: 'rgba(255,255,255,.15)', borderRadius: 'var(--r-md)', fontSize: '13px', color: 'rgba(255,255,255,.8)', border: '1px solid rgba(255,255,255,.3)' }}>
              Réservation disponible prochainement
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
