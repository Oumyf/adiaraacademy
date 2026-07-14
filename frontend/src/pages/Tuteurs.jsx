import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../lib/api'

const MATIERES = ['MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE']
const LABEL_M  = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
const VILLES   = ['Dakar', 'Thiès', 'Saint-Louis', 'Mbour']

export default function Tuteurs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [profils, setProfils] = useState([])
  const [chargement, setChargement] = useState(true)

  const matiere = searchParams.get('matiere') || ''
  const ville   = searchParams.get('ville')   || ''

  useEffect(() => {
    setChargement(true)
    api.get('/professeurs', { params: { matiere: matiere || undefined, ville: ville || undefined } })
      .then(r => setProfils(r.data))
      .catch(() => setProfils([]))
      .finally(() => setChargement(false))
  }, [matiere, ville])

  const setFiltre = (k, v) => {
    const p = new URLSearchParams(searchParams)
    if (searchParams.get(k) === v) p.delete(k); else p.set(k, v)
    setSearchParams(p)
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: '400', marginBottom: '4px' }}>Profs particuliers</h1>
          <p style={{ color: 'var(--texte-3)', fontSize: '14px' }}>Des professeurs qualifiés, vérifiés par notre équipe.</p>
        </div>
        <Link to="/devenir-prof" style={{ padding: '10px 20px', background: 'var(--terre)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: '600', fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Devenir prof →
        </Link>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
        {MATIERES.map(m => (
          <button key={m} onClick={() => setFiltre('matiere', m)} style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '500', border: '1px solid', borderColor: matiere === m ? 'var(--foret)' : 'var(--bord)', background: matiere === m ? 'var(--foret)' : 'var(--blanc)', color: matiere === m ? '#fff' : 'var(--texte-2)', cursor: 'pointer' }}>
            {LABEL_M[m]}
          </button>
        ))}
        <div style={{ width: '1px', background: 'var(--bord)', margin: '0 4px' }} />
        {VILLES.map(v => (
          <button key={v} onClick={() => setFiltre('ville', v)} style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '500', border: '1px solid', borderColor: ville === v ? 'var(--terre)' : 'var(--bord)', background: ville === v ? 'var(--terre)' : 'var(--blanc)', color: ville === v ? '#fff' : 'var(--texte-2)', cursor: 'pointer' }}>
            {v}
          </button>
        ))}
      </div>

      {chargement ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--texte-3)' }}>Chargement...</div>
      ) : profils.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', color: 'var(--texte-3)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
          <div style={{ fontSize: '15px', marginBottom: '8px' }}>Aucun prof disponible pour ces critères.</div>
          <div style={{ fontSize: '13px' }}>
            Essayez d'autres filtres ou{' '}
            <Link to="/devenir-prof" style={{ color: 'var(--terre)', fontWeight: '600' }}>devenez prof</Link>.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {profils.map(p => (
            <Link key={p.id} to={`/tuteurs/${p.id}`} style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-lg)', padding: '1.5rem', textDecoration: 'none', display: 'block', boxShadow: 'var(--ombre-sm)', transition: 'all .15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--terre)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--bord)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--terre)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: '16px', flexShrink: 0 }}>
                  {p.utilisateur?.prenom?.[0]}{p.utilisateur?.nom?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--texte)' }}>{p.utilisateur?.prenom} {p.utilisateur?.nom}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    {p.verifie && <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--succes)', background: '#E6F4EC', padding: '2px 7px', borderRadius: '999px' }}>✓ Vérifié</span>}
                    {p.ville && <span style={{ fontSize: '11px', color: 'var(--texte-3)' }}>📍 {p.ville}</span>}
                  </div>
                </div>
              </div>

              {p.bio && <p style={{ fontSize: '13px', color: 'var(--texte-2)', lineHeight: '1.5', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.bio}</p>}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {p.matieres?.map(m => (
                  <span key={m} style={{ background: 'var(--sable)', color: 'var(--texte-2)', fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '999px' }}>{LABEL_M[m]}</span>
                ))}
              </div>

              {p.tarifHeure && (
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--terre)', fontWeight: '400' }}>
                  {p.tarifHeure.toLocaleString('fr-FR')} FCFA/h
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Note Phase 6 */}
      <div style={{ marginTop: '3rem', padding: '1.25rem 1.5rem', background: 'var(--sable)', borderRadius: 'var(--r-lg)', border: '1px solid var(--bord)', fontSize: '13px', color: 'var(--texte-3)', lineHeight: '1.6' }}>
        <strong style={{ color: 'var(--texte-2)' }}>Zones de lancement :</strong> Dakar, Thiès, Saint-Louis, Mbour.
        La réservation de séances et le paiement seront disponibles prochainement (Orange Money / Wave).
      </div>
    </div>
  )
}
