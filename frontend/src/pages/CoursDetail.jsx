import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Icone from '../components/Icones'
import { Revele } from '../components/Animations'

const LABEL_M = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
const LABEL_N = { COLLEGE: 'Collège', LYCEE: 'Lycée', UNIVERSITE: 'Université' }
const STYLE_M = { MATHEMATIQUES: 'm-maths', PHYSIQUE: 'm-phys', CHIMIE: 'm-chim', SCIENCES_VIE_TERRE: 'm-svt', INFORMATIQUE: 'm-info' }

export default function CoursDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { utilisateur } = useAuth()
  const [cours, setCours] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [publication, setPublication] = useState(false)
  const [confirmerSupp, setConfirmerSupp] = useState(false)
  const [suppressionEnCours, setSuppressionEnCours] = useState(false)
  const [erreurSupp, setErreurSupp] = useState('')

  const estGestionnaire = utilisateur && (utilisateur.role === 'PROFESSEUR' || utilisateur.role === 'ADMIN')

  useEffect(() => {
    api.get(`/cours/${id}`).then(r => setCours(r.data)).catch(() => setCours(null)).finally(() => setChargement(false))
  }, [id])

  const basculerPublication = async () => {
    setPublication(true)
    try {
      const { data } = await api.patch(`/cours/${id}/publier`)
      setCours(c => ({ ...c, publie: data.publie }))
    } finally { setPublication(false) }
  }

  const supprimerCours = async () => {
    setSuppressionEnCours(true); setErreurSupp('')
    try { await api.delete(`/cours/${id}`); navigate('/cours') }
    catch { setErreurSupp('La suppression a échoué. Réessaie.'); setSuppressionEnCours(false) }
  }

  if (chargement) return <div className="vide"><div className="squelette" style={{ width: 280, height: 18, borderRadius: 9 }} /></div>
  if (!cours) return (
    <div className="vide">
      <Icone nom="livre" taille={38} />
      <h2>Cours introuvable</h2>
      <p>Ce cours n'existe pas ou n'est pas encore publié.</p>
      <Link to="/cours" className="btn btn-foret">Voir tous les cours</Link>
    </div>
  )

  const nbChap = cours.chapitres?.length ?? 0
  const xpTotal = (cours.chapitres || []).reduce((t, c) => t + (c.xpObtenu || 0), 0)

  return (
    <div>
      <div className={`cours-entete ${STYLE_M[cours.matiere] || 'm-maths'}`}>
        <div className="cours-entete-int">
          <Link to="/cours" className="lien-retour"><Icone nom="retour" taille={16} /> Tous les cours</Link>
          <h1>{cours.titre}</h1>
          {cours.description && <p>{cours.description}</p>}
          <div className="cours-entete-meta">
            <span>{LABEL_M[cours.matiere]}</span>
            <span>{LABEL_N[cours.niveau]}</span>
            {cours.classe && <span>{cours.classe}</span>}
            <span>{nbChap} chapitre{nbChap > 1 ? 's' : ''}</span>
            {xpTotal > 0 && <span>jusqu'à {xpTotal} XP</span>}
            {cours.premium && <span className="meta-premium"><Icone nom="etoile" taille={12} /> Premium</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '1.8rem 1.25rem 4rem' }}>
        {estGestionnaire && !cours.publie && (
          <div className="bandeau-brouillon" role="status">
            <Icone nom="alerte" taille={20} />
            <span><strong>Brouillon.</strong> Seuls toi et les administrateurs voient ce cours. Relis chaque chapitre avant de le publier.</span>
            <button className="btn btn-foret" style={{ padding: '9px 18px', fontSize: 13.5 }} onClick={basculerPublication} disabled={publication}>
              {publication ? 'Publication…' : 'Publier le cours'}
            </button>
          </div>
        )}

        {estGestionnaire && (
          <div className="actions-gestion">
            <Link to={`/cours/${id}/modifier`} className="btn btn-doux"><Icone nom="crayon" taille={16} /> Modifier</Link>
            {cours.publie && <button className="btn btn-doux" onClick={basculerPublication} disabled={publication}>{publication ? '…' : 'Dépublier'}</button>}
            {confirmerSupp ? (
              <span className="confirmer-supp">
                <span>Supprimer ce cours ?</span>
                <button className="btn btn-doux" onClick={() => { setConfirmerSupp(false); setErreurSupp('') }}>Annuler</button>
                <button className="btn btn-danger" onClick={supprimerCours} disabled={suppressionEnCours}>{suppressionEnCours ? '…' : 'Oui, supprimer'}</button>
              </span>
            ) : (
              <button className="btn btn-doux texte-danger" onClick={() => setConfirmerSupp(true)}>Supprimer</button>
            )}
          </div>
        )}
        {erreurSupp && <div className="ia-erreur" role="alert" style={{ marginBottom: 14 }}>{erreurSupp}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.4rem 0 1rem', gap: 12 }}>
          <h2 className="titre-liste">Au programme</h2>
          {estGestionnaire && <Link to={`/cours/${id}/creer-chapitre`} className="btn btn-foret" style={{ padding: '9px 16px', fontSize: 13.5 }}><Icone nom="plus" taille={16} /> Chapitre</Link>}
        </div>

        {nbChap === 0 && (
          <div className="vide" style={{ padding: '2.5rem 1rem' }}>
            <Icone nom="livre" taille={34} />
            <h2>Aucun chapitre pour l'instant</h2>
            {estGestionnaire && <p>Ajoute le premier chapitre pour que les élèves puissent commencer.</p>}
          </div>
        )}

        <div className="chapitres-liste">
          {cours.chapitres?.map((ch, i) => (
            <Revele key={ch.id} delai={Math.min(i, 8) * 60} className="chapitre-ligne">
              <Link to={`/chapitres/${ch.id}`} className="chapitre-lien">
                <span className="chapitre-num">{i + 1}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="chapitre-titre">{ch.titre}</span>
                  <span className="chapitre-info">{ch._count?.quiz || 0} quiz · +{ch.xpObtenu} XP</span>
                </span>
                <Icone nom="fleche" taille={18} className="chapitre-fleche" />
              </Link>
              {estGestionnaire && (
                <div className="chapitre-actions">
                  <Link to={`/chapitres/${ch.id}/modifier`} aria-label={`Modifier le chapitre ${i + 1}`} title="Modifier"><Icone nom="crayon" taille={16} /></Link>
                  <Link to={`/chapitres/${ch.id}/creer-quiz`} title="Ajouter un quiz"><Icone nom="plus" taille={14} /> Quiz</Link>
                </div>
              )}
            </Revele>
          ))}
        </div>
      </div>
    </div>
  )
}
