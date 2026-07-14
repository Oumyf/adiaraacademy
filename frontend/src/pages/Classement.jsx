import { useEffect, useState } from 'react'
import api from '../lib/api'

const LABEL_N = { COLLEGE: 'College', LYCEE: 'Lycee', UNIVERSITE: 'Universite' }

export default function Classement() {
  const [classement, setClassement] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    api.get('/utilisateurs/classement').then(r => setClassement(r.data)).finally(() => setChargement(false))
  }, [])

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: '400', marginBottom: '0.5rem' }}>Classement</h1>
      <p style={{ color: 'var(--texte-3)', fontSize: '14px', marginBottom: '2rem' }}>Les eleves les plus assidus</p>
      {chargement ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--texte-3)' }}>Chargement...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {classement.map((u, i) => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 1.25rem', background: i < 3 ? 'var(--foret-pale)' : 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: i === 0 ? 'var(--r-lg) var(--r-lg) 0 0' : i === classement.length - 1 ? '0 0 var(--r-lg) var(--r-lg)' : '0', borderTop: i > 0 ? 'none' : '1px solid var(--bord)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ width: '28px', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: '1rem', color: i < 3 ? 'var(--foret)' : 'var(--texte-3)' }}>
                  {i === 0 ? '1er' : i === 1 ? '2e' : i === 2 ? '3e' : u.rang}
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--foret)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
                  {u.prenom?.[0]}{u.nom?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--texte)' }}>{u.prenom} {u.nom}</div>
                  <div style={{ fontSize: '12px', color: 'var(--texte-3)' }}>{u.ecole || LABEL_N[u.niveau]} · {u.streak} jour(s)</div>
                </div>
              </div>
              <div style={{ background: 'var(--or-pale)', color: 'var(--or)', fontSize: '13px', fontWeight: '700', padding: '5px 14px', borderRadius: '999px' }}>
                {u.xpTotal} XP
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
