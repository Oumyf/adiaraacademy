import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem', textAlign: 'center', gap: '1rem' }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: '6rem', fontWeight: '400', color: 'var(--foret)', lineHeight: 1 }}>404</div>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: '400', color: 'var(--texte)' }}>Page introuvable</h1>
      <p style={{ color: 'var(--texte-2)', fontSize: '15px', maxWidth: '380px', lineHeight: '1.6' }}>
        Cette page n'existe pas ou a été déplacée.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
        <Link to="/" style={{ padding: '11px 24px', background: 'var(--foret)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: '600', fontSize: '14px' }}>
          Accueil
        </Link>
        <Link to="/cours" style={{ padding: '11px 24px', background: 'var(--blanc)', border: '1px solid var(--bord)', color: 'var(--texte)', borderRadius: 'var(--r-md)', fontWeight: '500', fontSize: '14px' }}>
          Voir les cours
        </Link>
      </div>
    </div>
  )
}
