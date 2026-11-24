import { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Icone from '../components/Icones'

const Md = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
    components={{ p: ({ children }) => <span>{children}</span> }}
  >
    {String(children ?? '')}
  </ReactMarkdown>
)

const MdBloc = ({ children }) => (
  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
    {String(children ?? '')}
  </ReactMarkdown>
)

const norm = (s) => String(s ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const PHRASES_OK = ['Bravo !', 'Excellent !', 'Bien joué !', 'Exactement !', 'Super !', 'Tu as tout compris !']
const CONFETTIS = Array.from({ length: 16 }, (_, i) => ({
  x: Math.round(Math.cos((i / 16) * 6.283) * (70 + (i % 3) * 25)),
  y: Math.round(Math.sin((i / 16) * 6.283) * (50 + (i % 4) * 18)) - 20,
  c: ['#C8912A', '#2D6B44', '#A8533A', '#1F6670', '#F2C777'][i % 5],
  r: (i * 47) % 360,
}))

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
  const [retour, setRetour] = useState(null)          // correction immédiate de la question en cours
  const [verif, setVerif] = useState(false)
  const [erreurRep, setErreurRep] = useState(null)
  const [serie, setSerie] = useState(0)                // bonnes réponses d'affilée
  const [explicationIA, setExplicationIA] = useState(null)
  const [chargementIA, setChargementIA] = useState(false)
  const [erreurIA, setErreurIA] = useState(null)
  const [questionAdapt, setQuestionAdapt] = useState(null)   // quiz adaptatif : question en cours
  const [niveau, setNiveau] = useState('MOYEN')
  const [changement, setChangement] = useState(null)         // 'monte' | 'descend' | null
  const [historique, setHistorique] = useState([])           // [{ questionId, reponse }] dans l'ordre
  const [chargementSuivante, setChargementSuivante] = useState(false)
  const intervalRef = useRef(null)

  const NIVEAUX = ['FACILE', 'MOYEN', 'DIFFICILE']

  // Quiz adaptatif : le serveur choisit la question suivante selon l'historique.
  const chargerSuivante = async (hist) => {
    setChargementSuivante(true)
    try {
      const r = await api.post(`/quiz/${id}/suivante`, { historique: hist })
      return r.data
    } finally { setChargementSuivante(false) }
  }

  useEffect(() => {
    api.get(`/quiz/${id}`)
      .then(async r => {
        if (r.data.adaptatif) {
          const premiere = await chargerSuivante([])
          setQuestionAdapt(premiere.question)
          setNiveau(premiere.niveau)
        }
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

  const question = quiz?.adaptatif ? questionAdapt : quiz?.questions[index]
  const total = quiz?.totalQuestions ?? quiz?.questions?.length ?? 0

  const soumettreFinal = async (timeout = false) => {
    clearInterval(intervalRef.current)
    const dureeSec = Math.round((Date.now() - debut) / 1000)
    const toutesReponses = timeout
      ? { ...reponses, ...(question && !(question.id in reponses) ? { [question.id]: '' } : {}) }
      : reponses
    try {
      const r = await api.post(`/quiz/${id}/soumettre`, { reponses: toutesReponses, dureeSec })
      mettreAJourUtilisateur({ xpTotal: r.data.xpTotal, streak: r.data.streak })
      setResultat(r.data)
      setEtape('resultat')
    } catch {
      setEtape('erreur')
    }
  }

  const reinitialiserRetour = () => {
    setRetour(null); setErreurRep(null); setExplicationIA(null); setErreurIA(null); setChargementIA(false)
  }

  // 1) L'élève valide : on lui dit tout de suite si c'est juste ou faux.
  const valider = async () => {
    if (!repSelectionnee || verif || retour) return
    setVerif(true); setErreurRep(null)
    try {
      const r = await api.post(`/quiz/${id}/repondre`, { questionId: question.id, reponse: repSelectionnee })
      setReponses(prev => ({ ...prev, [question.id]: repSelectionnee }))
      setHistorique(h => [...h, { questionId: question.id, reponse: repSelectionnee }])
      setRetour({ ...r.data, choix: repSelectionnee })
      setSerie(s => (r.data.estCorrecte ? s + 1 : 0))
    } catch (err) {
      if (err.response?.status === 403) setEtape('premium')
      else setErreurRep("Impossible de vérifier ta réponse. Vérifie ta connexion puis réessaie.")
    } finally { setVerif(false) }
  }

  // 2) Il passe à la question suivante, ou termine le quiz.
  const terminer = () => {
    clearInterval(intervalRef.current)
    const dureeSec = Math.round((Date.now() - debut) / 1000)
    api.post(`/quiz/${id}/soumettre`, { reponses, dureeSec })
      .then(r => {
        mettreAJourUtilisateur({ xpTotal: r.data.xpTotal, streak: r.data.streak })
        setResultat(r.data)
        setEtape('resultat')
      })
      .catch(() => setEtape('erreur'))
  }

  const suivant = async () => {
    if (index >= total - 1) return terminer()
    if (quiz.adaptatif) {
      try {
        const r = await chargerSuivante(historique)
        if (r.fini) return terminer()
        const avant = NIVEAUX.indexOf(niveau), apres = NIVEAUX.indexOf(r.niveau)
        setChangement(apres > avant ? 'monte' : apres < avant ? 'descend' : null)
        setQuestionAdapt(r.question)
        setNiveau(r.niveau)
      } catch {
        setErreurRep("Impossible de charger la question suivante. Vérifie ta connexion puis réessaie.")
        return
      }
    }
    setIndex(i => i + 1)
    setRepSelectionnee(null)
    reinitialiserRetour()
  }

  // 3) En cas d'erreur, l'IA explique avec des mots simples.
  const expliquerIA = async () => {
    setChargementIA(true); setErreurIA(null)
    try {
      const r = await api.post(`/quiz/${id}/expliquer`, { questionId: question.id, reponse: retour.choix })
      setExplicationIA(r.data.explication)
    } catch (err) {
      setErreurIA(err.response?.data?.message || "L'assistant est indisponible pour le moment.")
    } finally { setChargementIA(false) }
  }

  const etatOption = (opt) => {
    if (!retour) return repSelectionnee === opt ? 'sel' : ''
    if (norm(opt) === norm(retour.reponseCorrecte)) return 'bon'
    if (opt === retour.choix) return 'mauvais'
    return 'autre'
  }

  const recommencer = () => {
    clearInterval(intervalRef.current)
    setEtape('quiz')
    setIndex(0)
    setReponses({})
    setRepSelectionnee(null)
    reinitialiserRetour()
    setSerie(0)
    setHistorique([])
    setChangement(null)
    if (quiz?.adaptatif) chargerSuivante([]).then(p => { setQuestionAdapt(p.question); setNiveau(p.niveau) })
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
            <Icone nom="trophee" taille={28} style={{ color: '#F2C777' }} />
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
        <div className="score-bloc">
          {score >= 70 && (
            <div className="confettis-grand" aria-hidden="true">
              {CONFETTIS.map((c, k) => <i key={k} style={{ '--x': `${c.x * 2.4}px`, '--y': `${c.y * 2.4}px`, '--r': `${c.r}deg`, background: c.c, animationDelay: `${(k % 5) * 60}ms` }} />)}
            </div>
          )}
          <div className="anneau" role="img" aria-label={`Score : ${score} pour cent`}>
            <svg viewBox="0 0 120 120" width="168" height="168">
              <circle className="fond" cx="60" cy="60" r="50" pathLength="100" />
              <circle className={`val${score < 50 ? ' bas' : ''}`} cx="60" cy="60" r="50" pathLength="100" style={{ '--reste': 100 - score }} />
            </svg>
            <div className="anneau-texte">{score}%</div>
          </div>
          <div className="score-titre">{score >= 80 ? 'Excellent travail !' : score >= 50 ? 'Bien joué, continue !' : 'Tu y es presque !'}</div>
          <div style={{ fontSize: '15px', color: 'var(--texte-2)', marginTop: 6 }}>
            {bonnesReponses} bonne{bonnesReponses > 1 ? 's' : ''} réponse{bonnesReponses > 1 ? 's' : ''} sur {totalQuestions}
            {score < 50 && ' : relis la correction ci-dessous, puis recommence.'}
          </div>
          <div className="xp-gagne"><Icone nom="etoile" taille={18} /> +{xpGagne} XP gagnés</div>
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
            {quiz.adaptatif && (
              <span className="niveau" aria-label={`Niveau ${niveau.toLowerCase()}`} title="Ton niveau s'adapte à tes réponses">
                {niveau === 'FACILE' ? 'Facile' : niveau === 'MOYEN' ? 'Moyen' : 'Difficile'}
                {NIVEAUX.map((n, k) => <i key={n} className={k <= NIVEAUX.indexOf(niveau) ? 'on' : ''} />)}
              </span>
            )}
            <span>Question {index + 1} / {total}</span>
          </div>
        </div>
        <div style={{ height: '4px', background: 'var(--bord)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((index + (retour ? 1 : 0)) / total) * 100}%`, background: 'var(--foret)', borderRadius: '2px', transition: 'width .4s ease' }} />
        </div>
      </div>

      <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-md)' }}>
        {quiz.adaptatif && changement && !retour && (
          <div className={`niveau-info ${changement}`} key={`n-${index}`} role="status">
            {changement === 'monte' ? 'Bien joué ! Le niveau monte : question plus difficile.' : 'Pas de souci : on revoit une base, la question est plus simple.'}
          </div>
        )}
        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: '400', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          <Md>{question?.enonce}</Md>
        </div>

        {/* VRAI / FAUX */}
        {quiz.type === 'VRAI_FAUX' && (
          <div className="opts opts-vf">
            {['Vrai', 'Faux'].map(opt => (
              <button key={opt} disabled={Boolean(retour)} onClick={() => setRepSelectionnee(opt)}
                className={`opt opt-grand ${etatOption(opt)}`}>
                <span className="opt-marque">{etatOption(opt) === 'bon' ? <Icone nom="check" taille={18} /> : etatOption(opt) === 'mauvais' ? <Icone nom="croix" taille={18} /> : null}</span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* QCM */}
        {quiz.type !== 'VRAI_FAUX' && question?.options && (
          <div className="opts">
            {(Array.isArray(question.options) ? question.options : JSON.parse(question.options)).map((opt, k) => (
              <button key={opt} disabled={Boolean(retour)} onClick={() => setRepSelectionnee(opt)} className={`opt ${etatOption(opt)}`}>
                <span className="opt-marque">
                  {etatOption(opt) === 'bon' ? <Icone nom="check" taille={16} /> : etatOption(opt) === 'mauvais' ? <Icone nom="croix" taille={16} /> : String.fromCharCode(65 + k)}
                </span>
                <span><Md>{opt}</Md></span>
              </button>
            ))}
          </div>
        )}

        {/* Réponse libre */}
        {quiz.type === 'REPONSE_LIBRE' && (
          <textarea rows={3} placeholder="Ta réponse..." value={repSelectionnee || ''} disabled={Boolean(retour)} onChange={e => setRepSelectionnee(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', resize: 'vertical', fontFamily: 'var(--sans)', marginBottom: '1.5rem', outline: 'none' }} />
        )}

        {/* Correction immédiate */}
        {retour && (
          <div className={`retour ${retour.estCorrecte ? 'ok' : 'ko'}`} role="status" aria-live="polite" key={`r-${index}`}>
            {retour.estCorrecte && (
              <div className="confettis" aria-hidden="true">
                {CONFETTIS.map((c, k) => <i key={k} style={{ '--x': `${c.x}px`, '--y': `${c.y}px`, '--r': `${c.r}deg`, background: c.c, animationDelay: `${(k % 4) * 30}ms` }} />)}
              </div>
            )}
            <div className="retour-titre">
              <span className="retour-ico"><Icone nom={retour.estCorrecte ? 'check' : 'croix'} taille={20} /></span>
              {retour.estCorrecte ? PHRASES_OK[index % PHRASES_OK.length] : 'Pas tout à fait'}
              {retour.estCorrecte && serie >= 2 && (
                <span className="retour-serie"><Icone nom="flamme" taille={15} /> {serie} d'affilée</span>
              )}
            </div>
            {!retour.estCorrecte && (
              <p className="retour-bonne">La bonne réponse est : <strong><Md>{retour.reponseCorrecte}</Md></strong></p>
            )}
            {retour.explication && <div className="retour-expl"><Md>{retour.explication}</Md></div>}

            {!retour.estCorrecte && retour.iaDisponible && !explicationIA && !chargementIA && (
              <button className="btn-ia" onClick={expliquerIA}>
                <Icone nom="etincelle" taille={16} /> Explique-moi avec l'IA
              </button>
            )}
            {chargementIA && <div className="ia-attente"><i /><i /><i /><span>Adiara réfléchit…</span></div>}
            {explicationIA && (
              <div className="ia-bulle">
                <div className="ia-nom"><Icone nom="etincelle" taille={15} /> Adiara, ton tuteur IA</div>
                <MdBloc>{explicationIA}</MdBloc>
              </div>
            )}
            {erreurIA && <div className="ia-erreur">{erreurIA}</div>}
          </div>
        )}

        {erreurRep && <div className="ia-erreur" role="alert" style={{ marginBottom: 12 }}>{erreurRep}</div>}

        {!retour ? (
          <button onClick={valider} disabled={!repSelectionnee || verif} className="btn-quiz">
            {verif ? 'Vérification…' : 'Valider ma réponse'}
          </button>
        ) : (
          <button onClick={suivant} disabled={chargementSuivante} className="btn-quiz actif">
            {index < total - 1 ? 'Question suivante' : 'Voir mon résultat'}
            <Icone nom="fleche" taille={18} />
          </button>
        )}
      </div>
    </div>
  )
}
