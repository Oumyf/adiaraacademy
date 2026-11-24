import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Icone from '../components/Icones'
import { Revele, Compteur, SymbolesFlottants } from '../components/Animations'

const MATIERES = [
  { icone: 'maths',    classe: 'm-maths', label: 'Maths',       filtre: 'MATHEMATIQUES',      desc: 'Algèbre, géométrie, analyse, probabilités' },
  { icone: 'physique', classe: 'm-phys',  label: 'Physique',    filtre: 'PHYSIQUE',           desc: 'Mécanique, électricité, optique' },
  { icone: 'chimie',   classe: 'm-chim',  label: 'Chimie',      filtre: 'CHIMIE',             desc: 'Matière, réactions, solutions' },
  { icone: 'svt',      classe: 'm-svt',   label: 'SVT',         filtre: 'SCIENCES_VIE_TERRE', desc: 'Biologie, géologie, écologie' },
  { icone: 'info',     classe: 'm-info',  label: 'Informatique', filtre: 'INFORMATIQUE',      desc: 'Algorithmes, programmation, réseaux' },
]

const CHIFFRES = [
  { n: 27, l: 'cours du collège à la Terminale' },
  { n: 81, l: 'chapitres structurés' },
  { n: 648, l: 'questions de quiz' },
  { n: 5, l: 'matières scientifiques' },
]

const A_LA_UNE = [
  { classe: 'm-maths', icone: 'maths', matiere: 'MATHEMATIQUES', titre: 'Mathématiques Terminale', desc: 'Limites, dérivées, intégrales : tout pour le Bac.', niveau: 'Lycée' },
  { classe: 'm-phys',  icone: 'physique', matiere: 'PHYSIQUE', titre: 'Physique Première S', desc: 'Mécanique et électricité avec des exercices types.', niveau: 'Lycée' },
  { classe: 'm-chim',  icone: 'chimie', matiere: 'CHIMIE', titre: 'Chimie Seconde', desc: 'La mole, la concentration et la structure de l\'atome.', niveau: 'Lycée' },
  { classe: 'm-svt',   icone: 'svt', matiere: 'SCIENCES_VIE_TERRE', titre: 'SVT 3ème', desc: 'ADN, immunité et système nerveux pour le BFEM.', niveau: 'Collège' },
  { classe: 'm-info',  icone: 'info', matiere: 'INFORMATIQUE', titre: 'Informatique Première', desc: 'Tris, complexité et réseaux, avec du code Python.', niveau: 'Lycée' },
  { classe: 'm-maths', icone: 'maths', matiere: 'MATHEMATIQUES', titre: 'Mathématiques 3ème', desc: 'Les bases solides pour réussir le BFEM.', niveau: 'Collège' },
]

const ETAPES = [
  { t: 'Choisis ton niveau', d: 'Collège, lycée ou université : les cours suivent ton programme.' },
  { t: 'Suis des cours clairs', d: 'Leçons structurées, formules expliquées pas à pas, exemples concrets.' },
  { t: 'Teste-toi avec des quiz', d: 'Le quiz s\'adapte : il monte d\'un cran quand tu réussis, redescend quand tu bloques.' },
  { t: 'Progresse, point par point', d: 'Points d\'expérience, séries de jours et classement rendent la régularité visible.' },
]

const TITRE = [
  ...'Les sciences ne sont pas difficiles. Elles sont'.split(' ').map(t => ({ t })),
  ...'mal enseignées.'.split(' ').map(t => ({ t, em: true })),
]

export default function Accueil() {
  const piste = useRef(null)
  const defiler = (sens) => {
    const el = piste.current
    if (el) el.scrollBy({ left: sens * Math.max(el.clientWidth * 0.8, 280), behavior: 'smooth' })
  }

  return (
    <div>
      {/* ── Héros ─────────────────────────────── */}
      <section className="hero">
        <SymbolesFlottants />
        <span className="forme forme-demi" aria-hidden="true" />
        <span className="forme forme-rond" aria-hidden="true" />
        <span className="forme forme-croix" aria-hidden="true" />
        <div className="hero-int">
          <div>
            <h1 aria-label="Les sciences ne sont pas difficiles. Elles sont mal enseignées.">
              {TITRE.map((m, i) => <span key={i} className="mot" aria-hidden="true" style={{ animationDelay: `${0.15 + i * 0.09}s` }}>{m.em ? <em>{m.t}</em> : m.t}</span>)}
            </h1>
            <p className="hero-texte">
              Des cours clairs, des quiz qui s'adaptent à ton niveau et une préparation sérieuse au BFEM et au Bac, construits sur le programme sénégalais.
            </p>
            <div className="hero-actions">
              <Link to="/inscription" className="btn btn-or btn-fleche">Commencer gratuitement <span className="rond-fleche"><Icone nom="fleche" taille={15} /></span></Link>
              <Link to="/cours" className="btn btn-contour">Explorer les cours</Link>
            </div>
            <div className="hero-points">
              <span><Icone nom="check" taille={16} /> Premier chapitre gratuit</span>
              <span><Icone nom="check" taille={16} /> Paiement Orange Money et Wave</span>
            </div>
          </div>

          {/* Aperçu du quiz adaptatif : le cœur du produit */}
          <div className="quiz-apercu" aria-label="Exemple de question de quiz">
            <div className="quiz-apercu-tete">
              <span>Question 3 sur 5</span>
              <span className="niveau" aria-label="Niveau moyen">
                Niveau <i className="on" /><i className="on" /><i className="monte" />
              </span>
            </div>
            <h3>Quelle est la dérivée de f(x) = x² + 3x ?</h3>
            <div className="quiz-choix">
              <div><b>A</b> x + 3</div>
              <div className="a-clic"><b>B</b> 2x + 3x</div>
              <div className="a-bon"><b>C</b> 2x + 3 <span className="xp-flottant">+10 XP</span></div>
            </div>
            <div className="quiz-apercu-pied">
              <span>Deux bonnes réponses d'affilée : tu passes au niveau <strong>difficile</strong>.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chiffres ──────────────────────────── */}
      <div className="bande-chiffres-zone">
        <Revele className="bande-chiffres">
          {CHIFFRES.map(c => (
            <div key={c.l}>
              <b><Compteur valeur={c.n} /></b>
              <span>{c.l}</span>
            </div>
          ))}
        </Revele>
      </div>

      {/* ── Matières ──────────────────────────── */}
      <section className="section">
        <div className="section-int">
          <Revele as="h2" className="titre-section">Tout le programme, expliqué clairement.</Revele>
          <p className="sous-titre-section">Cinq matières scientifiques, de la sixième à la licence.</p>
          <div className="matieres">
            {MATIERES.map(({ icone, classe, label, filtre, desc }, i) => (
              <Revele key={filtre} delai={i * 90}>
                <Link to={`/cours?matiere=${filtre}`} className={`mat-carte ${classe}`}>
                  <span className="mat-visuel"><Icone nom={icone} taille={44} /></span>
                  <span className="mat-legende">
                    <h3>{label}</h3>
                    <p>{desc}</p>
                  </span>
                  <span className="mat-fleche" aria-hidden="true"><Icone nom="fleche" taille={16} /></span>
                </Link>
              </Revele>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cours à la une (carrousel) ────────── */}
      <section className="section section-carrousel">
        <div className="section-int">
          <div className="carrousel-tete">
            <Revele as="h2" className="titre-section">Des cours pour chaque classe.</Revele>
            <div className="carrousel-fleches">
              <button type="button" onClick={() => defiler(-1)} aria-label="Cours précédents"><span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><Icone nom="fleche" taille={18} /></span></button>
              <button type="button" onClick={() => defiler(1)} aria-label="Cours suivants"><Icone nom="fleche" taille={18} /></button>
            </div>
          </div>
          <div className="carrousel" ref={piste} tabIndex={0} aria-label="Cours à la une">
            {A_LA_UNE.map(c => (
              <Link key={c.titre} to={`/cours?matiere=${c.matiere}`} className={`cours-une ${c.classe}`}>
                <span className="cours-une-visuel"><Icone nom={c.icone} taille={56} /><i>{c.niveau}</i></span>
                <span className="cours-une-corps">
                  <h3>{c.titre}</h3>
                  <p>{c.desc}</p>
                </span>
                <span className="mat-fleche" aria-hidden="true"><Icone nom="fleche" taille={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fonctionnement ────────────────────── */}
      <section className="section fond-sombre">
        <div className="section-int">
          <Revele as="h2" className="titre-section">Simple, régulier, motivant.</Revele>
          <div className="etapes-grille">
            <div>
              {ETAPES.map((e, i) => (
                <Revele className="etape" key={e.t} delai={i * 120}>
                  <div className="etape-num">{i + 1}</div>
                  <div><h3>{e.t}</h3><p>{e.d}</p></div>
                </Revele>
              ))}
            </div>
            <Revele className="panneau-xp" delai={150} aria-label="Exemple de points d'expérience">
              <span className="trophee"><Icone nom="trophee" taille={34} style={{ color: '#F2C777' }} /></span>
              <div className="gros" style={{ marginTop: 10 }}><Compteur valeur={1240} /></div>
              <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, marginTop: 4 }}>points d'expérience cette semaine (exemple)</div>
              <div className="ligne"><span><Icone nom="flamme" taille={18} /> Série de 12 jours</span><b>+50 XP</b></div>
              <div className="ligne"><span><Icone nom="cible" taille={18} /> Quiz sans faute</span><b>+100 XP</b></div>
              <div className="ligne"><span><Icone nom="livre" taille={18} /> Chapitre terminé</span><b>+80 XP</b></div>
            </Revele>
          </div>
        </div>
      </section>

      {/* ── Au-delà des cours ─────────────────── */}
      <section className="section">
        <div className="section-int">
          <Revele as="h2" className="titre-section">Un coup de pouce quand il le faut.</Revele>
          <p className="sous-titre-section">Quand un chapitre résiste, la plateforme te le dit et te propose la bonne aide.</p>
          <div className="fonctions">
            <Revele className="fonction brique" delai={0}>
              <div className="ico"><Icone nom="eleves" /></div>
              <h3>Profs particuliers vérifiés</h3>
              <p>Dès que tu bloques sur une matière, on te propose des profs de cette matière, en ligne ou à domicile.</p>
            </Revele>
            <Revele className="fonction" delai={120}>
              <div className="ico"><Icone nom="bouclier" /></div>
              <h3>Espace parent</h3>
              <p>Les parents suivent les résultats, les séries et les chapitres à reprendre de leurs enfants.</p>
            </Revele>
            <Revele className="fonction or" delai={240}>
              <div className="ico"><Icone nom="horloge" /></div>
              <h3>Révision express</h3>
              <p>À quelques jours d'un examen, un parcours court pour revoir l'essentiel du programme.</p>
            </Revele>
          </div>
        </div>
      </section>

      {/* ── Appel ─────────────────────────────── */}
      <section className="appel">
        <Revele as="h2">Ton prochain chapitre est gratuit.</Revele>
        <p>Crée ton compte en une minute et essaie un quiz adaptatif dès aujourd'hui.</p>
        <Link to="/inscription" className="btn btn-or">Créer mon compte</Link>
      </section>
    </div>
  )
}
