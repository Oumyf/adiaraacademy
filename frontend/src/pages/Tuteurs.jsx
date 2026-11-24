import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import Icone from '../components/Icones'
import { Revele } from '../components/Animations'

const MATIERES = ['MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE']
const LABEL_M = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
const VILLES = ['Dakar', 'Thiès', 'Saint-Louis', 'Mbour']

export default function Tuteurs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [profils, setProfils] = useState([])
  const [chargement, setChargement] = useState(true)

  const matiere = searchParams.get('matiere') || ''
  const ville = searchParams.get('ville') || ''

  useEffect(() => {
    setChargement(true)
    api.get('/professeurs', { params: { matiere: matiere || undefined, ville: ville || undefined } })
      .then(r => setProfils(r.data)).catch(() => setProfils([])).finally(() => setChargement(false))
  }, [matiere, ville])

  const setFiltre = (k, v) => {
    const p = new URLSearchParams(searchParams)
    if (searchParams.get(k) === v) p.delete(k); else p.set(k, v)
    setSearchParams(p)
  }

  return (
    <div>
      <div className="entete-page">
        <div className="entete-page-int" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1>Profs particuliers</h1>
            <p>Des professeurs dont le profil est vérifié par notre équipe.</p>
          </div>
          <Link to="/devenir-prof" className="btn btn-or">Devenir prof</Link>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.6rem 1.25rem 4rem' }}>
        <div className="filtres-tuteurs" role="group" aria-label="Filtres">
          {MATIERES.map(m => <button key={m} onClick={() => setFiltre('matiere', m)} className={`pastille ${matiere === m ? 'active' : ''}`} aria-pressed={matiere === m}>{LABEL_M[m]}</button>)}
          <span className="filtres-sep" />
          {VILLES.map(v => <button key={v} onClick={() => setFiltre('ville', v)} className={`pastille ${ville === v ? 'active' : ''}`} aria-pressed={ville === v}>{v}</button>)}
        </div>

        {chargement ? (
          <div className="grille-tuteurs">{[0, 1, 2].map(i => <div key={i} className="squelette" style={{ height: 190, borderRadius: 20 }} />)}</div>
        ) : profils.length === 0 ? (
          <div className="vide" style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 20 }}>
            <Icone nom="eleves" taille={36} />
            <h2>Aucun prof pour ces critères</h2>
            <p>Essaie d'autres filtres, ou propose tes cours en <Link to="/devenir-prof" style={{ color: 'var(--brique)', fontWeight: 700 }}>devenant prof</Link>.</p>
          </div>
        ) : (
          <div className="grille-tuteurs">
            {profils.map((p, i) => (
              <Revele key={p.id} delai={Math.min(i, 8) * 60}>
                <Link to={`/tuteurs/${p.id}`} className="carte-tuteur">
                  <div className="tuteur-tete">
                    <span className="tuteur-avatar">{p.utilisateur?.prenom?.[0]}{p.utilisateur?.nom?.[0]}</span>
                    <div>
                      <strong>{p.utilisateur?.prenom} {p.utilisateur?.nom}</strong>
                      <span className="tuteur-meta">
                        {p.verifie && <span className="etat-pastille ok">Vérifié</span>}
                        {p.ville && <span><Icone nom="lieu" taille={13} /> {p.ville}</span>}
                      </span>
                    </div>
                  </div>
                  {p.bio && <p className="tuteur-bio">{p.bio}</p>}
                  <div className="puces-dash">{p.matieres?.map(m => <span key={m}>{LABEL_M[m]}</span>)}</div>
                  {p.tarifHeure && <div className="tuteur-prix">{p.tarifHeure.toLocaleString('fr-FR')} <small>FCFA par heure</small></div>}
                </Link>
              </Revele>
            ))}
          </div>
        )}

        <p className="note-bas">Zones de lancement : Dakar, Thiès, Saint-Louis et Mbour. La réservation et le paiement en ligne (Orange Money, Wave) arrivent bientôt.</p>
      </div>
    </div>
  )
}
