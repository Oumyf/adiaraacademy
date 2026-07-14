import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function CoursDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { utilisateur } = useAuth()
  const [cours, setCours] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [publication, setPublication] = useState(false)
  const [confirmerSupp, setConfirmerSupp] = useState(false)
  const [suppressionEnCours, setSuppressionEnCours] = useState(false)
  const [erreurSupp, setErreurSupp] = useState('')

  const estGestionnaire = utilisateur && (utilisateur.role === 'PROFESSEUR' || utilisateur.role === 'ADMIN')

  useEffect(() => {
    api.get(`/cours/${id}`).then(r => setCours(r.data)).finally(() => setChargement(false))
  }, [id])

  const basculerPublication = async () => {
    setPublication(true)
    try {
      const { data } = await api.patch(`/cours/${id}/publier`)
      setCours(c => ({ ...c, publie: data.publie }))
    } finally {
      setPublication(false)
    }
  }

  const supprimerCours = async () => {
    setSuppressionEnCours(true)
    setErreurSupp('')
    try {
      await api.delete(`/cours/${id}`)
      navigate('/cours')
    } catch {
      setErreurSupp('Erreur lors de la suppression.')
      setSuppressionEnCours(false)
    }
  }

  if (chargement) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--texte-3)' }}>Chargement...</div>
  if (!cours) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--erreur)' }}>Cours introuvable.</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link to="/cours" style={{ fontSize: '13px', color: 'var(--texte-3)', display: 'inline-block', marginBottom: '1.5rem' }}>← Retour aux cours</Link>

      {/* Bannière non publié */}
      {estGestionnaire && !cours.publie && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFBEB', border: '1px solid #F6E05E', borderRadius: 'var(--r-lg)', padding: '12px 16px', marginBottom: '1.5rem', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#92400E', fontWeight: '500' }}>
            ⚠️ Ce cours n'est pas encore publié — seuls toi et les admins peuvent le voir.
          </span>
          <button onClick={basculerPublication} disabled={publication} style={{ flexShrink: 0, padding: '7px 16px', background: 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            {publication ? '...' : 'Publier'}
          </button>
        </div>
      )}

      {/* En-tête cours */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: '400', margin: 0 }}>{cours.titre}</h1>
        {estGestionnaire && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
            <Link to={`/cours/${id}/modifier`} style={{ padding: '6px 14px', background: 'transparent', color: 'var(--texte-2)', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '12px', fontWeight: '500' }}>
              Modifier
            </Link>
            {cours.publie && (
              <button onClick={basculerPublication} disabled={publication} style={{ padding: '6px 14px', background: 'transparent', color: 'var(--texte-3)', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '12px', cursor: 'pointer' }}>
                {publication ? '...' : 'Dépublier'}
              </button>
            )}

            {/* Confirmation suppression inline */}
            {confirmerSupp ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--erreur)', fontWeight: '500', whiteSpace: 'nowrap' }}>Supprimer ?</span>
                <button onClick={() => { setConfirmerSupp(false); setErreurSupp('') }} style={{ padding: '6px 10px', background: 'transparent', color: 'var(--texte-2)', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '12px', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button onClick={supprimerCours} disabled={suppressionEnCours} style={{ padding: '6px 10px', background: 'var(--erreur)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '12px', cursor: suppressionEnCours ? 'not-allowed' : 'pointer' }}>
                  {suppressionEnCours ? '...' : 'Oui'}
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmerSupp(true)} style={{ padding: '6px 14px', background: 'transparent', color: 'var(--erreur)', border: '1px solid var(--erreur)', borderRadius: 'var(--r-md)', fontSize: '12px', cursor: 'pointer' }}>
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>

      {erreurSupp && (
        <div style={{ padding: '10px 14px', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 'var(--r-md)', color: 'var(--erreur)', fontSize: '13px', marginBottom: '1rem' }}>{erreurSupp}</div>
      )}

      {cours.description && (
        <p style={{ color: 'var(--texte-2)', fontSize: '15px', marginBottom: '2rem', lineHeight: '1.6' }}>{cours.description}</p>
      )}

      {/* En-tête chapitres + bouton ajout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: '400', margin: 0 }}>
          Chapitres ({cours.chapitres?.length ?? 0})
        </h2>
        {estGestionnaire && (
          <Link to={`/cours/${id}/creer-chapitre`} style={{ padding: '7px 14px', background: 'var(--foret)', color: '#fff', borderRadius: 'var(--r-md)', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
            + Chapitre
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {cours.chapitres?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--texte-3)', fontSize: '14px', background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-lg)' }}>
            Aucun chapitre pour l'instant.
          </div>
        )}
        {cours.chapitres?.map((ch, i) => (
          <div key={ch.id} style={{ display: 'flex', alignItems: 'center', background: 'var(--blanc)', borderRadius: i === 0 ? 'var(--r-lg) var(--r-lg) 0 0' : i === cours.chapitres.length - 1 ? '0 0 var(--r-lg) var(--r-lg)' : '0', border: '1px solid var(--bord)', borderTop: i > 0 ? 'none' : '1px solid var(--bord)' }}>
            <Link to={`/chapitres/${ch.id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--foret-pale)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', color: 'var(--foret)', opacity: '.4', width: '32px', textAlign: 'right' }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontWeight: '500', color: 'var(--texte)', fontSize: '14px' }}>{ch.titre}</div>
                  <div style={{ fontSize: '12px', color: 'var(--texte-3)', marginTop: '2px' }}>{ch._count?.quiz || 0} quiz · +{ch.xpObtenu} XP</div>
                </div>
              </div>
              <span style={{ color: 'var(--texte-3)' }}>→</span>
            </Link>
            {estGestionnaire && (
              <div style={{ display: 'flex', borderLeft: '1px solid var(--bord)' }}>
                <Link to={`/chapitres/${ch.id}/modifier`} style={{ padding: '0 12px', fontSize: '12px', color: 'var(--texte-3)', textDecoration: 'none', height: '100%', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--foret)'; e.currentTarget.style.background = 'var(--foret-pale)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--texte-3)'; e.currentTarget.style.background = 'transparent' }}
                  aria-label="Modifier le chapitre"
                >✏️</Link>
                <Link to={`/chapitres/${ch.id}/creer-quiz`} style={{ padding: '0 12px', fontSize: '12px', color: 'var(--texte-3)', textDecoration: 'none', borderLeft: '1px solid var(--bord)', height: '100%', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--foret)'; e.currentTarget.style.background = 'var(--foret-pale)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--texte-3)'; e.currentTarget.style.background = 'transparent' }}
                >+ Quiz</Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
