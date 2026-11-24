import { useEffect, useState } from 'react'
import api from '../lib/api'
import Icone from '../components/Icones'
import { Compteur, Revele } from '../components/Animations'

const LABEL_N = { COLLEGE: 'Collège', LYCEE: 'Lycée', UNIVERSITE: 'Université' }
const initiales = (u) => `${u.prenom?.[0] ?? ''}${u.nom?.[0] ?? ''}`.toUpperCase()

export default function Classement() {
  const [classement, setClassement] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    api.get('/utilisateurs/classement').then(r => setClassement(r.data)).catch(() => setClassement([])).finally(() => setChargement(false))
  }, [])

  const podium = classement.slice(0, 3)
  const reste = classement.slice(3)
  // Ordre d'affichage du podium : 2e, 1er, 3e
  const ordre = [podium[1], podium[0], podium[2]].map((u, k) => u && { u, rang: [2, 1, 3][k] })

  return (
    <div>
      <div className="entete-page">
        <div className="entete-page-int">
          <h1>Classement</h1>
          <p>Les élèves les plus assidus. Chaque quiz réussi et chaque jour de suite te font monter.</p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {chargement ? (
          <div className="carte squelette" style={{ height: 260 }} aria-hidden="true" />
        ) : classement.length === 0 ? (
          <div className="vide">
            <Icone nom="trophee" taille={38} />
            <h2>Le classement est vide</h2>
            <p>Réussis un quiz pour gagner tes premiers points et apparaître ici.</p>
          </div>
        ) : (
          <>
            <div className="podium">
              {ordre.map((o, k) => o && (
                <div key={o.u.id} className={`podium-col rang-${o.rang}`} style={{ '--d': `${k * 150}ms` }}>
                  <div className="podium-avatar">{initiales(o.u)}{o.rang === 1 && <span className="couronne"><Icone nom="trophee" taille={20} /></span>}</div>
                  <div className="podium-nom">{o.u.prenom} {o.u.nom?.[0]}.</div>
                  <div className="podium-xp"><Compteur valeur={o.u.xpTotal} duree={1100} /> XP</div>
                  <div className="podium-socle"><span>{o.rang}</span></div>
                </div>
              ))}
            </div>

            {reste.length > 0 && (
              <div className="liste-rang">
                {reste.map((u, i) => (
                  <Revele key={u.id} delai={Math.min(i, 6) * 50} className="rang-ligne">
                    <span className="rang-num">{u.rang ?? i + 4}</span>
                    <span className="rang-avatar">{initiales(u)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{u.prenom} {u.nom}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--texte-3)' }}>{u.ecole || LABEL_N[u.niveau]}{u.streak > 0 ? ` · ${u.streak} jour${u.streak > 1 ? 's' : ''} de suite` : ''}</div>
                    </div>
                    <span className="nav-xp" style={{ background: 'var(--or-pale)', color: 'var(--or)' }}>{u.xpTotal} XP</span>
                  </Revele>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
