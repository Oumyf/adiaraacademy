// Scènes animées des matières : chaque carte montre une petite expérience qui se déroule.
// Dessin en SVG pur ; les mouvements viennent de index.css (classes an-*) et d'animations SMIL.
// Les mouvements sont coupés si l'utilisateur demande moins d'animation.

const T = { fontFamily: "'Instrument Serif', Georgia, serif", fill: '#fff' }
const MONO = 'ui-monospace, Menlo, Consolas, monospace'

const reduit = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Balise SMIL : n'est rendue que si l'animation est permise.
function Anim({ as: Balise = 'animate', ...p }) {
  return reduit() ? null : <Balise repeatCount="indefinite" {...p} />
}

/* ───────────── Mathématiques : une courbe se trace, un point la parcourt ───────────── */
function Maths() {
  const courbe = 'M33 146C62 143 90 128 118 78'
  return (
    <g>
      <text x="16" y="38" fontSize="24" fontStyle="italic" {...T} className="an-formule">a² + b² = c²</text>
      <g stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 70V150H125" opacity=".85" />
        <path d="M24 76 30 68 36 76M119 144 127 150 119 156" opacity=".85" />
        <path d={courbe} strokeWidth="3" pathLength="100" className="an-trace" />
      </g>
      <circle r="5" fill="#F6C945" stroke="#fff" strokeWidth="1.5" className="an-point">
        <Anim as="animateMotion" dur="4s" path={courbe} keyPoints="0;1;1" keyTimes="0;.6;1" calcMode="linear" />
      </circle>
      <g className="an-equerre"><polygon points="128,166 190,166 128,126" fill="#F6C945" opacity=".95" /><polygon points="138,160 170,160 138,138" fill="none" stroke="#C99A1B" strokeWidth="1.5" /></g>
      <g className="an-cube" stroke="#fff" strokeWidth="2" fill="rgba(255,255,255,.12)" strokeLinejoin="round">
        <polygon points="205,62 236,78 236,110 205,126 174,110 174,78" />
        <path d="M205 94V126M205 94 174 78M205 94 236 78" fill="none" />
      </g>
      <text x="206" y="168" fontSize="40" textAnchor="middle" {...T} className="an-pi">π</text>
    </g>
  )
}

/* ───────────── Physique : pendule de Newton, atome, champ magnétique ───────────── */
function Physique() {
  return (
    <g>
      <path d="M70 26H172" stroke="#E9EEF2" strokeWidth="5" strokeLinecap="round" />
      {[100, 120, 140].map(x => (
        <g key={x}><path d={`M${x} 28V135`} stroke="#E9EEF2" strokeWidth="1.8" /><circle cx={x} cy="135" r="10" fill="#E6EBF0" stroke="#9AA7B3" strokeWidth="1.5" /><circle cx={x - 3} cy="131" r="3" fill="#fff" opacity=".7" /></g>
      ))}
      <g className="an-newton-g"><path d="M80 28V135" stroke="#E9EEF2" strokeWidth="1.8" /><circle cx="80" cy="135" r="10" fill="#E6EBF0" stroke="#9AA7B3" strokeWidth="1.5" /><circle cx="77" cy="131" r="3" fill="#fff" opacity=".7" /></g>
      <g className="an-newton-d"><path d="M160 28V135" stroke="#E9EEF2" strokeWidth="1.8" /><circle cx="160" cy="135" r="10" fill="#E6EBF0" stroke="#9AA7B3" strokeWidth="1.5" /><circle cx="157" cy="131" r="3" fill="#fff" opacity=".7" /></g>

      <g transform="translate(214 42)" fill="none" stroke="#fff" strokeWidth="1.8">
        <ellipse rx="28" ry="10" /><ellipse rx="28" ry="10" transform="rotate(60)" /><ellipse rx="28" ry="10" transform="rotate(120)" />
        <circle r="6" fill="#F6C945" stroke="none" className="an-noyau" />
        {[0, 60, 120].map((a, i) => (
          <g key={a} transform={`rotate(${a})`}>
            <circle r="3.5" fill="#fff" stroke="none">
              <Anim as="animateMotion" dur={`${2.6 + i * 0.5}s`} path="M28 0a28 10 0 1 0 -56 0a28 10 0 1 0 56 0" begin={`${-i}s`} />
            </circle>
          </g>
        ))}
      </g>

      <g transform="translate(54 18) scale(.85)">
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" className="an-champ" opacity=".85">
        <path d="M194 118C194 96 232 96 232 118" /><path d="M190 120C188 84 238 84 236 120" /><path d="M186 122C182 72 244 72 240 122" />
      </g>
      <path d="M192 124v24a21 21 0 0 0 42 0v-24" fill="none" stroke="#E5483B" strokeWidth="13" />
      <rect x="185.500" y="118" width="13" height="12" fill="#E9EEF2" /><rect x="227.500" y="118" width="13" height="12" fill="#E9EEF2" />
      </g>
    </g>
  )
}

/* ───────────── Chimie : un titrage — la goutte tombe, la solution change de couleur ───────────── */
function Chimie() {
  const bulles = [[56, 0], [68, .7], [76, 1.4], [62, 2.1]]
  return (
    <g>
      {/* burette */}
      <g>
        <rect x="58" y="6" width="17" height="44" rx="3" fill="rgba(255,255,255,.2)" stroke="#fff" strokeWidth="2.500" />
        <rect x="61" y="22" width="11" height="26" fill="#3AA8FF" opacity=".9" />
        <path d="M66.500 50v6" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <rect x="62" y="46" width="9" height="3" fill="#fff" />
        <g stroke="#fff" strokeWidth="1.200" opacity=".7"><path d="M58 14h5M58 22h5M58 30h5M58 38h5" /></g>
      </g>
      <circle cx="66.500" cy="62" r="3" fill="#3AA8FF" stroke="#fff" strokeWidth="1" className="an-goutte" />

      {/* fiole du titrage */}
      <g transform="translate(14 44) scale(.75)">
        <path d="M42.500 105H97.500L115 140Q120 152 106 152H34Q20 152 25 140Z" fill="#3AA8FF" opacity=".92">
          <Anim attributeName="fill" values="#3AA8FF;#3AA8FF;#F04FA8;#F04FA8;#3AA8FF" keyTimes="0;.3;.5;.9;1" dur="7s" />
        </path>
        <path d="M60 30H80V70L115 140Q120 152 106 152H34Q20 152 25 140L60 70Z" fill="rgba(255,255,255,.18)" stroke="#fff" strokeWidth="3.500" strokeLinejoin="round" />
        <path d="M54 30H86" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        {bulles.map(([x, d]) => <circle key={x} cx={x + 14} cy="140" r="3" fill="#fff" opacity=".8" className="an-bulle" style={{ animationDelay: `${d}s` }} />)}
      </g>

      {/* fiole chauffée */}
      <g transform="translate(124 52) scale(.56)">
        <path d="M42.500 105H97.500L115 140Q120 152 106 152H34Q20 152 25 140Z" fill="#B24BE0" opacity=".9" />
        <path d="M60 30H80V70L115 140Q120 152 106 152H34Q20 152 25 140L60 70Z" fill="rgba(255,255,255,.18)" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
        <path d="M54 30H86" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        {[[50, 0], [70, .5], [88, 1.1], [60, 1.6]].map(([x, d]) => <circle key={x} cx={x} cy="140" r="4" fill="#fff" opacity=".8" className="an-bulle" style={{ animationDelay: `${d}s` }} />)}
      </g>
      {[[154, 0], [160, 1], [166, 2]].map(([x, d]) => (
        <path key={x} d={`M${x} 66c-4-6 4-10 0-16`} fill="none" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" className="an-vapeur" style={{ animationDelay: `${d}s` }} />
      ))}
      {/* brûleur */}
      <path d="M160 138c-9-7-7-15 0-22 7 7 9 15 0 22z" fill="#FFB02E" className="an-flamme" />
      <path d="M160 138c-4-3-3-8 0-11 3 3 4 8 0 11z" fill="#FFE27A" className="an-flamme" />
      <rect x="152" y="138" width="16" height="12" rx="2" fill="#E9EEF2" /><rect x="146" y="150" width="28" height="5" rx="2" fill="#C5CED6" />

      {/* molécule qui tourne */}
      <g transform="translate(224 44)">
        <g>
          <Anim as="animateTransform" attributeName="transform" type="rotate" from="0" to="360" dur="14s" />
          <g stroke="#fff" strokeWidth="3" opacity=".9"><path d="M0 -4 22 12M0 -4 -20 14M0 -4 0 -24" /></g>
          <g fill="#6A4BD6" stroke="#fff" strokeWidth="2"><circle cx="0" cy="-4" r="10" /><circle cx="22" cy="12" r="6" /></g>
          <circle cx="-20" cy="14" r="6" fill="#fff" /><circle cx="0" cy="-24" r="6" fill="#fff" />
        </g>
      </g>
      <text x="194" y="22" fontSize="18" {...T}>H₂O</text>
      <text x="196" y="170" fontSize="14" fontStyle="italic" {...T} opacity="0">pH</text>
    </g>
  )
}

/* ───────────── SVT : l'ADN se tord, la lumière traverse le microscope ───────────── */
function Svt() {
  const a = 'M196 14C232 34 232 56 196 78S160 122 196 144'
  const b = 'M232 14C196 34 196 56 232 78S268 122 232 144'
  return (
    <g>
      <g strokeLinecap="round" strokeLinejoin="round">
        <polygon points="62,152 88,152 84,128 66,128" fill="#fff" className="an-lumiere" />
        <rect x="38" y="152" width="84" height="12" rx="5" fill="#EAF0EE" />
        <path d="M100 152C136 142 138 86 104 62" fill="none" stroke="#EAF0EE" strokeWidth="9" />
        <g transform="rotate(-22 78 70)"><rect x="66" y="22" width="24" height="70" rx="5" fill="#fff" /><rect x="70" y="10" width="16" height="16" rx="3" fill="#C7D3CF" /><rect x="72" y="90" width="12" height="14" rx="2" fill="#9FB1AB" /></g>
        <rect x="52" y="124" width="52" height="7" rx="3" fill="#CAD7D3" />
        <ellipse cx="75" cy="120" rx="10" ry="3" fill="#F6C945" className="an-lamelle" />
      </g>
      <g fill="none" strokeLinecap="round">
        <path d={a} stroke="#fff" strokeWidth="5"><Anim attributeName="d" values={`${a};${b};${a}`} dur="3.600s" /></path>
        <path d={b} stroke="#F6C945" strokeWidth="5"><Anim attributeName="d" values={`${b};${a};${b}`} dur="3.600s" /></path>
      </g>
      {/* cellules qui dérivent, l'une se divise */}
      <g className="an-cell" style={{ animationDelay: '0s' }}><circle cx="148" cy="30" r="9" fill="rgba(255,255,255,.35)" stroke="#fff" strokeWidth="1.600" /><circle cx="148" cy="30" r="3.200" fill="#F6C945" /></g>
      <g className="an-cell" style={{ animationDelay: '-2s' }}><circle cx="160" cy="68" r="6" fill="rgba(255,255,255,.35)" stroke="#fff" strokeWidth="1.600" /><circle cx="160" cy="68" r="2.200" fill="#F6C945" /></g>
      <g className="an-division"><ellipse cx="150" cy="104" rx="9" ry="9" fill="rgba(255,255,255,.35)" stroke="#fff" strokeWidth="1.600" /><circle cx="146" cy="104" r="2.600" fill="#F6C945" /><circle cx="154" cy="104" r="2.600" fill="#F6C945" /></g>
      <g className="an-feuille"><g transform="translate(160 150) rotate(-18)">
        <path d="M0 0C-4-24 14-40 40-38 42-12 22 6 0 0Z" fill="#B9E38A" stroke="#fff" strokeWidth="2" />
        <path d="M2-2C14-12 24-22 34-32" stroke="#6AA13A" strokeWidth="2" fill="none" />
      </g></g>
    </g>
  )
}

/* ───────────── Informatique : du code qui s'écrit, un engrenage qui tourne ───────────── */
function Info() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(52 56)">
        <g className="an-engrenage">
          <circle r="19" fill="none" stroke="#fff" strokeWidth="9" strokeDasharray="7.100 7.100" opacity=".9" />
          <circle r="15" fill="#fff" opacity=".95" /><circle r="6" fill="#6B5BD6" />
        </g>
      </g>
      <rect x="62" y="48" width="142" height="92" rx="8" fill="#1B1F3B" stroke="#E4DEFF" strokeWidth="4" />
      <text x="133" y="108" fontSize="34" textAnchor="middle" fill="#5EE0F0" fontFamily={MONO} fontWeight="700" className="an-balises">{'</>'}</text>
      <g stroke="#8E86E8" strokeWidth="3.500">
        <path d="M74 62h26" className="an-ligne" style={{ animationDelay: '0s' }} />
        <path d="M74 73h44" className="an-ligne" style={{ animationDelay: '.5s' }} />
        <path d="M74 84h30" className="an-ligne" style={{ animationDelay: '1s' }} />
        <path d="M148 126h34" className="an-ligne" style={{ animationDelay: '1.5s' }} />
      </g>
      <rect x="186" y="119" width="5" height="12" fill="#5EE0F0" className="an-curseur" />
      <path d="M44 146H222L212 158H54Z" fill="#E4DEFF" />
      <rect x="116" y="146" width="34" height="4" rx="2" fill="#B9B0F0" />
      {[['1', 92, 0], ['0', 130, 1.1], ['1', 172, .5], ['0', 208, 1.7]].map(([c, x, d]) => (
        <text key={x} x={x} y="40" fontSize="14" fill="#fff" fontFamily={MONO} className="an-bit" style={{ animationDelay: `${d}s` }}>{c}</text>
      ))}
      <text x="212" y="100" fontSize="13" fill="#fff" fontFamily={MONO} opacity=".9">{'{ }'}</text>
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
