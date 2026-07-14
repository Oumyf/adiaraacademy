import { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

const Md = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
    components={{ p: ({ children }) => <span>{children}</span> }}
  >
    {String(children ?? '')}
  </ReactMarkdown>
)

export default function QuizPage() {
  const { id } = useParams()
  const { mettreAJourUtilisateur, utilisateur } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [etape, setEtape] = useState('chargement')
  const [index, setIndex] = useState(0)
  const [reponses, setReponses] = useState({})
  const [repSelectionnee, setRepSelectionnee] = useState(null)
  const [resultat, setResultat] = useState(null)
  const [debut, setDebut] = useState(null)
  const [tempsRestant, setTempsRestant] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    api.get(`/quiz/${id}`)
      .then(r => {
        setQuiz(r.data)
        setEtape('quiz')
        const now = Date.now()
        setDebut(now)
        if (r.data.dureMin) {
          setTempsRestant(r.data.dureMin * 60)
        }
      })
      .catch(err => {
        if (err.response?.status === 403) setEtape('premium')
        else setEtape('erreur')
      })
  }, [id])

  // Compte à rebours
  useEffect(() => {
    if (etape !== 'quiz' || tempsRestant === null) return
    intervalRef.current = setInterval(() => {
      setTempsRestant(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          soumettreFinal(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [etape, tempsRestant !== null])

  const question = quiz?.questions[index]

  const soumettreFinal = async (timeout = false) => {
    clearInterval(intervalRef.current)
    const dureeSec = Math.round((Date.now() - debut) / 1000)
    const toutesReponses = timeout
      ? { ...reponses, ...(question ? { [question.id]: '' } : {}) }
      : reponses
    try {
      const r = await api.post(`/quiz/${id}/soumettre`, { reponses: toutesReponses, dureeSec })
      mettreAJourUtilisateur({ xpTotal: (utilisateur?.xpTotal || 0) + r.data.xpGagne })
      setResultat(r.data)
      setEtape('resultat')
    } catch {
      setEtape('erreur')
    }
  }

  const valider = () => {
    if (!repSelectionnee) return
    const toutesReponses = { ...reponses, [question.id]: repSelectionnee }
    setReponses(toutesReponses)
    if (index < quiz.questions.length - 1) {
      setIndex(i => i + 1)
      setRepSelectionnee(null)
    } else {
      clearInterval(intervalRef.current)
      const dureeSec = Math.round((Date.now() - debut) / 1000)
      api.post(`/quiz/${id}/soumettre`, { reponses: toutesReponses, dureeSec })
        .then(r => {
          mettreAJourUtilisateur({ xpTotal: (utilisateur?.xpTotal || 0) + r.data.xpGagne })
          setResultat(r.data)
          setEtape('resultat')
        })
        .catch(() => setEtape('erreur'))
    }
  }

  const recommencer = () => {
    clearInterval(intervalRef.current)
    setEtape('quiz')
    setIndex(0)
    setReponses({})
    setRepSelectionnee(null)
    setResultat(null)
    setDebut(Date.now())
    if (quiz?.dureMin) setTempsRestant(quiz.dureMin * 60)
  }

  const formaterTemps = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (etape === 'chargement') return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--texte-3)' }}>Chargement...</div>
  if (etape === 'erreur')    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--erreur)' }}>Erreur lors du chargement du quiz.</div>
  if (etape === 'premium')   return (
    <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: '400', marginBottom: '0.75rem' }}>Quiz Premium</h2>
      <p style={{ color: 'var(--texte-2)', fontSize: '14px', lineHeight: '1.7', marginBottom: '2rem' }}>
        Ce quiz fait partie d'un cours réservé aux membres <strong>Premium</strong>.
      </p>
      <Link to="/tarifs" style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--or)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
        Passer à Premium →
      </Link>
    </div>
  )

  /* ── Résultats ── */
  if (etape === 'resultat' && resultat) {
    const { score, xpGagne, bonnesReponses, totalQuestions, corrections, nouveauxBadges } = resultat
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Notification nouveaux badges */}
        {nouveauxBadges?.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, #1A4A2E, #2D6B44)', borderRadius: 'var(--r-xl)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--ombre-md)' }}>
            <span style={{ fontSize: '1.5rem' }}>🎉</span>
            <div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Badge{nouveauxBadges.length > 1 ? 's' : ''} débloqué{nouveauxBadges.length > 1 ? 's' : ''} !</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                {nouveauxBadges.map(b => (
                  <span key={b.id} style={{ background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: '12px', padding: '3px 10px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {b.icone} {b.nom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Score */}
        <div style={{ textAlign: 'center', background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '3rem 2rem', marginBottom: '2rem', boxShadow: 'var(--ombre-md)' }}>
          <div style={{ fontSize: '3.5rem', fontFamily: 'var(--serif)', color: score >= 50 ? 'var(--succes)' : 'var(--erreur)' }}>{score}%</div>
          <div style={{ fontSize: '15px', color: 'var(--texte-2)', margin: '8px 0' }}>{bonnesReponses} bonne(s) réponse(s) sur {totalQuestions}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--or-pale)', color: 'var(--or)', padding: '8px 20px', borderRadius: '999px', fontWeight: '700', fontSize: '15px', marginTop: '12px' }}>
            +{xpGagne} XP gagnés
          </div>
        </div>

        {/* Correction */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: '400', marginBottom: '1rem' }}>Correction</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {corrections.map((c, i) => (
            <div key={i} style={{ background: 'var(--blanc)', borderRadius: 'var(--r-lg)', padding: '1.25rem', border: `0.5px solid ${c.estCorrecte ? '#9AE6B4' : '#FEB2B2'}`, borderLeft: `4px solid ${c.estCorrecte ? 'var(--succes)' : 'var(--erreur)'}` }}>
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>
                {c.estCorrecte ? '✓ Correct' : '✗ Incorrect'} — <Md>{c.enonce}</Md>
              </div>
              {!c.estCorrecte && (
                <div style={{ fontSize: '13px', color: 'var(--erreur)', marginBottom: '4px' }}>
                  Ta réponse : <Md>{c.reponseDonnee || '(aucune)'}</Md>
                </div>
              )}
              <div style={{ fontSize: '13px', color: 'var(--succes)', fontWeight: '500' }}>
                Bonne réponse : <Md>{c.reponseCorrecte}</Md>
              </div>
              {c.explication && (
                <div style={{ fontSize: '13px', color: 'var(--texte-2)', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--bord)', lineHeight: '1.6' }}>
                  <Md>{c.explication}</Md>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '2rem', justifyContent: 'center' }}>
          <button onClick={recommencer} style={{ padding: '12px 24px', background: 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
            Recommencer
          </button>
          <Link to="/dashboard" style={{ padding: '12px 24px', background: 'var(--blanc)', border: '1px solid var(--bord)', color: 'var(--texte)', borderRadius: 'var(--r-md)', fontWeight: '500', fontSize: '14px', display: 'inline-block' }}>
            Mon tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  /* ── Quiz en cours ── */
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--texte-3)', marginBottom: '8px' }}>
          <span>{quiz.titre}</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {tempsRestant !== null && (
              <span style={{ fontWeight: '700', color: tempsRestant < 60 ? 'var(--erreur)' : tempsRestant < 120 ? 'var(--or)' : 'var(--texte-3)', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
                ⏱ {formaterTemps(tempsRestant)}
              </span>
            )}
            <span>Question {index + 1} / {quiz.questions.length}</span>
          </div>
        </div>
        <div style={{ height: '4px', background: 'var(--bord)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((index) / quiz.questions.length) * 100}%`, background: 'var(--foret)', borderRadius: '2px', transition: 'width .4s ease' }} />
        </div>
      </div>

      <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-md)' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: '400', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          <Md>{question?.enonce}</Md>
        </div>

        {/* VRAI / FAUX */}
        {quiz.type === 'VRAI_FAUX' && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
            {['Vrai', 'Faux'].map(opt => {
              const sel = repSelectionnee === opt
              return (
                <button key={opt} onClick={() => setRepSelectionnee(opt)} style={{ flex: 1, padding: '18px', border: `2px solid ${sel ? (opt === 'Vrai' ? 'var(--succes)' : 'var(--erreur)') : 'var(--bord)'}`, borderRadius: 'var(--r-lg)', background: sel ? (opt === 'Vrai' ? '#F0FFF4' : '#FFF5F5') : 'var(--blanc)', color: sel ? (opt === 'Vrai' ? 'var(--succes)' : 'var(--erreur)') : 'var(--texte)', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all .15s ease' }}>
                  {opt === 'Vrai' ? '✓ Vrai' : '✗ Faux'}
                </button>
              )
            })}
          </div>
        )}

        {/* QCM */}
        {quiz.type !== 'VRAI_FAUX' && question?.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
            {(Array.isArray(question.options) ? question.options : JSON.parse(question.options)).map(opt => (
              <button key={opt} onClick={() => setRepSelectionnee(opt)} style={{ padding: '12px 16px', textAlign: 'left', border: `2px solid ${repSelectionnee === opt ? 'var(--foret)' : 'var(--bord)'}`, borderRadius: 'var(--r-md)', background: repSelectionnee === opt ? 'var(--foret-pale)' : 'var(--blanc)', color: 'var(--texte)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all .15s ease' }}>
                <Md>{opt}</Md>
              </button>
            ))}
          </div>
        )}

        {/* Réponse libre */}
        {quiz.type === 'REPONSE_LIBRE' && (
          <textarea rows={3} placeholder="Ta réponse..." value={repSelectionnee || ''} onChange={e => setRepSelectionnee(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', resize: 'vertical', fontFamily: 'var(--sans)', marginBottom: '1.5rem', outline: 'none' }} />
        )}

        <button onClick={valider} disabled={!repSelectionnee} style={{ width: '100%', padding: '14px', background: repSelectionnee ? 'var(--foret)' : 'var(--bord)', color: repSelectionnee ? '#fff' : 'var(--texte-3)', border: 'none', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: '600', cursor: repSelectionnee ? 'pointer' : 'not-allowed', transition: 'all .15s ease' }}>
          {index < quiz.questions.length - 1 ? 'Valider →' : 'Terminer le quiz'}
        </button>
      </div>
    </div>
  )
}
