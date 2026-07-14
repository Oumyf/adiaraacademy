import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

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
      <div style={{ maxWidth: '560px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: '400', marginBottom: '0.75rem' }}>Révision Express</h1>
        <p style={{ color: 'var(--texte-2)', fontSize: '14px', lineHeight: '1.7', marginBottom: '2rem' }}>
          Le mode Révision Express est réservé aux membres <strong>Premium</strong>.<br />
          10 questions aléatoires à traiter en 5 minutes — idéal pour réviser avant un devoir.
        </p>
        <Link to="/tarifs" style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--or)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
          Passer à Premium →
        </Link>
        <div style={{ marginTop: '1rem' }}>
          <Link to="/cours" style={{ fontSize: '13px', color: 'var(--texte-3)' }}>Retour aux cours gratuits</Link>
        </div>
      </div>
    )
  }

  if (chargement) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--texte-3)' }}>Chargement...</div>
  if (erreur)     return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--erreur)' }}>{erreur}</div>

  if (questions.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--texte-3)' }}>
      Aucune question disponible.{' '}
      <Link to="/cours" style={{ color: 'var(--foret)', fontWeight: '500' }}>Voir les cours</Link>
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

    return (
      <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '2rem 1.5rem' }}>
        <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2.5rem', textAlign: 'center', boxShadow: 'var(--ombre-md)', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '3.5rem', color: nbBonnes >= total * 0.7 ? 'var(--succes)' : 'var(--erreur)', marginBottom: '0.5rem' }}>
            {nbBonnes}/{total}
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: '400', marginBottom: '0.5rem' }}>
            {nbBonnes >= total * 0.7 ? 'Excellent travail !' : 'Continue à réviser !'}
          </div>
          <div style={{ color: 'var(--texte-3)', fontSize: '13px', marginBottom: '2rem' }}>
            {Math.round((nbBonnes / total) * 100)}% de bonnes réponses · Mode entraînement (pas d'XP)
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={recommencer} style={{ padding: '11px 24px', background: 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
              Recommencer
            </button>
            <Link to="/cours" style={{ padding: '11px 24px', background: 'var(--foret-pale)', color: 'var(--foret)', borderRadius: 'var(--r-md)', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
              Retour aux cours
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {questions.map((q, i) => {
            const correct = scores[i]
            const repDonnee = reponses[q.id]
            const bonneRep = q.type === 'REPONSE_LIBRE'
              ? q.reponseAttendue
              : q.options?.find?.(o => o.correct)?.texte
            return (
              <div key={q.id} style={{ background: 'var(--blanc)', border: `1px solid ${correct ? 'var(--succes)' : repDonnee ? 'var(--erreur)' : 'var(--bord)'}`, borderRadius: 'var(--r-lg)', padding: '1rem 1.25rem', boxShadow: 'var(--ombre-sm)' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{correct ? '✅' : repDonnee ? '❌' : '⏭️'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--texte)', marginBottom: '4px' }}>{q.enonce}</div>
                    <div style={{ fontSize: '12px', color: 'var(--texte-3)' }}>
                      {repDonnee
                        ? <><span>Votre réponse : </span><strong style={{ color: correct ? 'var(--succes)' : 'var(--erreur)' }}>{repDonnee}</strong></>
                        : <span>Non répondu</span>}
                      {!correct && bonneRep && <><span> · Bonne réponse : </span><strong style={{ color: 'var(--succes)' }}>{bonneRep}</strong></>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const q = questions[index]
  const urgence = tempsRestant <= 60

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', color: 'var(--texte-3)', fontWeight: '500' }}>
          Question {index + 1}/{questions.length}
        </div>
        <div style={{
          fontFamily: 'var(--serif)',
          fontSize: '1.5rem',
          fontWeight: '400',
          color: urgence ? 'var(--erreur)' : 'var(--foret)',
          padding: '6px 16px',
          background: urgence ? '#FEF2F2' : 'var(--foret-pale)',
          borderRadius: '999px',
          border: `2px solid ${urgence ? 'var(--erreur)' : 'var(--foret)'}`,
        }}>
          {formatTemps(tempsRestant)}
        </div>
      </div>

      <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-md)', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--texte-3)', letterSpacing: '.5px', marginBottom: '1rem' }}>
          {q.quiz?.titre?.toUpperCase()}
        </div>
        <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--texte)', lineHeight: '1.6', margin: 0 }}>{q.enonce}</p>
      </div>

      {(q.type === 'QCM' || q.type === 'VRAI_FAUX') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(q.type === 'VRAI_FAUX'
            ? [{ texte: 'Vrai' }, { texte: 'Faux' }]
            : (q.options || [])
          ).map((opt, i) => (
            <button key={i} onClick={() => repondre(opt.texte)}
              style={{ width: '100%', textAlign: 'left', padding: '14px 18px', background: 'var(--blanc)', border: '2px solid var(--bord)', borderRadius: 'var(--r-lg)', fontSize: '14px', fontWeight: '500', color: 'var(--texte)', cursor: 'pointer', transition: 'all .15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--foret)'; e.currentTarget.style.background = 'var(--foret-pale)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bord)'; e.currentTarget.style.background = 'var(--blanc)' }}
            >
              {opt.texte}
            </button>
          ))}
        </div>
      )}

      {q.type === 'REPONSE_LIBRE' && (
        <form onSubmit={e => { e.preventDefault(); if (reponseSaisie.trim()) repondre(reponseSaisie.trim()) }} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={reponseSaisie}
            onChange={e => setReponseSaisie(e.target.value)}
            placeholder="Votre réponse..."
            autoFocus
            aria-label="Réponse"
            style={{ flex: 1, padding: '12px 16px', border: '2px solid var(--bord)', borderRadius: 'var(--r-lg)', fontSize: '14px', color: 'var(--texte)', background: 'var(--blanc)', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'var(--foret)'}
            onBlur={e => e.target.style.borderColor = 'var(--bord)'}
          />
          <button type="submit" disabled={!reponseSaisie.trim()} style={{ padding: '12px 22px', background: 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-lg)', fontWeight: '700', fontSize: '14px', cursor: reponseSaisie.trim() ? 'pointer' : 'not-allowed', opacity: reponseSaisie.trim() ? 1 : 0.5 }}>
            →
          </button>
        </form>
      )}

      <button onClick={() => repondre(null)} style={{ marginTop: '1rem', background: 'none', border: 'none', fontSize: '13px', color: 'var(--texte-3)', cursor: 'pointer', padding: '4px' }}>
        Passer →
      </button>
    </div>
  )
}
