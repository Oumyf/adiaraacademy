import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Icone from '../components/Icones'
import { Revele } from '../components/Animations'

const LABEL_M = { MATHEMATIQUES: 'Maths', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Info' }
const STATUT = { TERMINE: ['ok', 'Terminé'], EN_COURS: ['cours', 'En cours'], NON_COMMENCE: ['non', 'Non commencé'] }

function CarteAlerte({ alerte }) {
  return (
    <div className="alerte-parent">
      <Icone nom="alerte" taille={22} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong>Difficultés en {alerte.label}</strong>
        <span>Score moyen de {alerte.scoreMoyen} % sur {alerte.nbTentatives} tentatives</span>
      </div>
      <Link to="/tuteurs" className="btn btn-doux" style={{ padding: '7px 14px', fontSize: 13 }}>Trouver un prof</Link>
    </div>
  )
}

function CarteEnfant({ enfant, delai }) {
  const [alertes, setAlertes] = useState([])
  useEffect(() => {
    api.get(`/parents/alertes/enfant/${enfant.id}`).then(r => setAlertes(r.data)).catch(() => {})
  }, [enfant.id])

  const termines = enfant.progressions?.filter(p => p.statut === 'TERMINE').length || 0
  const scoreMoyen = enfant.tentatives?.length ? Math.round(enfant.tentatives.reduce((s, t) => s + t.score, 0) / enfant.tentatives.length) : null

  return (
    <Revele delai={delai} className="carte-dash carte-enfant">
      <div className="enfant-tete">
        <span className="dash-avatar" style={{ width: 52, height: 52, fontSize: '1.25rem' }}>{enfant.prenom?.[0]}{enfant.nom?.[0]}</span>
        <div style={{ flex: 1, minWidth: 160 }}>
          <h2 style={{ margin: 0 }}>{enfant.prenom} {enfant.nom}</h2>
          <span className="ligne-dash-sous">{enfant.classe || enfant.niveau}{enfant.ecole ? ` · ${enfant.ecole}` : ''}</span>
        </div>
        <div className="enfant-xp">
          <b><Icone nom="etoile" taille={18} /> {enfant.xpTotal} XP</b>
          <span><Icone nom="flamme" taille={14} /> {enfant.streak} jour{enfant.streak > 1 ? 's' : ''} d'affilée</span>
        </div>
      </div>

      <div className="stat-rangee" style={{ gridTemplateColumns: 'repeat(3, 1fr)', margin: '1.2rem 0' }}>
        {[[termines, 'Chapitres terminés'], [scoreMoyen !== null ? `${scoreMoyen} %` : '—', 'Score moyen'], [enfant.badges?.length || 0, 'Badges']].map(([v, l]) => (
          <div key={l} className="mini-stat"><b>{v}</b><span>{l}</span></div>
        ))}
      </div>

      {alertes.length > 0 && (
        <div style={{ marginBottom: '1.2rem' }}>
          <h3 className="sous-titre-dash">Points à renforcer</h3>
          <div style={{ display: 'grid', gap: 8 }}>{alertes.map(a => <CarteAlerte key={a.matiere} alerte={a} />)}</div>
        </div>
      )}

      {enfant.progressions?.length > 0 && (
        <div>
          <h3 className="sous-titre-dash">Dernières activités</h3>
          <div className="liste-dash">
            {enfant.progressions.slice(0, 4).map(p => {
              const [cl, lab] = STATUT[p.statut] || STATUT.NON_COMMENCE
              return (
                <div key={p.id} className="ligne-dash sans-lien">
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="ligne-dash-titre">{p.chapitre?.titre}</span>
                    <span className="ligne-dash-sous">{p.chapitre?.cours?.titre} · {LABEL_M[p.chapitre?.cours?.matiere]}</span>
                  </span>
                  {p.score != null && <b className="ligne-dash-score">{p.score}%</b>}
                  <span className={`etat-pastille ${cl}`}>{lab}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {enfant.badges?.length > 0 && (
        <div style={{ marginTop: '1.2rem', paddingTop: '1.1rem', borderTop: '1px solid var(--bord)' }}>
          <h3 className="sous-titre-dash">Badges</h3>
          <div className="puces-dash" style={{ marginBottom: 0 }}>
            {enfant.badges.map(b => <span key={b.id} title={b.badge.description} style={{ background: 'var(--or-pale)', color: '#8A5E0B' }}>{b.badge.icone} {b.badge.nom}</span>)}
          </div>
        </div>
      )}
    </Revele>
  )
}

export default function ParentDashboard() {
  const { utilisateur } = useAuth()
  const [enfants, setEnfants] = useState([])
  const [chargement, setChargement] = useState(true)
  const [emailInput, setEmailInput] = useState('')
  const [lienMsg, setLienMsg] = useState(null)
  const [lienErr, setLienErr] = useState(null)
  const [lienChargement, setLienChargement] = useState(false)

  useEffect(() => {
    api.get('/parents/tableau-de-bord').then(r => setEnfants(r.data)).catch(() => {}).finally(() => setChargement(false))
  }, [])

  const lierEnfant = async e => {
    e.preventDefault()
    setLienMsg(null); setLienErr(null); setLienChargement(true)
    try {
      const r = await api.post('/parents/lier-enfant', { emailEnfant: emailInput })
      setLienMsg(r.data.message); setEmailInput('')
      const dashboard = await api.get('/parents/tableau-de-bord')
      setEnfants(dashboard.data)
    } catch (err) {
      setLienErr(err.response?.data?.message || "L'enfant n'a pas pu être ajouté. Vérifie l'adresse e-mail.")
    } finally { setLienChargement(false) }
  }

  if (chargement) return <div className="vide"><div className="squelette" style={{ width: 260, height: 18, borderRadius: 9 }} /></div>

  return (
    <div>
      <div className="entete-page">
        <div className="entete-page-int" style={{ maxWidth: 820 }}>
          <h1>Espace parent</h1>
          <p>Bonjour {utilisateur?.prenom}. Suis les progrès de tes enfants et repère où ils ont besoin d'aide.</p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '1.8rem 1.25rem 4rem', display: 'grid', gap: 18 }}>
        <section className="carte-dash">
          <h2>Ajouter un enfant</h2>
          <form onSubmit={lierEnfant} className="form-lier">
            <input type="email" placeholder="E-mail du compte de l'élève" value={emailInput} onChange={e => setEmailInput(e.target.value)} required aria-label="E-mail de l'élève" />
            <button type="submit" disabled={lienChargement} className="btn btn-foret">{lienChargement ? 'Ajout…' : 'Ajouter'}</button>
          </form>
          {lienMsg && <div className="ia-bulle" role="status" style={{ marginTop: 12 }}>{lienMsg}</div>}
          {lienErr && <div className="ia-erreur" role="alert" style={{ marginTop: 12 }}>{lienErr}</div>}
          <p className="ligne-dash-sous" style={{ marginTop: 10, lineHeight: 1.6 }}>Ton enfant doit déjà avoir un compte AdiaraAcademy. Utilise l'adresse e-mail avec laquelle il se connecte.</p>
        </section>

        {enfants.length === 0 ? (
          <div className="vide" style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 20 }}>
            <Icone nom="eleves" taille={36} />
            <h2>Aucun enfant ajouté</h2>
            <p>Ajoute le compte de ton enfant ci-dessus pour voir ses résultats.</p>
          </div>
        ) : enfants.map((e, i) => <CarteEnfant key={e.id} enfant={e} delai={i * 80} />)}
      </div>
    </div>
  )
}
