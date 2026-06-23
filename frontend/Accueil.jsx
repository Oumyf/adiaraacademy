import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const MATIERES = [
  { emoji: '📐', nom: 'Mathématiques', desc: 'Algèbre, géométrie, analyse, probabilités' },
  { emoji: '⚗️', nom: 'Physique',      desc: 'Mécanique, électricité, optique, thermodynamique' },
  { emoji: '🧪', nom: 'Chimie',        desc: 'Structure de la matière, réactions, solutions' },
  { emoji: '🌿', nom: 'SVT',           desc: 'Biologie, géologie, évolution, écologie' },
]

const STATS = [
  { valeur: '3 niveaux', label: 'Collège · Lycée · Université' },
  { valeur: '100% gratuit', label: 'Pour tous les élèves du Sénégal' },
  { valeur: 'Bac & BFEM', label: 'Préparation aux examens officiels' },
]

export default function Accueil() {
  const formulaRef = useRef(null)

  // Animation des formules flottantes
  useEffect(() => {
    const formulas = formulaRef.current?.querySelectorAll('.formula-float')
    if (!formulas) return
    formulas.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.4}s`
    })
  }, [])

  return (
    <div>
      {/* ══ HERO ═══════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(160deg, var(--foret) 0%, #0F2B1C 100%)',
        color: '#fff',
        padding: '5rem 2rem 4rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Formules flottantes — décoratives */}
        <div ref={formulaRef} aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden'
        }}>
          {[
            { t: '∫₀¹ f(x) dx', x: '72%', y: '15%' },
            { t: 'Δ = b² − 4ac', x: '8%',  y: '20%' },
            { t: 'eⁱπ + 1 = 0',  x: '78%', y: '60%' },
            { t: 'sin²θ + cos²θ = 1', x: '5%', y: '65%' },
            { t: 'P(A∪B) = P(A)+P(B)−P(A∩B)', x: '55%', y: '80%' },
          ].map((f, i) => (
            <span key={i} className="formula-float" style={{
              position: 'absolute',
              left: f.x, top: f.y,
              fontFamily: 'var(--serif)',
              fontSize: '13px',
              color: 'rgba(255,255,255,.12)',
              whiteSpace: 'nowrap',
              animation: `flotter ${4 + i * 0.7}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.4}s`
            }}>
              {f.t}
            </span>
          ))}
        </div>

        <style>{`
          @keyframes flotter {
            from { transform: translateY(0px); }
            to   { transform: translateY(-12px); }
          }
          @media (prefers-reduced-motion: reduce) {
            .formula-float { animation: none; }
          }
        `}</style>

        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(200,145,42,.2)', border: '1px solid rgba(200,145,42,.4)',
            borderRadius: '999px', padding: '6px 16px',
            fontSize: '13px', color: 'var(--or)', fontWeight: '600',
            marginBottom: '1.5rem', letterSpacing: '.04em'
          }}>
            🇸🇳 Fait pour les élèves sénégalais
          </div>

          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: '400',
            lineHeight: '1.15',
            marginBottom: '1.25rem',
            color: '#fff'
          }}>
            Les sciences ne sont pas
            <span style={{
              display: 'block',
              fontStyle: 'italic',
              color: 'var(--or)'
            }}> difficiles.</span>
            Elles sont mal enseignées.
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,.75)',
            marginBottom: '2.5rem',
            maxWidth: '520px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7'
          }}>
            Cours structurés, quiz interactifs, préparation au BFEM et au Bac —
            tout ce qu'il faut pour progresser, du collège à l'université.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/inscription" style={{
              background: 'var(--or)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 'var(--r-md)',
              fontWeight: '700',
              fontSize: '15px',
              transition: 'var(--transition)',
              display: 'inline-block',
              boxShadow: '0 4px 12px rgba(200,145,42,.4)'
            }}>
              Commencer gratuitement →
            </Link>
            <Link to="/cours" style={{
              background: 'rgba(255,255,255,.1)',
              border: '1px solid rgba(255,255,255,.25)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 'var(--r-md)',
              fontWeight: '500',
              fontSize: '15px',
              display: 'inline-block',
              transition: 'var(--transition)',
            }}>
              Voir les cours
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS ══════════════════════════════════ */}
      <section style={{
        background: 'var(--foret-pale)',
        borderBottom: '1px solid var(--bord)',
        padding: '1.5rem 2rem'
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'flex', justifyContent: 'center',
          gap: '3rem', flexWrap: 'wrap'
        }}>
          {STATS.map(({ valeur, label }) => (
            <div key={valeur} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--serif)', fontSize: '1.5rem',
                color: 'var(--foret)', fontWeight: '400'
              }}>{valeur}</div>
              <div style={{ fontSize: '13px', color: 'var(--texte-2)', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MATIÈRES ════════════════════════════════ */}
      <section style={{ padding: '5rem 2rem', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontSize: '12px', fontWeight: '600', letterSpacing: '.1em',
            color: 'var(--foret)', textTransform: 'uppercase', marginBottom: '10px'
          }}>
            Matières disponibles
          </div>
          <h2 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
            fontWeight: '400', color: 'var(--texte)'
          }}>
            Sciences et mathématiques,<br />
            <em>du programme officiel</em>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {MATIERES.map(({ emoji, nom, desc }) => (
            <Link key={nom} to={`/cours?matiere=${nom.toUpperCase().replace(/\s/g,'_')}`}
              style={{
                background: 'var(--blanc)',
                border: '1px solid var(--bord)',
                borderRadius: 'var(--r-lg)',
                padding: '1.5rem',
                textDecoration: 'none',
                transition: 'var(--transition)',
                display: 'block',
                boxShadow: 'var(--ombre-sm)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = 'var(--ombre-md)'
                e.currentTarget.style.borderColor = 'var(--foret)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = 'var(--ombre-sm)'
                e.currentTarget.style.borderColor = 'var(--bord)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{emoji}</div>
              <div style={{ fontWeight: '600', color: 'var(--texte)', marginBottom: '6px' }}>{nom}</div>
              <div style={{ fontSize: '13px', color: 'var(--texte-2)', lineHeight: '1.5' }}>{desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ COMMENT ÇA MARCHE ═══════════════════════ */}
      <section style={{
        background: 'var(--foret-pale)',
        padding: '5rem 2rem',
        borderTop: '1px solid var(--bord)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '400'
            }}>
              Comment ça marche ?
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {[
              { n: '01', titre: 'Choisis ton niveau et ta matière', desc: 'Collège, lycée ou université — les cours suivent les programmes officiels sénégalais.' },
              { n: '02', titre: 'Lis le cours avec les formules', desc: 'Le contenu affiche les formules mathématiques avec KaTeX, proprement, dans le navigateur.' },
              { n: '03', titre: 'Fais les quiz et gagne des XP', desc: 'Chaque bonne réponse rapporte des points. La difficulté s\'adapte à ton niveau.' },
              { n: '04', titre: 'Suis ta progression', desc: 'Ton tableau de bord montre ce que tu maîtrises, et ce sur quoi travailler.' },
            ].map(({ n, titre, desc }, i) => (
              <div key={n} style={{
                display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                padding: '1.5rem',
                background: 'var(--blanc)',
                border: '1px solid var(--bord)',
                borderRadius: i === 0 ? 'var(--r-lg) var(--r-lg) 0 0'
                  : i === 3 ? '0 0 var(--r-lg) var(--r-lg)' : '0',
                borderTop: i > 0 ? 'none' : '1px solid var(--bord)'
              }}>
                <span style={{
                  fontFamily: 'var(--serif)', fontSize: '1.8rem',
                  color: 'var(--foret)', opacity: '.35', flexShrink: 0,
                  lineHeight: 1, marginTop: '2px'
                }}>{n}</span>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--texte)' }}>{titre}</div>
                  <div style={{ fontSize: '14px', color: 'var(--texte-2)', lineHeight: '1.6' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══════════════════════════════ */}
      <section style={{
        background: 'var(--foret)',
        padding: '5rem 2rem',
        textAlign: 'center',
        color: '#fff'
      }}>
        <h2 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
          fontWeight: '400', marginBottom: '1rem', color: '#fff'
        }}>
          Prêt·e à progresser ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: '2rem', fontSize: '1.05rem' }}>
          Rejoins des milliers d'élèves qui révisent différemment.
        </p>
        <Link to="/inscription" style={{
          background: 'var(--or)',
          color: '#fff',
          padding: '16px 40px',
          borderRadius: 'var(--r-md)',
          fontWeight: '700',
          fontSize: '16px',
          display: 'inline-block',
          boxShadow: '0 4px 16px rgba(200,145,42,.5)',
          transition: 'var(--transition)'
        }}>
          Créer mon compte gratuitement
        </Link>
      </section>
    </div>
  )
}
