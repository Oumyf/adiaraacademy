import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

function EcranVerrouille({ xpObtenu, cours, extrait }) {
  return (
    <div style={{ position: 'relative', borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--bord)', marginBottom: '2rem', boxShadow: 'var(--ombre-md)' }}>
      <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none', padding: '2rem', background: 'var(--blanc)', lineHeight: '1.8', fontSize: '15px', maxHeight: '280px', overflow: 'hidden', color: 'var(--texte)', whiteSpace: 'pre-wrap' }}>
        {extrait || 'Contenu réservé aux membres Premium.'}
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26,74,46,.82)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: '400', color: '#fff', marginBottom: '0.75rem' }}>Contenu Premium</h3>
        <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '14px', maxWidth: '320px', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          Ce chapitre fait partie du cours <strong style={{ color: '#fff' }}>{cours?.titre}</strong>, réservé aux membres Premium.
        </p>
        <Link to="/tarifs" style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--or)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
          Passer à Premium →
        </Link>
        <div style={{ marginTop: '12px', color: 'rgba(255,255,255,.4)', fontSize: '12px' }}>
          +{xpObtenu} XP vous attendent après les quiz
        </div>
      </div>
    </div>
  )
}

export default function ChapitreDetail() {
  const { id } = useParams()
  const { utilisateur } = useAuth()
  const [chapitre, setChapitre] = useState(null)
  const [chargement, setChargement] = useState(true)

  const estGestionnaire = utilisateur && (utilisateur.role === 'PROFESSEUR' || utilisateur.role === 'ADMIN')

  useEffect(() => {
    api.get(`/chapitres/${id}`).then(r => setChapitre(r.data)).finally(() => setChargement(false))
  }, [id])

  if (chargement) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--texte-3)' }}>Chargement...</div>
  if (!chapitre) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--erreur)' }}>Chapitre introuvable.</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link to={`/cours/${chapitre.cours?.id}`} style={{ fontSize: '13px', color: 'var(--texte-3)', display: 'inline-block', marginBottom: '1.5rem' }}>
        ← {chapitre.cours?.titre}
      </Link>

      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: '400', marginBottom: '0.5rem' }}>{chapitre.titre}</h1>
      <div style={{ fontSize: '13px', color: 'var(--texte-3)', marginBottom: '2rem' }}>+{chapitre.xpObtenu} XP après les quiz</div>

      {chapitre.verrouille && <EcranVerrouille xpObtenu={chapitre.xpObtenu} cours={chapitre.cours} extrait={chapitre.contenu} />}

      {!chapitre.verrouille && <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-lg)', padding: '2rem', boxShadow: 'var(--ombre-sm)', marginBottom: '2rem', lineHeight: '1.8', fontSize: '15px', color: 'var(--texte)' }} className="contenu-chapitre">
        <style>{`
          .contenu-chapitre h2 { font-family: var(--serif); font-size: 1.4rem; font-weight: 400; margin: 1.5rem 0 0.75rem; color: var(--foret); }
          .contenu-chapitre h3 { font-family: var(--serif); font-size: 1.15rem; font-weight: 400; margin: 1.25rem 0 0.5rem; color: var(--foret); }
          .contenu-chapitre p { margin-bottom: 1rem; }
          .contenu-chapitre ul, .contenu-chapitre ol { padding-left: 1.5rem; margin-bottom: 1rem; }
          .contenu-chapitre li { margin-bottom: 0.25rem; }
          .contenu-chapitre table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
          .contenu-chapitre th, .contenu-chapitre td { border: 1px solid var(--bord); padding: 8px 12px; text-align: left; font-size: 14px; }
          .contenu-chapitre th { background: var(--foret-pale); font-weight: 600; color: var(--foret); }
          .contenu-chapitre strong { font-weight: 600; }
          .contenu-chapitre code { background: var(--sable); padding: 2px 6px; border-radius: 4px; font-size: 13px; }
          .contenu-chapitre blockquote { border-left: 3px solid var(--foret); padding-left: 1rem; color: var(--texte-2); margin: 1rem 0; }
        `}</style>
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {chapitre.contenu}
        </ReactMarkdown>
      </div>}

      {/* Section quiz */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: '400', margin: 0 }}>
          Quiz de ce chapitre {chapitre.quiz?.length > 0 && `(${chapitre.quiz.length})`}
        </h2>
        {estGestionnaire && (
          <Link to={`/chapitres/${id}/creer-quiz`} style={{ padding: '7px 14px', background: 'var(--foret)', color: '#fff', borderRadius: 'var(--r-md)', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
            + Quiz
          </Link>
        )}
      </div>

      {chapitre.quiz?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-lg)', color: 'var(--texte-3)', fontSize: '14px' }}>
          Aucun quiz pour ce chapitre.
          {estGestionnaire && <> <Link to={`/chapitres/${id}/creer-quiz`} style={{ color: 'var(--foret)', fontWeight: '600' }}>Ajouter le premier</Link></>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chapitre.quiz.map(q => (
            <Link key={q.id} to={`/quiz/${q.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-lg)', textDecoration: 'none', boxShadow: 'var(--ombre-sm)', transition: 'all .15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--foret)'; e.currentTarget.style.background = 'var(--foret-pale)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bord)'; e.currentTarget.style.background = 'var(--blanc)' }}
            >
              <div>
                <div style={{ fontWeight: '600', color: 'var(--texte)', fontSize: '14px' }}>{q.titre}</div>
                <div style={{ fontSize: '12px', color: 'var(--texte-3)', marginTop: '3px' }}>
                  {q._count?.questions || 0} questions · {q.dureMin ? `${q.dureMin} min` : 'Sans limite'} · {q.xpMax} XP max
                </div>
              </div>
              <span style={{ background: 'var(--or)', color: '#fff', padding: '8px 18px', borderRadius: 'var(--r-sm)', fontSize: '13px', fontWeight: '600', flexShrink: 0 }}>Commencer →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
