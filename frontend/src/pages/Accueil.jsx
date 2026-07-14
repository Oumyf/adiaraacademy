import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const MATIERES = [
  { icone: '📐', label: 'Mathématiques', filtre: 'MATHEMATIQUES', desc: 'Algèbre, géométrie, analyse, probabilités' },
  { icone: '⚡', label: 'Physique',      filtre: 'PHYSIQUE',      desc: 'Mécanique, électricité, optique' },
  { icone: '🧪', label: 'Chimie',        filtre: 'CHIMIE',        desc: 'Structure de la matière, réactions, solutions' },
  { icone: '🌿', label: 'SVT',           filtre: 'SCIENCES_VIE_TERRE', desc: 'Biologie, géologie, évolution, écologie' },
  { icone: '💻', label: 'Informatique',  filtre: 'INFORMATIQUE',  desc: 'Algorithmes, programmation, réseaux' },
]

export default function Accueil() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(160deg, var(--foret) 0%, #0F2B1C 100%)', color: '#fff', padding: '5rem 2rem 4rem', textAlign: 'center', minHeight: '520px', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(200,145,42,.2)', border: '1px solid rgba(200,145,42,.4)', borderRadius: '999px', padding: '6px 16px', fontSize: '13px', color: 'var(--or)', fontWeight: '600', marginBottom: '1.5rem' }}>
            Fait pour les eleves senegalais
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '400', lineHeight: '1.15', marginBottom: '1.25rem' }}>
            Les sciences ne sont pas
            <span style={{ display: 'block', fontStyle: 'italic', color: 'var(--or)' }}> difficiles.</span>
            Elles sont mal enseignees.
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,.75)', marginBottom: '2.5rem', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
            Cours structures, quiz interactifs, preparation au BFEM et au Bac — tout ce qu'il faut pour progresser.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/inscription" style={{ background: 'var(--or)', color: '#fff', padding: '14px 32px', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '15px', display: 'inline-block' }}>
              Commencer gratuitement
            </Link>
            <Link to="/cours" style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.25)', color: '#fff', padding: '14px 32px', borderRadius: 'var(--r-md)', fontWeight: '500', fontSize: '15px', display: 'inline-block' }}>
              Voir les cours
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 2rem', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '400' }}>
            Matieres disponibles
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {MATIERES.map(({ icone, label, filtre, desc }) => (
            <Link key={filtre} to={`/cours?matiere=${filtre}`}
              style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-lg)', padding: '1.5rem', textDecoration: 'none', display: 'block', boxShadow: 'var(--ombre-sm)', transition: 'var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--foret)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--ombre-md)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bord)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--ombre-sm)' }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '10px' }}>{icone}</div>
              <div style={{ fontWeight: '600', color: 'var(--texte)', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontSize: '13px', color: 'var(--texte-2)', lineHeight: '1.5' }}>{desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--foret)', padding: '5rem 2rem', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: '400', marginBottom: '1rem' }}>
          Pret a progresser ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: '2rem' }}>Rejoins des milliers d'eleves qui revisent differemment.</p>
        <Link to="/inscription" style={{ background: 'var(--or)', color: '#fff', padding: '16px 40px', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '16px', display: 'inline-block' }}>
          Creer mon compte gratuitement
        </Link>
      </section>
    </div>
  )
}
