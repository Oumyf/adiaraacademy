// Illustrations vectorielles des matières : formules, instruments et objets du cours.
// Dessinées en SVG (aucune image externe), elles se posent sur le dégradé de chaque carte.

const T = { fontFamily: "'Instrument Serif', Georgia, serif", fill: '#fff' }

function Maths() {
  return (
    <g>
      <text x="16" y="38" fontSize="24" fontStyle="italic" {...T}>a² + b² = c²</text>
      {/* repère et courbe */}
      <g stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 70V150H125" opacity=".85" />
        <path d="M33 146C62 143 90 128 118 78" strokeWidth="3" />
        <path d="M24 76 30 68 36 76M119 144 127 150 119 156" opacity=".85" />
      </g>
      <g stroke="#fff" strokeWidth="1.5" strokeDasharray="3 4" opacity=".6"><path d="M90 150V122M30 122H90" /></g>
      {/* équerre */}
      <polygon points="128,166 190,166 128,126" fill="#F6C945" opacity=".95" />
      <polygon points="138,160 170,160 138,138" fill="none" stroke="#C99A1B" strokeWidth="1.5" />
      {/* cube */}
      <g stroke="#fff" strokeWidth="2" fill="rgba(255,255,255,.12)" strokeLinejoin="round">
        <polygon points="205,62 236,78 236,110 205,126 174,110 174,78" />
        <path d="M205 94V126M205 94 174 78M205 94 236 78" fill="none" />
      </g>
      <text x="206" y="168" fontSize="40" textAnchor="middle" {...T} opacity=".95">π</text>
    </g>
  )
}

function Physique() {
  return (
    <g>
      {/* pendule de Newton */}
      <g stroke="#E9EEF2" strokeWidth="1.8" fill="none">
        <path d="M70 26H172" strokeWidth="5" strokeLinecap="round" />
        <path d="M80 28 27 121" /><path d="M100 28V135" /><path d="M120 28V135" /><path d="M140 28V135" /><path d="M160 28V135" />
      </g>
      <g fill="#E6EBF0" stroke="#9AA7B3" strokeWidth="1.5">
        <circle cx="27" cy="121" r="11" /><circle cx="100" cy="135" r="11" /><circle cx="120" cy="135" r="11" /><circle cx="140" cy="135" r="11" /><circle cx="160" cy="135" r="11" />
      </g>
      <g fill="#fff" opacity=".7"><circle cx="24" cy="117" r="3" /><circle cx="97" cy="131" r="3" /><circle cx="117" cy="131" r="3" /></g>
      {/* atome */}
      <g transform="translate(212 62)" fill="none" stroke="#fff" strokeWidth="1.8">
        <ellipse rx="30" ry="11" /><ellipse rx="30" ry="11" transform="rotate(60)" /><ellipse rx="30" ry="11" transform="rotate(120)" />
        <circle r="7" fill="#F6C945" stroke="none" />
        <circle cx="30" cy="0" r="3.5" fill="#fff" stroke="none" /><circle cx="-15" cy="-26" r="3.5" fill="#fff" stroke="none" /><circle cx="-15" cy="26" r="3.5" fill="#fff" stroke="none" />
      </g>
      {/* aimant */}
      <path d="M192 122v26a21 21 0 0 0 42 0v-26" fill="none" stroke="#E5483B" strokeWidth="13" />
      <rect x="185.500" y="116" width="13" height="12" fill="#E9EEF2" /><rect x="227.500" y="116" width="13" height="12" fill="#E9EEF2" />
    </g>
  )
}

function Flacon({ liquide, t }) {
  return (
    <g transform={t}>
      <path d="M42.500 105H97.500L115 140Q120 152 106 152H34Q20 152 25 140Z" fill={liquide} opacity=".9" />
      <path d="M60 30H80V70L115 140Q120 152 106 152H34Q20 152 25 140L60 70Z" fill="rgba(255,255,255,.18)" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      <path d="M54 30H86" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <g fill="#fff" opacity=".75"><circle cx="62" cy="122" r="3" /><circle cx="78" cy="132" r="2.200" /><circle cx="86" cy="116" r="2.800" /></g>
    </g>
  )
}

function Chimie() {
  return (
    <g>
      <Flacon liquide="#3AA8FF" t="translate(8 12) scale(.95)" />
      <Flacon liquide="#B24BE0" t="translate(112 44) scale(.7)" />
      {/* molécule */}
      <g stroke="#fff" strokeWidth="3" opacity=".9"><path d="M196 42 228 58M228 58 214 90M196 42 170 62" /></g>
      <g fill="#6A4BD6" stroke="#fff" strokeWidth="2"><circle cx="196" cy="42" r="9" /><circle cx="228" cy="58" r="11" /><circle cx="214" cy="90" r="8" /></g>
      <circle cx="170" cy="62" r="7" fill="#fff" />
      <text x="150" y="30" fontSize="20" {...T}>H₂O</text>
    </g>
  )
}

function Svt() {
  return (
    <g>
      {/* microscope */}
      <g strokeLinecap="round" strokeLinejoin="round">
        <rect x="38" y="152" width="84" height="12" rx="5" fill="#EAF0EE" />
        <path d="M100 152C136 142 138 86 104 62" fill="none" stroke="#EAF0EE" strokeWidth="9" />
        <g transform="rotate(-22 78 70)"><rect x="66" y="22" width="24" height="70" rx="5" fill="#fff" /><rect x="70" y="10" width="16" height="16" rx="3" fill="#C7D3CF" /><rect x="72" y="90" width="12" height="14" rx="2" fill="#9FB1AB" /></g>
        <rect x="52" y="124" width="52" height="7" rx="3" fill="#CAD7D3" />
        <ellipse cx="75" cy="120" rx="10" ry="3" fill="#F6C945" opacity=".9" />
      </g>
      {/* ADN */}
      <g fill="none" strokeLinecap="round">
        <path d="M196 14C232 34 232 56 196 78S160 122 196 144" stroke="#fff" strokeWidth="5" />
        <path d="M232 14C196 34 196 56 232 78S268 122 232 144" stroke="#F6C945" strokeWidth="5" />
        <g stroke="#fff" strokeWidth="2.500" opacity=".75"><path d="M203 24 225 24M209 50 219 50M209 106 219 106M203 132 225 132" /></g>
      </g>
      {/* feuille */}
      <g transform="translate(160 150) rotate(-18)">
        <path d="M0 0C-4-24 14-40 40-38 42-12 22 6 0 0Z" fill="#B9E38A" stroke="#fff" strokeWidth="2" />
        <path d="M2-2C14-12 24-22 34-32" stroke="#6AA13A" strokeWidth="2" fill="none" />
      </g>
    </g>
  )
}

function Info() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* engrenage */}
      <g transform="translate(52 56)">
        <circle r="19" fill="none" stroke="#fff" strokeWidth="9" strokeDasharray="7.100 7.100" opacity=".9" />
        <circle r="15" fill="#fff" opacity=".95" /><circle r="6" fill="#6B5BD6" />
      </g>
      {/* ordinateur */}
      <rect x="62" y="48" width="142" height="92" rx="8" fill="#1B1F3B" stroke="#E4DEFF" strokeWidth="4" />
      <text x="133" y="104" fontSize="34" textAnchor="middle" fill="#5EE0F0" fontFamily="ui-monospace, Menlo, Consolas, monospace" fontWeight="700">{'</>'}</text>
      <g stroke="#8E86E8" strokeWidth="3" opacity=".9"><path d="M74 62h26M74 72h42M148 124h40" /></g>
      <path d="M44 146H222L212 158H54Z" fill="#E4DEFF" />
      <rect x="116" y="146" width="34" height="4" rx="2" fill="#B9B0F0" />
      {/* octets et code */}
      <text x="84" y="34" fontSize="13" {...T} opacity=".9" fontFamily="ui-monospace, Menlo, Consolas, monospace">print("Salam")</text>
    </g>
  )
}

const PAR_MATIERE = {
  MATHEMATIQUES: Maths, PHYSIQUE: Physique, CHIMIE: Chimie, SCIENCES_VIE_TERRE: Svt, INFORMATIQUE: Info,
}

export default function Illustration({ matiere, className = 'illustration' }) {
  const Dessin = PAR_MATIERE[matiere] || Maths
  return (
    <svg className={className} viewBox="0 0 260 180" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <Dessin />
    </svg>
  )
}
