import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const COULEURS_STATUT = {
  TERMINE:       { bg: '#E6F4EC', color: '#276749', label: 'Terminé' },
  EN_COURS:      { bg: '#FEF6E4', color: '#C8912A', label: 'En cours' },
  NON_COMMENCE:  { bg: '#F1F5F9', color: '#64748B', label: 'Non commencé' },
}

export default function Dashboard() {
  const { utilisateur } = useAuth()
  const [data, setData] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    api.get('/progression/moi')
      .then(r => setData(r.data))
      .catch(() => setErreur('Impossible de charger le tableau de bord.'))
      .finally(() => setChargement(false))
  }, [])

  if (chargement) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--texte-3)' }}>
      Chargement…
    </div>
  )

  if (erreur) return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center', color: 'var(--erreur)' }}>
      {erreur}
    </div>
  )

  const { profil, stats, progressions, dernieresTentatives, badges } = data

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {/* ── En-tête ───────────────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '6px' }}>
          {/* Avatar initiales */}
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'var(--foret)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--serif)', fontSize: '20px', flexShrink: 0
          }}>
            {profil.prenom?.[0]}{profil.nom?.[0]}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', fontWeight: '400', color: 'var(--texte)' }}>
              Bonjour, {profil.prenom} !
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--texte-3)' }}>
              {profil.classe || profil.niveau} · {profil.streak} jour{profil.streak > 1 ? 's' : ''} de streak 🔥
            </div>
          </div>
        </div>
      </div>

      {/* ── Cartes statistiques ───────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '2.5rem'
      }}>
        {[
          { valeur: profil.xpTotal,           unite: 'XP',        label: 'Points gagnés',     icone: '⭐' },
          { valeur: stats.chapitresTermines,   unite: `/ ${stats.totalChapitres}`, label: 'Chapitres terminés', icone: '✅' },
          { valeur: `${stats.scoreMoyen}%`,    unite: '',          label: 'Score moyen',        icone: '📊' },
          { valeur: stats.totalBadges,         unite: '',          label: 'Badges obtenus',     icone: '🏅' },
        ].map(({ valeur, unite, label, icone }) => (
          <div key={label} style={{
            background: 'var(--blanc)',
            border: '1px solid var(--bord)',
            borderRadius: 'var(--r-lg)',
            padding: '1.25rem 1.5rem',
            boxShadow: 'var(--ombre-sm)'
          }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icone}</div>
            <div style={{ fontSize: '1.6rem', fontFamily: 'var(--serif)', color: 'var(--foret)', fontWeight: '400' }}>
              {valeur}<span style={{ fontSize: '1rem', color: 'var(--texte-3)', marginLeft: '4px' }}>{unite}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--texte-2)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

        {/* ── Colonne gauche ─────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Progression par chapitre */}
          <div style={{
            background: 'var(--blanc)', border: '1px solid var(--bord)',
            borderRadius: 'var(--r-lg)', padding: '1.5rem', boxShadow: 'var(--ombre-sm)'
          }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: '400', marginBottom: '1rem', color: 'var(--texte)' }}>
              Mes chapitres
            </h2>
            {progressions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--texte-3)', fontSize: '14px' }}>
                Aucun chapitre commencé.{' '}
                <Link to="/cours" style={{ color: 'var(--foret)', fontWeight: '500' }}>Voir les cours →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {progressions.map(p => {
                  const s = COULEURS_STATUT[p.statut]
                  return (
                    <Link key={p.id} to={`/chapitres/${p.chapitreId}`} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: 'var(--sable)',
                      borderRadius: 'var(--r-md)',
                      textDecoration: 'none',
                      transition: 'var(--transition)',
                      border: '1px solid transparent'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--foret)'; e.currentTarget.style.background = 'var(--foret-pale)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--sable)' }}
                    >
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px', color: 'var(--texte)' }}>
                          {p.chapitre?.titre}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--texte-3)', marginTop: '2px' }}>
                          {p.chapitre?.cours?.titre}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        {p.score != null && (
                          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foret)' }}>
                            {p.score}%
                          </span>
                        )}
                        <span style={{
                          background: s.bg, color: s.color,
                          fontSize: '11px', fontWeight: '600',
                          padding: '3px 9px', borderRadius: '999px'
                        }}>
                          {s.label}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Dernières tentatives */}
          {dernieresTentatives.length > 0 && (
            <div style={{
              background: 'var(--blanc)', border: '1px solid var(--bord)',
              borderRadius: 'var(--r-lg)', padding: '1.5rem', boxShadow: 'var(--ombre-sm)'
            }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: '400', marginBottom: '1rem', color: 'var(--texte)' }}>
                Quiz récents
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dernieresTentatives.map((t, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', background: 'var(--sable)', borderRadius: 'var(--r-md)'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--texte)' }}>
                        {t.quiz?.titre}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--texte-3)', marginTop: '2px' }}>
                        {new Date(t.commenceLe).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '14px', fontWeight: '700',
                        color: t.score >= 50 ? 'var(--succes)' : 'var(--erreur)'
                      }}>
                        {t.score}%
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--or)', fontWeight: '600' }}>
                        +{t.xpGagne} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Colonne droite — Badges ──────────── */}
        <div style={{
          background: 'var(--blanc)', border: '1px solid var(--bord)',
          borderRadius: 'var(--r-lg)', padding: '1.5rem', boxShadow: 'var(--ombre-sm)'
        }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: '400', marginBottom: '1rem', color: 'var(--texte)' }}>
            Mes badges
          </h2>
          {badges.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--texte-3)', fontSize: '13px' }}>
              Complète des quiz pour débloquer tes premiers badges !
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {badges.map(b => (
                <div key={b.id} title={b.badge.description} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '6px', padding: '12px',
                  background: 'var(--foret-pale)',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--bord)',
                  width: '80px', textAlign: 'center'
                }}>
                  <span style={{ fontSize: '1.8rem' }}>{b.badge.icone}</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--foret)', lineHeight: '1.3' }}>
                    {b.badge.nom}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Raccourcis */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--bord)', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--texte-3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '10px' }}>
              Aller vers
            </div>
            {[
              { to: '/cours', label: '📚 Explorer les cours' },
              { to: '/classement', label: '🏆 Voir le classement' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                display: 'block', padding: '9px 12px', borderRadius: 'var(--r-sm)',
                fontSize: '13px', fontWeight: '500', color: 'var(--foret)',
                textDecoration: 'none', transition: 'var(--transition)',
                marginBottom: '4px'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--foret-pale)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
