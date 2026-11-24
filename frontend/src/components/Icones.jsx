// Icônes en trait (style uniforme, 24x24). Aucune dépendance externe.
const base = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

const chemins = {
  maths:    <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></>,
  physique: <path d="M13 2 4 14h7l-1 8 9-12h-7z"/>,
  chimie:   <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/></>,
  svt:      <><path d="M5 21c0-9 5-15 15-16 0 10-6 15-15 16z"/><path d="M5 21c3-5 6-8 10-10"/></>,
  info:     <><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></>,
  trophee:  <><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4a3 3 0 0 0 3 4M16 6h4a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4"/></>,
  flamme:   <path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.5 1 2 2 2 0-3-1-5 1-8z"/>,
  livre:    <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/></>,
  cible:    <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  etoile:   <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>,
  check:    <path d="m5 12.5 4.5 4.5L19 7.5"/>,
  fleche:   <path d="M5 12h14M13 6l6 6-6 6"/>,
  eleves:   <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/></>,
  bouclier: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/></>,
  hors_ligne: <><path d="M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/><path d="m3 3 18 18"/></>,
  horloge:  <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  lieu:     <><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></>,
  croix:    <path d="M6 6l12 12M18 6 6 18"/>,
  etincelle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.200.8L19 22l-.8-2.200L16 19l2.200-.8z"/></>,
  crayon:   <><path d="M4 20h4L19 9a2.800 2.800 0 0 0-4-4L4 16z"/><path d="m13.500 6.500 4 4"/></>,
  plus:     <path d="M12 5v14M5 12h14"/>,
  cadenas:  <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
  retour:   <path d="M19 12H5M11 6l-6 6 6 6"/>,
  alerte:   <><path d="M12 3 2.500 20h19z"/><path d="M12 10v4M12 17.500v.01"/></>,
  menu:     <path d="M4 7h16M4 12h16M4 17h16"/>,
  fermer:   <path d="M6 6l12 12M18 6 6 18"/>,
  soleil:   <><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></>,
  lune:     <path d="M20 14.5A8.500 8.500 0 0 1 9.500 4 8.500 8.500 0 1 0 20 14.500z"/>,
}

export default function Icone({ nom, taille = 24, style, className }) {
  return <svg {...base} width={taille} height={taille} style={style} className={className}>{chemins[nom]}</svg>
}

// Logo officiel (prototype validé) : carré doré arrondi avec un « A » serif vert forêt.
// Le mot-symbole s'écrit « Adiara » en blanc suivi de « Academy » en or, en Instrument Serif.
export function Logo({ taille = 34 }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: taille, height: taille, borderRadius: Math.round(taille * 0.265), background: '#C8912A', color: '#1A4A2E',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        fontFamily: "'Instrument Serif', Georgia, serif", fontSize: Math.round(taille * 0.62), lineHeight: 1,
      }}
    >A</span>
  )
}
