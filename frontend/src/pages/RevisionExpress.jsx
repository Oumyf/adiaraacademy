import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Icone from '../components/Icones'

const DUREE_SECONDES = 5 * 60

function formatTemps(secondes) {
  const m = Math.floor(secondes / 60).toString().padStart(2, '0')
  const s = (secondes % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function RevisionExpress() {
  const { utilisateur } = useAuth()

  const [questions, setQuestions] = useState([])
  const [index, setIndex]         = useState(0)
  const [reponses, setReponses]   = useState({})
  const [termine, setTermine]     = useState(false)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur]       = useState(null)
  const [tempsRestant, setTempsRestant] = useState(DUREE_SECONDES)
  const [reponseSaisie, setReponseSaisie] = useState('')

  const timerRef = useRef(null)

  const chargerQuestions = () => {
    setChargement(true)
    setErreur(null)
    api.get('/quiz/revision-express')
      .then(r => setQuestions(r.data))
      .catch(() => setErreur('Impossible de charger les questions.'))
      .finally(() => setChargement(false))
  }

  const aAcces = utilisateur?.estPremium || ['ADMIN', 'PROFESSEUR'].includes(utilisateur?.role)

  useEffect(() => {
    if (!aAcces) return
    chargerQuestions()
  }, [utilisateur])

  useEffect(() => {
    if (chargement || questions.length === 0 || termine) return
    timerRef.current = setInterval(() => {
      setTempsRestant(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setTermine(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [chargement, questions.length, termine])

  const repondre = (valeur) => {
    const q = questions[index]
    setReponses(prev => ({ ...prev, [q.id]: valeur }))
    setReponseSaisie('')
    if (index + 1 >= questions.length) {
      clearInterval(timerRef.current)
      setTermine(true)
    } else {
      setIndex(i => i + 1)
    }
  }

  const recommencer = () => {
    clearInterval(timerRef.current)
    setReponses({})
    setIndex(0)
    setTermine(false)
    setTempsRestant(DUREE_SECONDES)
    chargerQuestions()
  }

  if (!aAcces) {
    return (
      <div className="etat-carte">
        <span className="etat-ico"><Icone nom="cadenas" taille={30} /></span>
        <h1>Révision express</h1>
        <p>Ce mode est réservé aux membres <strong>Premium</strong>. Dix questions au hasard, cinq minutes pour répondre : idéal pour réviser avant un devoir.</p>
        <div style={{ marginTop: '1.4rem', display: 'grid', gap: 12, justifyItems: 'center' }}>
          <Link to="/tarifs" className="btn btn-or">Passer à Premium</Link>
          <Link to="/cours" className="lien-doux">Retour aux cours gratuits</Link>
        </div>
      </div>
    )
  }

  if (chargement) return <div className="rev-page"><p>Chargement…</p></div>
  if (erreur)     return <div className="rev-page"><div className="ia-erreur" role="alert">{erreur}</div></div>

  if (questions.length === 0) return (
    <div className="etat-carte">
      <h1>Pas encore de questions</h1>
      <p>Aucune question n'est disponible pour le moment.</p>
      <div style={{ marginTop: '1.2rem' }}><Link to="/cours" className="btn btn-foret">Voir les cours</Link></div>
    </div>
  )

  if (termine) {
    const total = questions.length
    const scores = questions.map(q => {
      const rep = reponses[q.id]
      if (!rep) return false
      if (q.type === 'QCM' || q.type === 'VRAI_FAUX') {
        const bonne = q.options?.find?.(o => o.correct)?.texte
        return rep === bonne
      }
      return rep.trim().toLowerCase() === (q.reponseAttendue || '').trim().toLowerCase()
    })
    const nbBonnes = scores.filter(Boolean).length
    const reussi = nbBonnes >= total * 0.7

    return (
      <div className="rev-page">
        <div className="rev-bilan">
          <div className={`rev-score ${reussi ? 'ok' : 'ko'}`}>{nbBonnes}<small>/{total}</small></div>
          <h1>{reussi ? 'Très bon résultat' : 'Continue à réviser'}</h1>
          <p>{Math.round((nbBonnes / total) * 100)} % de bonnes réponses. Mode entraînement : cette série ne rapporte pas d'XP.</p>
          <div className="rev-actions">
            <button onClick={recommencer} className="btn btn-foret">Recommencer</button>
            <Link to="/cours" className="btn btn-doux">Retour aux cours</Link>
          </div>
        </div>

        <h2 className="rev-titre-liste">Correction</h2>
        <ul className="rev-liste">
          {questions.map((q, i) => {
            const correct = scores[i]
            const repDonnee = reponses[q.id]
            const bonneRep = q.type === 'REPONSE_LIBRE' ? q.reponseAttendue : q.options?.find?.(o => o.correct)?.texte
            const etat = correct ? 'ok' : repDonnee ? 'ko' : 'saute'
            return (
              <li key={q.id} className={`rev-ligne ${etat}`}>
                <span className="rev-ico"><Icone nom={correct ? 'check' : repDonnee ? 'croix' : 'fleche'} taille={16} /></span>
                <div>
                  <div className="rev-enonce">{q.enonce}</div>
                  <div className="rev-detail">
                    {repDonnee ? <>Ta réponse : <strong>{repDonnee}</strong></> : <>Non répondu</>}
                    {!correct && bonneRep && <> · Bonne réponse : <strong>{bonneRep}</strong></>}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const q = questions[index]
  const urgence = tempsRestant <= 60
  const choix = q.type === 'VRAI_FAUX' ? [{ texte: 'Vrai' }, { texte: 'Faux' }] : (q.options || [])

  return (
    <div className="rev-page">
      <div className="rev-haut">
        <div>
          <div className="rev-compte">Question {index + 1} sur {questions.length}</div>
          <div className="rev-barre" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={index}>
            <i style={{ width: `${(index / questions.length) * 100}%` }} />
          </div>
        </div>
        <div className={`rev-chrono ${urgence ? 'urgent' : ''}`} aria-label={`Temps restant ${formatTemps(tempsRestant)}`}>
          <Icone nom="horloge" taille={18} /> {formatTemps(tempsRestant)}
        </div>
      </div>

      <div className="rev-question">
        {q.quiz?.titre && <div className="rev-source">{q.quiz.titre}</div>}
        <p>{q.enonce}</p>
      </div>

      {(q.type === 'QCM' || q.type === 'VRAI_FAUX') && (
        <div className="rev-choix">
          {choix.map((opt, i) => (
            <button key={i} onClick={() => repondre(opt.texte)} className="rev-option">{opt.texte}</button>
          ))}
        </div>
      )}

      {q.type === 'REPONSE_LIBRE' && (
        <form onSubmit={e => { e.preventDefault(); if (reponseSaisie.trim()) repondre(reponseSaisie.trim()) }} className="rev-libre">
          <input type="text" value={reponseSaisie} onChange={e => setReponseSaisie(e.target.value)} placeholder="Ta réponse" autoFocus aria-label="Réponse" />
          <button type="submit" disabled={!reponseSaisie.trim()} className="btn btn-foret">Valider</button>
        </form>
      )}

      <button onClick={() => repondre(null)} className="lien-doux" style={{ marginTop: '1rem' }}>Passer cette question</button>
    </div>
  )
}
