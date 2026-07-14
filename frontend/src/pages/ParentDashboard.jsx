import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const LABEL_M = { MATHEMATIQUES: 'Maths', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Info' }
const LABEL_STATUT = { TERMINE: { label: 'Terminé', bg: '#E6F4EC', color: '#276749' }, EN_COURS: { label: 'En cours', bg: '#FEF6E4', color: '#C8912A' }, NON_COMMENCE: { label: 'Non commencé', bg: '#F1F5F9', color: '#64748B' } }

function CarteAlerte({ alerte }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--r-lg)' }}>
      <span style={{ fontSize: '1.4rem' }}>⚠️</span>
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--erreur)' }}>Difficultés en {alerte.label}</div>
        <div style={{ fontSize: '12px', color: 'var(--texte-2)', marginTop: '2px' }}>
          Score moyen : <strong>{alerte.scoreMoyen}%</strong> sur {alerte.nbTentatives} tentatives
        </div>
      </div>
      <Link to="/tuteurs" style={{ marginLeft: 'auto', flexShrink: 0, fontSize: '12px', fontWeight: '600', color: 'var(--terre)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
        Trouver un prof →
      </Link>
    </div>
  )
}

function CarteEnfant({ enfant }) {
  const [alertes, setAlertes] = useState([])

  useEffect(() => {
    api.get(`/parents/alertes/enfant/${enfant.id}`)
      .then(r => setAlertes(r.data))
      .catch(() => {})
  }, [enfant.id])

  const chapitresTermines = enfant.progressions?.filter(p => p.statut === 'TERMINE').length || 0
  const scoreMoyen = enfant.tentatives?.length
    ? Math.round(enfant.tentatives.reduce((s, t) => s + t.score, 0) / enfant.tentatives.length)
    : null

  return (
    <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '1.75rem', boxShadow: 'var(--ombre-sm)', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--foret)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: '16px', flexShrink: 0 }}>
          {enfant.prenom?.[0]}{enfant.nom?.[0]}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: '400' }}>{enfant.prenom} {enfant.nom}</div>
          <div style={{ fontSize: '12px', color: 'var(--texte-3)' }}>{enfant.classe || enfant.niveau} {enfant.ecole ? `· ${enfant.ecole}` : ''}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: 'var(--or)' }}>⭐ {enfant.xpTotal} XP</div>
          <div style={{ fontSize: '12px', color: 'var(--texte-3)' }}>🔥 {enfant.streak} jour(s)</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
        {[
          { val: chapitresTermines, label: 'Chapitres terminés' },
          { val: scoreMoyen !== null ? `${scoreMoyen}%` : '—', label: 'Score moyen' },
          { val: enfant.badges?.length || 0, label: 'Badges' },
        ].map(({ val, label }) => (
          <div key={label} style={{ background: 'var(--sable)', borderRadius: 'var(--r-md)', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: 'var(--foret)' }}>{val}</div>
            <div style={{ fontSize: '11px', color: 'var(--texte-3)', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--erreur)', marginBottom: '8px', letterSpacing: '.5px' }}>MATCH ALERT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {alertes.map(a => <CarteAlerte key={a.matiere} alerte={a} />)}
          </div>
        </div>
      )}

      {/* Dernières progressions */}
      {enfant.progressions?.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--texte-3)', marginBottom: '8px', letterSpacing: '.5px' }}>DERNIÈRES ACTIVITÉS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {enfant.progressions.slice(0, 4).map(p => {
              const s = LABEL_STATUT[p.statut]
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--sable)', borderRadius: 'var(--r-md)' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--texte)' }}>{p.chapitre?.titre}</div>
                    <div style={{ fontSize: '11px', color: 'var(--texte-3)' }}>{p.chapitre?.cours?.titre} · {LABEL_M[p.chapitre?.cours?.matiere]}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {p.score != null && <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foret)' }}>{p.score}%</span>}
                    <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px', background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Badges */}
      {enfant.badges?.length > 0 && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--bord)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--texte-3)', marginBottom: '8px', letterSpacing: '.5px' }}>BADGES</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {enfant.badges.map(b => (
              <div key={b.id} title={b.badge.description} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'var(--or-pale)', borderRadius: '999px', fontSize: '12px', fontWeight: '600', color: 'var(--or)' }}>
                {b.badge.icone} {b.badge.nom}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ParentDashboard() {
  const { utilisateur } = useAuth()
  const [enfants, setEnfants] = useState([])
  const [chargement, setChargement] = useState(true)
  const [emailInput, setEmailInput] = useState('')
  const [lienMsg, setLienMsg] = useState(null)
  const [lienErr, setLienErr] = useState(null)
  const [lienChargement, setLienChargement] = useState(false)

  useEffect(() => {
    api.get('/parents/tableau-de-bord')
      .then(r => setEnfants(r.data))
      .catch(() => {})
      .finally(() => setChargement(false))
  }, [])

  const lierEnfant = async e => {
    e.preventDefault()
    setLienMsg(null)
    setLienErr(null)
    setLienChargement(true)
    try {
      const r = await api.post('/parents/lier-enfant', { emailEnfant: emailInput })
      setLienMsg(r.data.message)
      setEmailInput('')
      const dashboard = await api.get('/parents/tableau-de-bord')
      setEnfants(dashboard.data)
    } catch (err) {
      setLienErr(err.response?.data?.message || 'Erreur.')
    } finally {
      setLienChargement(false)
    }
  }

  if (chargement) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--texte-3)' }}>Chargement...</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', fontWeight: '400', marginBottom: '4px' }}>
          Espace Parent — {utilisateur?.prenom}
        </h1>
        <p style={{ color: 'var(--texte-3)', fontSize: '14px' }}>Suivez la progression scolaire de vos enfants.</p>
      </div>

      {/* Lier un enfant */}
      <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '1.5rem', marginBottom: '2rem', boxShadow: 'var(--ombre-sm)' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: '400', marginBottom: '1rem' }}>
          Ajouter un enfant
        </h2>
        <form onSubmit={lierEnfant} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="email"
            placeholder="Email du compte élève"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            required
            aria-label="Email de l'élève"
            style={{ flex: 1, minWidth: '220px', padding: '10px 14px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'var(--foret)'}
            onBlur={e => e.target.style.borderColor = 'var(--bord)'}
          />
          <button type="submit" disabled={lienChargement} style={{ padding: '10px 20px', background: 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {lienChargement ? '...' : 'Lier'}
          </button>
        </form>
        {lienMsg && <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--succes)', fontWeight: '500' }}>✓ {lienMsg}</div>}
        {lienErr && <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--erreur)' }}>{lienErr}</div>}
        <p style={{ fontSize: '12px', color: 'var(--texte-3)', marginTop: '8px' }}>
          L'élève doit avoir un compte sur AdiaraAcademy. Entrez son adresse email de connexion.
        </p>
      </div>

      {/* Liste des enfants */}
      {enfants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', color: 'var(--texte-3)', fontSize: '14px' }}>
          Aucun enfant lié pour le moment. Entrez l'email de votre enfant ci-dessus.
        </div>
      ) : (
        enfants.map(enfant => <CarteEnfant key={enfant.id} enfant={enfant} />)
      )}
    </div>
  )
}
