import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../lib/api'

const MATIERES = ['MATHEMATIQUES','PHYSIQUE','CHIMIE','SCIENCES_VIE_TERRE','INFORMATIQUE']
const NIVEAUX  = ['COLLEGE','LYCEE','UNIVERSITE']
const LABEL_M  = { MATHEMATIQUES:'Mathématiques', PHYSIQUE:'Physique', CHIMIE:'Chimie', SCIENCES_VIE_TERRE:'SVT', INFORMATIQUE:'Informatique' }
const LABEL_N  = { COLLEGE:'Collège', LYCEE:'Lycée', UNIVERSITE:'Université' }

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
      .finally(() => setChargement(false))
  }, [matiere, niveau])

  const setFiltre = (k, v) => {
    const p = new URLSearchParams(searchParams)
    if (searchParams.get(k) === v) p.delete(k); else p.set(k, v)
    setSearchParams(p)
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: '400', marginBottom: '0.5rem' }}>Cours</h1>
      <p style={{ color: 'var(--texte-3)', marginBottom: '1.5rem', fontSize: '14px' }}>{cours.length} cours disponible{cours.length > 1 ? 's' : ''}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
        {NIVEAUX.map(n => (
          <button key={n} onClick={() => setFiltre('niveau', n)} style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '500', border: '1px solid', borderColor: niveau === n ? 'var(--foret)' : 'var(--bord)', background: niveau === n ? 'var(--foret)' : 'var(--blanc)', color: niveau === n ? '#fff' : 'var(--texte-2)', cursor: 'pointer' }}>{LABEL_N[n]}</button>
        ))}
        <div style={{ width: '1px', background: 'var(--bord)', margin: '0 4px' }} />
        {MATIERES.map(m => (
          <button key={m} onClick={() => setFiltre('matiere', m)} style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '500', border: '1px solid', borderColor: matiere === m ? 'var(--foret)' : 'var(--bord)', background: matiere === m ? 'var(--foret)' : 'var(--blanc)', color: matiere === m ? '#fff' : 'var(--texte-2)', cursor: 'pointer' }}>{LABEL_M[m]}</button>
        ))}
      </div>

      {chargement ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--texte-3)' }}>Chargement...</div>
      ) : cours.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--texte-3)' }}>Aucun cours pour ces filtres.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {cours.map(c => (
            <Link key={c.id} to={`/cours/${c.id}`} style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-lg)', padding: '1.5rem', textDecoration: 'none', display: 'block', boxShadow: 'var(--ombre-sm)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--foret)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--bord)' }}
            >
              <div style={{ fontWeight: '600', color: 'var(--texte)', marginBottom: '6px', fontSize: '15px' }}>{c.titre}</div>
              <div style={{ fontSize: '13px', color: 'var(--texte-2)', lineHeight: '1.5', marginBottom: '12px' }}>{c.description}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {c.premium && (
                  <span style={{ background: 'var(--or)', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '3px 9px', borderRadius: '999px', letterSpacing: '.5px' }}>⭐ PREMIUM</span>
                )}
                <span style={{ background: 'var(--foret-pale)', color: 'var(--foret)', fontSize: '11px', fontWeight: '600', padding: '3px 9px', borderRadius: '999px' }}>{LABEL_N[c.niveau]}</span>
                {c.classe && <span style={{ background: 'var(--sable)', color: 'var(--texte-3)', fontSize: '11px', padding: '3px 9px', borderRadius: '999px' }}>{c.classe}</span>}
                <span style={{ background: 'var(--sable)', color: 'var(--texte-3)', fontSize: '11px', padding: '3px 9px', borderRadius: '999px' }}>{c._count?.chapitres || 0} chapitre(s)</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
