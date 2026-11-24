import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import Icone from '../components/Icones'
import { Revele } from '../components/Animations'

const MATIERES = ['MATHEMATIQUES','PHYSIQUE','CHIMIE','SCIENCES_VIE_TERRE','INFORMATIQUE']
const NIVEAUX  = ['COLLEGE','LYCEE','UNIVERSITE']
const LABEL_M  = { MATHEMATIQUES:'Mathématiques', PHYSIQUE:'Physique', CHIMIE:'Chimie', SCIENCES_VIE_TERRE:'SVT', INFORMATIQUE:'Informatique' }
const LABEL_N  = { COLLEGE:'Collège', LYCEE:'Lycée', UNIVERSITE:'Université' }
const STYLE_M  = {
  MATHEMATIQUES:      { classe: 'm-maths', icone: 'maths' },
  PHYSIQUE:           { classe: 'm-phys',  icone: 'physique' },
  CHIMIE:             { classe: 'm-chim',  icone: 'chimie' },
  SCIENCES_VIE_TERRE: { classe: 'm-svt',   icone: 'svt' },
  INFORMATIQUE:       { classe: 'm-info',  icone: 'info' },
}

export default function Cours() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cours, setCours] = useState([])
  const [chargement, setChargement] = useState(true)
  const matiere = searchParams.get('matiere') || ''
  const niveau  = searchParams.get('niveau')  || ''

  useEffect(() => {
    setChargement(true)
    api.get('/cours', { params: { matiere: matiere || undefined, niveau: niveau || undefined } })
      .then(r => setCours(r.data))
      .catch(() => setCours([]))
      .finally(() => setChargement(false))
  }, [matiere, niveau])

  const setFiltre = (k, v) => {
    const p = new URLSearchParams(searchParams)
    if (searchParams.get(k) === v) p.delete(k); else p.set(k, v)
    setSearchParams(p)
  }
  const aDesFiltres = Boolean(matiere || niveau)

  return (
    <div>
      <div className="entete-page">
        <div className="entete-page-int">
          <h1>Les cours</h1>
          <p>{chargement ? 'Chargement des cours…' : `${cours.length} cours disponible${cours.length > 1 ? 's' : ''}${aDesFiltres ? ' avec ces filtres' : ''}.`}</p>
        </div>
      </div>

      <div className="section-int" style={{ padding: '1.6rem 1.25rem 4rem' }}>
        <div className="filtres" role="group" aria-label="Filtrer les cours">
          {NIVEAUX.map(n => (
            <button key={n} className={`pastille${niveau === n ? ' active' : ''}`} aria-pressed={niveau === n} onClick={() => setFiltre('niveau', n)}>{LABEL_N[n]}</button>
          ))}
          <span className="filtres-sep" aria-hidden="true" />
          {MATIERES.map(m => (
            <button key={m} className={`pastille${matiere === m ? ' active' : ''}`} aria-pressed={matiere === m} onClick={() => setFiltre('matiere', m)}>{LABEL_M[m]}</button>
          ))}
          {aDesFiltres && <button className="pastille" onClick={() => setSearchParams({})}>Tout afficher</button>}
        </div>

        {chargement ? (
          <div className="cours-grille">{[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="cours-carte squelette" aria-hidden="true" />)}</div>
        ) : cours.length === 0 ? (
          <div className="vide">
            <Icone nom="livre" taille={38} />
            <h2>Aucun cours pour le moment</h2>
            <p>{aDesFiltres ? "Essaie d'autres filtres : un cours t'attend peut-être dans une autre matière." : 'Les premiers cours arrivent bientôt.'}</p>
            {aDesFiltres && <button className="btn btn-foret" onClick={() => setSearchParams({})}>Voir tous les cours</button>}
          </div>
        ) : (
          <div className="cours-grille">
            {cours.map((c, i) => {
              const st = STYLE_M[c.matiere] || STYLE_M.MATHEMATIQUES
              return (
                <Revele key={c.id} delai={Math.min(i, 8) * 60}>
                  <Link to={`/cours/${c.id}`} className="cours-carte">
                    <div className={`cours-haut ${st.classe}`}>
                      <span className="cours-ico"><Icone nom={st.icone} taille={22} /></span>
                      <span className="cours-matiere">{LABEL_M[c.matiere]}</span>
                      {c.premium && <span className="cours-premium"><Icone nom="etoile" taille={12} /> Premium</span>}
                    </div>
                    <div className="cours-corps">
                      <h3>{c.titre}</h3>
                      <p>{c.description}</p>
                      <div className="cours-meta">
                        <span>{LABEL_N[c.niveau]}</span>
                        {c.classe && <span>{c.classe}</span>}
                        <span>{c._count?.chapitres || 0} chapitre{(c._count?.chapitres || 0) > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </Link>
                </Revele>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
