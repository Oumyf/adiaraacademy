import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Icone from '../components/Icones'

function EcranVerrouille({ xpObtenu, cours, extrait }) {
  return (
    <div className="verrou">
      <div className="verrou-flou">{extrait || 'Contenu réservé aux membres Premium.'}</div>
      <div className="verrou-voile">
        <span className="verrou-ico"><Icone nom="cadenas" taille={30} /></span>
        <h3>Contenu Premium</h3>
        <p>Ce chapitre fait partie du cours <strong>{cours?.titre}</strong>, réservé aux membres Premium.</p>
        <Link to="/tarifs" className="btn btn-or">Passer à Premium <Icone nom="fleche" taille={18} /></Link>
        <div className="verrou-note">+{xpObtenu} XP t'attendent après les quiz</div>
      </div>
    </div>
  )
}

export default function ChapitreDetail() {
  const { id } = useParams()
  const { utilisateur } = useAuth()
  const [chapitre, setChapitre] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [progression, setProgression] = useState(0)

  const estGestionnaire = utilisateur && (utilisateur.role === 'PROFESSEUR' || utilisateur.role === 'ADMIN')

  useEffect(() => {
    setChargement(true)
    api.get(`/chapitres/${id}`).then(r => setChapitre(r.data)).catch(() => setChapitre(null)).finally(() => setChargement(false))
  }, [id])

  // Barre de lecture en haut de l'écran
  useEffect(() => {
    const maj = () => {
      const h = document.documentElement
      const total = h.scrollHeight - h.clientHeight
      setProgression(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0)
    }
    window.addEventListener('scroll', maj, { passive: true }); maj()
    return () => window.removeEventListener('scroll', maj)
  }, [chapitre])

  if (chargement) return <div className="vide"><div className="squelette" style={{ width: 280, height: 18, borderRadius: 9 }} /></div>
  if (!chapitre) return (
    <div className="vide">
      <Icone nom="livre" taille={38} />
      <h2>Chapitre introuvable</h2>
      <Link to="/cours" className="btn btn-foret">Voir les cours</Link>
    </div>
  )

  const mots = (chapitre.contenu || '').split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(mots / 180))
  const nbQuiz = chapitre.quiz?.length || 0

  return (
    <div>
      <div className="lecture-barre" aria-hidden="true"><i style={{ width: `${progression}%` }} /></div>

      <div className="entete-page">
        <div className="entete-page-int" style={{ maxWidth: 780 }}>
          <Link to={`/cours/${chapitre.cours?.id}`} className="lien-retour"><Icone nom="retour" taille={16} /> {chapitre.cours?.titre}</Link>
          <h1>{chapitre.titre}</h1>
          <p style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
            {!chapitre.verrouille && <span className="puce-clair"><Icone nom="horloge" taille={14} /> {minutes} min de lecture</span>}
            <span className="puce-clair"><Icone nom="etoile" taille={14} /> +{chapitre.xpObtenu} XP après les quiz</span>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {chapitre.verrouille && <EcranVerrouille xpObtenu={chapitre.xpObtenu} cours={chapitre.cours} extrait={chapitre.contenu} />}

        {!chapitre.verrouille && (
          <article className="lecon contenu-chapitre">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{chapitre.contenu}</ReactMarkdown>
          </article>
        )}

        <section id="quiz" style={{ marginTop: '2.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: 12 }}>
            <h2 className="titre-liste">Teste-toi{nbQuiz > 0 ? ` (${nbQuiz} quiz)` : ''}</h2>
            {estGestionnaire && <Link to={`/chapitres/${id}/creer-quiz`} className="btn btn-foret" style={{ padding: '9px 16px', fontSize: 13.5 }}><Icone nom="plus" taille={16} /> Quiz</Link>}
          </div>

          {nbQuiz === 0 ? (
            <div className="vide" style={{ padding: '2rem 1rem' }}>
              <Icone nom="cible" taille={32} />
              <p style={{ margin: 0 }}>Aucun quiz pour ce chapitre.</p>
              {estGestionnaire && <Link to={`/chapitres/${id}/creer-quiz`} className="btn btn-foret">Ajouter le premier quiz</Link>}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {chapitre.quiz.map(q => (
                <Link key={q.id} to={`/quiz/${q.id}`} className="quiz-carte">
                  <span className="quiz-carte-ico"><Icone nom="cible" taille={22} /></span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="chapitre-titre">{q.titre}</span>
                    <span className="chapitre-info">{q._count?.questions || 0} questions · {q.dureMin ? `${q.dureMin} min` : 'sans limite de temps'} · jusqu'à {q.xpMax} XP</span>
                  </span>
                  <span className="btn btn-or" style={{ padding: '10px 18px', fontSize: 14 }}>Commencer</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
