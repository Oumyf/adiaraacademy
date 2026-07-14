import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

export default function Layout() {
  const { utilisateur, deconnexion } = useAuth()
  const navigate = useNavigate()
  const [menuOuvert, setMenuOuvert] = useState(false)

  const handleDeconnexion = () => {
    deconnexion()
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Navbar ─────────────────────────────── */}
      <nav style={{
        background: 'var(--foret)',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,.15)'
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ fontSize: '22px' }}>📐</span>
          <span style={{
            fontFamily: 'var(--serif)',
            fontSize: '20px',
            color: '#fff',
            letterSpacing: '-.3px'
          }}>
            Adiara<span style={{ color: 'var(--or)' }}>Academy</span>
          </span>
        </NavLink>

        {/* Liens nav desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { to: '/cours',      label: 'Cours' },
            { to: '/classement', label: 'Classement' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              color: isActive ? 'var(--or)' : 'rgba(255,255,255,.8)',
              fontWeight: '500',
              fontSize: '14px',
              padding: '6px 12px',
              borderRadius: 'var(--r-sm)',
              transition: 'var(--transition)',
              background: isActive ? 'rgba(255,255,255,.1)' : 'transparent'
            })}>
              {label}
            </NavLink>
          ))}

          {utilisateur ? (
            <>
              <NavLink to="/dashboard" style={({ isActive }) => ({
                color: isActive ? 'var(--or)' : 'rgba(255,255,255,.8)',
                fontWeight: '500',
                fontSize: '14px',
                padding: '6px 12px',
                borderRadius: 'var(--r-sm)',
                transition: 'var(--transition)',
                background: isActive ? 'rgba(255,255,255,.1)' : 'transparent'
              })}>
                Mon espace
              </NavLink>

              {(utilisateur.role === 'PROFESSEUR' || utilisateur.role === 'ADMIN') && (
                <NavLink to="/creer-cours" style={({ isActive }) => ({
                  color: isActive ? 'var(--or)' : 'rgba(255,255,255,.8)',
                  fontWeight: '500',
                  fontSize: '14px',
                  padding: '6px 12px',
                  borderRadius: 'var(--r-sm)',
                  transition: 'var(--transition)',
                  background: isActive ? 'rgba(255,255,255,.1)' : 'transparent'
                })}>
                  + Cours
                </NavLink>
              )}

              {/* XP badge */}
              <span style={{
                background: 'var(--or-pale)',
                color: 'var(--or)',
                fontSize: '12px',
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ⭐ {utilisateur.xpTotal || 0} XP
              </span>

              <button onClick={handleDeconnexion} style={{
                background: 'rgba(255,255,255,.12)',
                border: '1px solid rgba(255,255,255,.2)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 'var(--r-sm)',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/connexion" style={{
                color: 'rgba(255,255,255,.85)',
                fontSize: '14px',
                fontWeight: '500',
                padding: '6px 14px',
              }}>
                Connexion
              </NavLink>
              <NavLink to="/inscription" style={{
                background: 'var(--or)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                padding: '8px 18px',
                borderRadius: 'var(--r-sm)',
                transition: 'var(--transition)',
              }}>
                Commencer
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* ── Contenu ────────────────────────────── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer style={{
        background: 'var(--foret)',
        color: 'rgba(255,255,255,.6)',
        textAlign: 'center',
        padding: '1.5rem',
        fontSize: '13px',
        marginTop: 'auto'
      }}>
        <span style={{ fontFamily: 'var(--serif)', color: 'rgba(255,255,255,.9)', fontSize: '15px' }}>
          Adiara<span style={{ color: 'var(--or)' }}>Academy</span>
        </span>
        {' '}· Dakar, Sénégal · {new Date().getFullYear()}
        <div style={{ marginTop: '4px', fontSize: '12px' }}>
          Les mathématiques pour tous, du collège à l'université.
        </div>
      </footer>
    </div>
  )
}
