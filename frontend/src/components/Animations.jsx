import { useEffect, useRef, useState } from 'react'

// Révèle un bloc quand il entre dans l'écran (une seule fois).
export function Revele({ children, delai = 0, className = '', as: Balise = 'div', ...reste }) {
  const ref = useRef(null)
  const [vu, setVu] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setVu(true); return }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVu(true); obs.disconnect() }
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <Balise ref={ref} className={`revele${vu ? ' vu' : ''} ${className}`} style={{ '--d': `${delai}ms` }} {...reste}>
      {children}
    </Balise>
  )
}

// Compte de 0 jusqu'à la valeur quand le bloc devient visible.
export function Compteur({ valeur, duree = 1400 }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduit = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduit || !('IntersectionObserver' in window)) { setN(valeur); return }
    let raf
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const debut = performance.now()
      const pas = (t) => {
        const p = Math.min((t - debut) / duree, 1)
        setN(Math.round(valeur * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(pas)
      }
      raf = requestAnimationFrame(pas)
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => { obs.disconnect(); cancelAnimationFrame(raf) }
  }, [valeur, duree])
  return <span ref={ref}>{n.toLocaleString('fr-FR')}</span>
}

// Symboles qui flottent doucement derrière le titre.
const SYMBOLES = [
  { s: 'π',  x: '6%',  y: '16%', t: 54, d: 0,  dur: 9 },
  { s: '√',  x: '44%', y: '8%',  t: 44, d: 2,  dur: 11 },
  { s: '∑',  x: '90%', y: '12%', t: 50, d: 1,  dur: 10 },
  { s: 'x²', x: '3%',  y: '70%', t: 40, d: 3,  dur: 12 },
  { s: '%',  x: '48%', y: '86%', t: 42, d: 1.5, dur: 9.5 },
  { s: '∞',  x: '94%', y: '78%', t: 52, d: 2.5, dur: 11.5 },
  { s: 'H₂O', x: '22%', y: '90%', t: 28, d: .5, dur: 10.5 },
]
export function SymbolesFlottants() {
  return (
    <div className="symboles" aria-hidden="true">
      {SYMBOLES.map((o, i) => (
        <span key={i} style={{ left: o.x, top: o.y, fontSize: o.t, animationDelay: `${o.d}s`, animationDuration: `${o.dur}s` }}>{o.s}</span>
      ))}
    </div>
  )
}
