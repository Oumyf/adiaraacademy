// ═══════════════════════════════════════════════
// Cours.jsx — liste des cours avec filtres
// ═══════════════════════════════════════════════
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../lib/api'

const MATIERES = ['MATHEMATIQUES','PHYSIQUE','CHIMIE','SCIENCES_VIE_TERRE','INFORMATIQUE']
const NIVEAUX  = ['COLLEGE','LYCEE','UNIVERSITE']
const LABEL_M  = { MATHEMATIQUES:'Mathématiques', PHYSIQUE:'Physique', CHIMIE:'Chimie', SCIENCES_VIE_TERRE:'SVT', INFORMATIQUE:'Informatique' }
const LABEL_N  = { COLLEGE:'Collège', LYCEE:'Lycée', UNIVERSITE:'Université' }
const EMOJI_M  = { MATHEMATIQUES:'📐', PHYSIQUE:'⚗️', CHIMIE:'🧪', SCIENCES_VIE_TERRE:'🌿', INFORMATIQUE:'💻' }

export function Cours() {
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
    if (v) p.set(k, v); else p.delete(k)
    setSearchParams(p)
  }

  const btnFiltre = (k, v, label) => (
    <button key={v} onClick={() => setFiltre(k, searchParams.get(k) === v ? '' : v)}
      style={{
        padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '500',
        border: '1px solid',
        borderColor: searchParams.get(k) === v ? 'var(--foret)' : 'var(--bord)',
        background: searchParams.get(k) === v ? 'var(--foret)' : 'var(--blanc)',
        color: searchParams.get(k) === v ? '#fff' : 'var(--texte-2)',
        cursor: 'pointer', transition: 'var(--transition)'
      }}
    >{label}</button>
  )

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontFamily:'var(--serif)', fontSize:'2rem', fontWeight:'400', marginBottom:'0.5rem' }}>Cours</h1>
      <p style={{ color:'var(--texte-3)', marginBottom:'1.5rem', fontSize:'14px' }}>
        {cours.length} cours disponible{cours.length > 1 ? 's' : ''}
      </p>

      {/* Filtres */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'2rem' }}>
        {NIVEAUX.map(n => btnFiltre('niveau', n, LABEL_N[n]))}
        <div style={{ width:'1px', background:'var(--bord)', margin:'0 4px' }} />
        {MATIERES.map(m => btnFiltre('matiere', m, `${EMOJI_M[m]} ${LABEL_M[m]}`))}
      </div>

      {chargement ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--texte-3)' }}>Chargement…</div>
      ) : cours.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--texte-3)' }}>
          Aucun cours pour ces filtres.
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px' }}>
          {cours.map(c => (
            <Link key={c.id} to={`/cours/${c.id}`} style={{
              background:'var(--blanc)', border:'1px solid var(--bord)',
              borderRadius:'var(--r-lg)', padding:'1.5rem', textDecoration:'none',
              display:'block', boxShadow:'var(--ombre-sm)', transition:'var(--transition)'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--ombre-md)'; e.currentTarget.style.borderColor='var(--foret)' }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--ombre-sm)'; e.currentTarget.style.borderColor='var(--bord)' }}
            >
              <div style={{ fontSize:'2rem', marginBottom:'10px' }}>{EMOJI_M[c.matiere] || '📖'}</div>
              <div style={{ fontWeight:'600', color:'var(--texte)', marginBottom:'6px', fontSize:'15px' }}>{c.titre}</div>
              <div style={{ fontSize:'13px', color:'var(--texte-2)', lineHeight:'1.5', marginBottom:'12px' }}>{c.description}</div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                <span style={{ background:'var(--foret-pale)', color:'var(--foret)', fontSize:'11px', fontWeight:'600', padding:'3px 9px', borderRadius:'999px' }}>
                  {LABEL_N[c.niveau]}
                </span>
                {c.classe && <span style={{ background:'var(--sable)', color:'var(--texte-3)', fontSize:'11px', padding:'3px 9px', borderRadius:'999px' }}>{c.classe}</span>}
                <span style={{ background:'var(--sable)', color:'var(--texte-3)', fontSize:'11px', padding:'3px 9px', borderRadius:'999px' }}>
                  {c._count?.chapitres || 0} chapitre{c._count?.chapitres > 1 ? 's' : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════
// CoursDetail.jsx — chapitres d'un cours
// ═══════════════════════════════════════════════
export function CoursDetail() {
  const { id } = Object.fromEntries(new URLSearchParams(window.location.pathname.split('/').slice(-1)))
  // Utiliser useParams à la place
  const [cours, setCours] = useState(null)
  const [chargement, setChargement] = useState(true)

  // Récupérer l'id depuis l'URL
  const urlId = window.location.pathname.split('/cours/')[1]

  useEffect(() => {
    api.get(`/cours/${urlId}`)
      .then(r => setCours(r.data))
      .finally(() => setChargement(false))
  }, [urlId])

  if (chargement) return <div style={{ textAlign:'center', padding:'4rem', color:'var(--texte-3)' }}>Chargement…</div>
  if (!cours) return <div style={{ textAlign:'center', padding:'4rem', color:'var(--erreur)' }}>Cours introuvable.</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link to="/cours" style={{ fontSize:'13px', color:'var(--texte-3)', display:'inline-flex', alignItems:'center', gap:'4px', marginBottom:'1.5rem' }}>
        ← Retour aux cours
      </Link>
      <h1 style={{ fontFamily:'var(--serif)', fontSize:'2.2rem', fontWeight:'400', marginBottom:'0.75rem' }}>{cours.titre}</h1>
      <p style={{ color:'var(--texte-2)', fontSize:'15px', marginBottom:'2rem', lineHeight:'1.6' }}>{cours.description}</p>
      <div style={{ display:'flex', gap:'8px', marginBottom:'2rem' }}>
        <span style={{ background:'var(--foret-pale)', color:'var(--foret)', fontSize:'12px', fontWeight:'600', padding:'4px 10px', borderRadius:'999px' }}>
          {cours.niveau}
        </span>
        {cours.classe && <span style={{ background:'var(--sable)', color:'var(--texte-3)', fontSize:'12px', padding:'4px 10px', borderRadius:'999px' }}>{cours.classe}</span>}
      </div>

      <h2 style={{ fontFamily:'var(--serif)', fontSize:'1.4rem', fontWeight:'400', marginBottom:'1rem', color:'var(--texte)' }}>
        Chapitres ({cours.chapitres?.length})
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:'1px' }}>
        {cours.chapitres?.map((ch, i) => (
          <Link key={ch.id} to={`/chapitres/${ch.id}`} style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'1rem 1.25rem',
            background:'var(--blanc)', textDecoration:'none',
            borderRadius: i === 0 ? 'var(--r-lg) var(--r-lg) 0 0'
              : i === cours.chapitres.length-1 ? '0 0 var(--r-lg) var(--r-lg)' : '0',
            border:'1px solid var(--bord)',
            borderTop: i > 0 ? 'none' : '1px solid var(--bord)',
            transition:'var(--transition)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background='var(--foret-pale)'; e.currentTarget.style.borderLeftColor='var(--foret)' }}
          onMouseLeave={e => { e.currentTarget.style.background='var(--blanc)'; e.currentTarget.style.borderLeftColor='var(--bord)' }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ fontFamily:'var(--serif)', fontSize:'1.3rem', color:'var(--foret)', opacity:'.4', width:'32px', textAlign:'right' }}>
                {String(i+1).padStart(2,'0')}
              </span>
              <div>
                <div style={{ fontWeight:'500', color:'var(--texte)', fontSize:'14px' }}>{ch.titre}</div>
                <div style={{ fontSize:'12px', color:'var(--texte-3)', marginTop:'2px' }}>
                  {ch._count?.quiz || 0} quiz · +{ch.xpObtenu} XP
                </div>
              </div>
            </div>
            <span style={{ color:'var(--texte-3)', fontSize:'18px' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// ChapitreDetail.jsx — contenu avec LaTeX
// ═══════════════════════════════════════════════
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export function ChapitreDetail() {
  const urlId = window.location.pathname.split('/chapitres/')[1]
  const [chapitre, setChapitre] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    api.get(`/chapitres/${urlId}`)
      .then(r => setChapitre(r.data))
      .finally(() => setChargement(false))
  }, [urlId])

  if (chargement) return <div style={{ textAlign:'center', padding:'4rem', color:'var(--texte-3)' }}>Chargement…</div>
  if (!chapitre) return <div style={{ textAlign:'center', padding:'4rem', color:'var(--erreur)' }}>Chapitre introuvable.</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <Link to={`/cours/${chapitre.cours?.id || ''}`} style={{ fontSize:'13px', color:'var(--texte-3)', display:'inline-flex', alignItems:'center', gap:'4px', marginBottom:'1.5rem' }}>
        ← {chapitre.cours?.titre}
      </Link>

      <h1 style={{ fontFamily:'var(--serif)', fontSize:'2rem', fontWeight:'400', marginBottom:'0.5rem' }}>
        {chapitre.titre}
      </h1>
      <div style={{ fontSize:'13px', color:'var(--texte-3)', marginBottom:'2rem' }}>
        +{chapitre.xpObtenu} XP après les quiz
      </div>

      {/* Contenu Markdown + LaTeX */}
      <div style={{
        background:'var(--blanc)', border:'1px solid var(--bord)',
        borderRadius:'var(--r-lg)', padding:'2rem',
        boxShadow:'var(--ombre-sm)', marginBottom:'2rem',
        lineHeight:'1.8', fontSize:'15px', color:'var(--texte)'
      }} className="contenu-chapitre">
        <style>{`
          .contenu-chapitre h2 { font-family: var(--serif); font-size: 1.4rem; font-weight: 400; margin: 1.5rem 0 0.75rem; color: var(--foret); }
          .contenu-chapitre h3 { font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
          .contenu-chapitre p  { margin-bottom: 1rem; }
          .contenu-chapitre table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
          .contenu-chapitre th, .contenu-chapitre td { border: 1px solid var(--bord); padding: 8px 12px; text-align: left; font-size: 14px; }
          .contenu-chapitre th { background: var(--foret-pale); font-weight: 600; color: var(--foret); }
          .contenu-chapitre strong { font-weight: 600; color: var(--texte); }
        `}</style>
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {chapitre.contenu}
        </ReactMarkdown>
      </div>

      {/* Quiz associés */}
      {chapitre.quiz?.length > 0 && (
        <div>
          <h2 style={{ fontFamily:'var(--serif)', fontSize:'1.4rem', fontWeight:'400', marginBottom:'1rem' }}>
            Quiz de ce chapitre
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {chapitre.quiz.map(q => (
              <Link key={q.id} to={`/quiz/${q.id}`} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'1rem 1.25rem', background:'var(--blanc)',
                border:'1px solid var(--bord)', borderRadius:'var(--r-lg)',
                textDecoration:'none', transition:'var(--transition)',
                boxShadow:'var(--ombre-sm)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--foret)'; e.currentTarget.style.background='var(--foret-pale)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--bord)'; e.currentTarget.style.background='var(--blanc)' }}
              >
                <div>
                  <div style={{ fontWeight:'600', color:'var(--texte)', fontSize:'14px' }}>{q.titre}</div>
                  <div style={{ fontSize:'12px', color:'var(--texte-3)', marginTop:'3px' }}>
                    {q._count?.questions || 0} questions · {q.dureMin ? `${q.dureMin} min` : 'Sans limite'} · {q.xpMax} XP max
                  </div>
                </div>
                <span style={{
                  background:'var(--or)', color:'#fff',
                  padding:'8px 18px', borderRadius:'var(--r-sm)',
                  fontSize:'13px', fontWeight:'600', flexShrink:0
                }}>
                  Commencer →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════
// QuizPage.jsx — déroulement du quiz + résultats
// ═══════════════════════════════════════════════
export function QuizPage() {
  const urlId = window.location.pathname.split('/quiz/')[1]
  const [quiz, setQuiz] = useState(null)
  const [etape, setEtape] = useState('chargement') // chargement | quiz | resultat
  const [index, setIndex] = useState(0)
  const [reponses, setReponses] = useState({})
  const [repSelectionnee, setRepSelectionnee] = useState(null)
  const [resultat, setResultat] = useState(null)
  const [debut, setDebut] = useState(null)

  useEffect(() => {
    api.get(`/quiz/${urlId}`)
      .then(r => { setQuiz(r.data); setEtape('quiz'); setDebut(Date.now()) })
      .catch(() => setEtape('erreur'))
  }, [urlId])

  const question = quiz?.questions[index]

  const valider = () => {
    if (!repSelectionnee) return
    setReponses(r => ({ ...r, [question.id]: repSelectionnee }))
    if (index < quiz.questions.length - 1) {
      setIndex(i => i+1)
      setRepSelectionnee(null)
    } else {
      const toutesReponses = { ...reponses, [question.id]: repSelectionnee }
      const dureeSec = Math.round((Date.now() - debut) / 1000)
      api.post(`/quiz/${urlId}/soumettre`, { reponses: toutesReponses, dureeSec })
        .then(r => { setResultat(r.data); setEtape('resultat') })
        .catch(() => setEtape('erreur'))
    }
  }

  if (etape === 'chargement') return <div style={{ textAlign:'center', padding:'4rem', color:'var(--texte-3)' }}>Chargement…</div>
  if (etape === 'erreur')     return <div style={{ textAlign:'center', padding:'4rem', color:'var(--erreur)' }}>Erreur lors du chargement du quiz.</div>

  if (etape === 'resultat' && resultat) {
    const { score, xpGagne, bonnesReponses, totalQuestions, corrections } = resultat
    return (
      <div style={{ maxWidth:'700px', margin:'0 auto', padding:'2.5rem 1.5rem' }}>
        {/* Score */}
        <div style={{
          textAlign:'center', background:'var(--blanc)', border:'1px solid var(--bord)',
          borderRadius:'var(--r-xl)', padding:'3rem 2rem', marginBottom:'2rem',
          boxShadow:'var(--ombre-md)'
        }}>
          <div style={{ fontSize:'3.5rem', fontFamily:'var(--serif)', color: score >= 50 ? 'var(--foret)' : 'var(--erreur)' }}>
            {score}%
          </div>
          <div style={{ fontSize:'15px', color:'var(--texte-2)', margin:'8px 0' }}>
            {bonnesReponses} bonne{bonnesReponses > 1?'s':''} réponse{bonnesReponses>1?'s':''} sur {totalQuestions}
          </div>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'6px',
            background:'var(--or-pale)', color:'var(--or)',
            padding:'8px 20px', borderRadius:'999px',
            fontWeight:'700', fontSize:'15px', marginTop:'12px'
          }}>
            ⭐ +{xpGagne} XP gagnés
          </div>
        </div>

        {/* Corrections */}
        <h2 style={{ fontFamily:'var(--serif)', fontSize:'1.4rem', fontWeight:'400', marginBottom:'1rem' }}>Correction</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {corrections.map((c, i) => (
            <div key={i} style={{
              background:'var(--blanc)', border:`1px solid ${c.estCorrecte ? '#9AE6B4' : '#FEB2B2'}`,
              borderLeft:`4px solid ${c.estCorrecte ? 'var(--succes)' : 'var(--erreur)'}`,
              borderRadius:'var(--r-lg)', padding:'1.25rem'
            }}>
              <div style={{ fontWeight:'600', fontSize:'14px', marginBottom:'8px', color:'var(--texte)' }}>
                {c.estCorrecte ? '✅' : '❌'} {c.enonce}
              </div>
              {!c.estCorrecte && (
                <div style={{ fontSize:'13px', color:'var(--erreur)', marginBottom:'4px' }}>
                  Ta réponse : <strong>{c.reponseDonnee || '(aucune)'}</strong>
                </div>
              )}
              <div style={{ fontSize:'13px', color:'var(--succes)', fontWeight:'500' }}>
                Bonne réponse : {c.reponseCorrecte}
              </div>
              {c.explication && (
                <div style={{ fontSize:'13px', color:'var(--texte-2)', marginTop:'8px', paddingTop:'8px', borderTop:'1px solid var(--bord)', lineHeight:'1.6' }}>
                  {c.explication}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:'12px', marginTop:'2rem', justifyContent:'center' }}>
          <Link to={`/quiz/${urlId}`} onClick={() => { setEtape('quiz'); setIndex(0); setReponses({}); setRepSelectionnee(null); setResultat(null) }}
            style={{ padding:'12px 24px', background:'var(--foret)', color:'#fff', borderRadius:'var(--r-md)', fontWeight:'600', fontSize:'14px' }}>
            Recommencer
          </Link>
          <Link to="/dashboard" style={{ padding:'12px 24px', background:'var(--blanc)', border:'1px solid var(--bord)', color:'var(--texte)', borderRadius:'var(--r-md)', fontWeight:'500', fontSize:'14px' }}>
            Mon tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  // ── Déroulement du quiz ──
  const progression = ((index) / quiz.questions.length) * 100

  return (
    <div style={{ maxWidth:'700px', margin:'0 auto', padding:'2.5rem 1.5rem' }}>
      {/* Barre de progression */}
      <div style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', color:'var(--texte-3)', marginBottom:'8px' }}>
          <span>{quiz.titre}</span>
          <span>Question {index+1} / {quiz.questions.length}</span>
        </div>
        <div style={{ height:'4px', background:'var(--bord)', borderRadius:'2px', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progression}%`, background:'var(--foret)', borderRadius:'2px', transition:'width .4s ease' }} />
        </div>
      </div>

      {/* Question */}
      <div style={{
        background:'var(--blanc)', border:'1px solid var(--bord)',
        borderRadius:'var(--r-xl)', padding:'2rem', boxShadow:'var(--ombre-md)'
      }}>
        <div style={{ fontFamily:'var(--serif)', fontSize:'1.25rem', fontWeight:'400', marginBottom:'1.5rem', lineHeight:'1.5', color:'var(--texte)' }}>
          {question?.enonce}
        </div>

        {/* Options QCM */}
        {question?.options && (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'1.5rem' }}>
            {(Array.isArray(question.options) ? question.options : JSON.parse(question.options)).map(opt => (
              <button key={opt} onClick={() => setRepSelectionnee(opt)} style={{
                padding:'12px 16px', textAlign:'left',
                border:`2px solid ${repSelectionnee === opt ? 'var(--foret)' : 'var(--bord)'}`,
                borderRadius:'var(--r-md)',
                background: repSelectionnee === opt ? 'var(--foret-pale)' : 'var(--blanc)',
                color:'var(--texte)', fontSize:'14px', fontWeight:'500',
                cursor:'pointer', transition:'var(--transition)'
              }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Réponse libre */}
        {!question?.options && (
          <textarea
            rows={3} placeholder="Ta réponse…"
            value={repSelectionnee || ''}
            onChange={e => setRepSelectionnee(e.target.value)}
            style={{
              width:'100%', padding:'12px 14px', border:'1px solid var(--bord)',
              borderRadius:'var(--r-md)', fontSize:'14px', resize:'vertical',
              fontFamily:'var(--sans)', marginBottom:'1.5rem', outline:'none'
            }}
          />
        )}

        <button onClick={valider} disabled={!repSelectionnee} style={{
          width:'100%', padding:'14px',
          background: repSelectionnee ? 'var(--foret)' : 'var(--bord)',
          color:'#fff', border:'none', borderRadius:'var(--r-md)',
          fontSize:'15px', fontWeight:'600',
          cursor: repSelectionnee ? 'pointer' : 'not-allowed',
          transition:'var(--transition)'
        }}>
          {index < quiz.questions.length - 1 ? 'Valider →' : 'Terminer le quiz ✓'}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// Classement.jsx — top 20 par XP
// ═══════════════════════════════════════════════
export function Classement() {
  const [classement, setClassement] = useState([])
  const [chargement, setChargement] = useState(true)
  const { utilisateur } = Object.fromEntries([['utilisateur', null]])

  useEffect(() => {
    api.get('/utilisateurs/classement')
      .then(r => setClassement(r.data))
      .finally(() => setChargement(false))
  }, [])

  return (
    <div style={{ maxWidth:'700px', margin:'0 auto', padding:'2.5rem 1.5rem' }}>
      <h1 style={{ fontFamily:'var(--serif)', fontSize:'2rem', fontWeight:'400', marginBottom:'0.5rem' }}>🏆 Classement</h1>
      <p style={{ color:'var(--texte-3)', fontSize:'14px', marginBottom:'2rem' }}>Les élèves les plus assidus cette semaine</p>

      {chargement ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--texte-3)' }}>Chargement…</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1px' }}>
          {classement.map((u, i) => {
            const medaille = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
            return (
              <div key={u.id} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'14px 1.25rem',
                background: i < 3 ? 'var(--foret-pale)' : 'var(--blanc)',
                border:'1px solid var(--bord)',
                borderRadius: i === 0 ? 'var(--r-lg) var(--r-lg) 0 0'
                  : i === classement.length-1 ? '0 0 var(--r-lg) var(--r-lg)' : '0',
                borderTop: i > 0 ? 'none' : '1px solid var(--bord)'
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <span style={{ width:'28px', textAlign:'center', fontFamily:'var(--serif)', fontSize:'1rem', color: i < 3 ? 'var(--foret)' : 'var(--texte-3)' }}>
                    {medaille || `${u.rang}`}
                  </span>
                  <div style={{
                    width:'36px', height:'36px', borderRadius:'50%',
                    background:'var(--foret)', color:'#fff',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'13px', fontWeight:'600', flexShrink:0
                  }}>
                    {u.prenom?.[0]}{u.nom?.[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight:'600', fontSize:'14px', color:'var(--texte)' }}>
                      {u.prenom} {u.nom}
                    </div>
                    <div style={{ fontSize:'12px', color:'var(--texte-3)' }}>
                      {u.ecole || u.niveau} · 🔥 {u.streak} jours
                    </div>
                  </div>
                </div>
                <div style={{
                  background:'var(--or-pale)', color:'var(--or)',
                  fontSize:'13px', fontWeight:'700',
                  padding:'5px 14px', borderRadius:'999px'
                }}>
                  ⭐ {u.xpTotal} XP
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Cours
