import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Icone from '../components/Icones'
import { Revele, Compteur } from '../components/Animations'

const LABEL_MATIERE = { MATHEMATIQUES: 'Maths', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Info' }
const LABEL_MATIERE_LONG = { MATHEMATIQUES: 'Mathématiques', PHYSIQUE: 'Physique', CHIMIE: 'Chimie', SCIENCES_VIE_TERRE: 'SVT', INFORMATIQUE: 'Informatique' }
const STATUTS = {
  TERMINE:      { classe: 'ok',   label: 'Terminé' },
  EN_COURS:     { classe: 'cours', label: 'En cours' },
  NON_COMMENCE: { classe: 'non',  label: 'Non commencé' },
}

function Stat({ icone, valeur, unite, label, delai = 0 }) {
  return (
    <Revele delai={delai} className="stat-tuile">
      <span className="stat-ico"><Icone nom={icone} taille={20} /></span>
      <span className="stat-val">{typeof valeur === 'number' ? <Compteur valeur={valeur} /> : valeur}{unite && <small>{unite}</small>}</span>
      <span className="stat-lib">{label}</span>
    </Revele>
  )
}

function Bandeau({ profil, sous, children }) {
  return (
    <div className="dash-bandeau">
      <div className="dash-bandeau-int">
        <span className="dash-avatar">{profil.prenom?.[0]}{profil.nom?.[0]}</span>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h1>Bonjour, {profil.prenom}</h1>
          <p>{sous}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

function DashboardProf({ profil, mesCours, profilProf }) {
  const nbCours = mesCours?.length ?? 0
  const nbChapitres = mesCours?.reduce((s, c) => s + (c._count?.chapitres || 0), 0) ?? 0
  const nbPublies = mesCours?.filter(c => c.publie).length ?? 0

  return (
    <div>
      <Bandeau profil={profil} sous={
        <>Professeur{profilProf && <span className={`etat-pastille ${profilProf.verifie ? 'ok' : 'cours'}`}>{profilProf.verifie ? 'Profil vérifié' : 'Vérification en attente'}</span>}</>
      }>
        <Link to="/ambassadeur" className="btn btn-doux"><Icone nom="eleves" taille={18} /> Mon code ambassadeur</Link>
        <Link to="/generer-cours" className="btn btn-or"><Icone nom="etincelle" taille={18} /> Cours par IA</Link>
      </Bandeau>

      <div className="dash-corps">
        <div className="stats-grille stat-rangee">
          <Stat icone="livre" valeur={nbCours} label="Cours créés" />
          <Stat icone="check" valeur={nbPublies} label="Cours publiés" delai={60} />
          <Stat icone="cible" valeur={nbChapitres} label="Chapitres" delai={120} />
          {profilProf?.tarifHeure && <Stat icone="etoile" valeur={profilProf.tarifHeure.toLocaleString('fr-FR')} unite=" FCFA/h" label="Mon tarif" delai={180} />}
        </div>

        {!profilProf && (
          <div className="promo-bandeau promo-prof">
            <div>
              <strong>Donne des cours particuliers</strong>
              <span>Tu gardes 90 % des revenus. Zones de lancement : Dakar, Thiès, Saint-Louis, Mbour.</span>
            </div>
            <Link to="/devenir-prof" className="btn btn-or">Créer mon profil</Link>
          </div>
        )}

        <div className="dashboard-grille">
          <section className="carte-dash">
            <div className="carte-dash-tete">
              <h2>Mes cours</h2>
              <Link to="/creer-cours" className="btn btn-foret" style={{ padding: '8px 16px', fontSize: 13.5 }}><Icone nom="plus" taille={16} /> Nouveau</Link>
            </div>
            {mesCours === null ? (
              <div style={{ display: 'grid', gap: 8 }}>{[0, 1, 2].map(i => <div key={i} className="squelette" style={{ height: 58, borderRadius: 14 }} />)}</div>
            ) : mesCours.length === 0 ? (
              <div className="vide" style={{ padding: '2rem 1rem' }}>
                <Icone nom="livre" taille={32} />
                <p style={{ margin: 0 }}>Tu n'as pas encore de cours.</p>
                <Link to="/creer-cours" className="btn btn-foret">Créer mon premier cours</Link>
              </div>
            ) : (
              <div className="liste-dash">
                {mesCours.map(c => (
                  <Link key={c.id} to={`/cours/${c.id}`} className="ligne-dash">
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span className="ligne-dash-titre">{c.titre}</span>
                      <span className="ligne-dash-sous">{LABEL_MATIERE[c.matiere] || c.matiere} · {c._count.chapitres} chapitre{c._count.chapitres > 1 ? 's' : ''}</span>
                    </span>
                    <span className={`etat-pastille ${c.publie ? 'ok' : 'cours'}`}>{c.publie ? 'Publié' : 'Brouillon'}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <aside style={{ display: 'grid', gap: 18 }}>
            {profilProf && (
              <section className="carte-dash">
                <h2>Mon profil tuteur</h2>
                <div className="puces-dash">{profilProf.matieres?.map(m => <span key={m}>{LABEL_MATIERE_LONG[m]}</span>)}</div>
                {profilProf.ville && <p className="ligne-dash-sous" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icone nom="lieu" taille={14} /> {profilProf.ville}</p>}
                <div className="liens-dash">
                  <Link to="/tuteurs">Voir ma fiche publique</Link>
                  <Link to="/devenir-prof">Modifier mon profil</Link>
                </div>
              </section>
            )}
            <section className="carte-dash">
              <h2>Raccourcis</h2>
              <div className="liens-dash">
                <Link to="/creer-cours">Créer un cours</Link>
                <Link to="/generer-cours">Générer un cours par IA</Link>
                <Link to="/cours">Voir tous les cours</Link>
                <Link to="/classement">Classement des élèves</Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { utilisateur } = useAuth()
  const [data, setData] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const [mesCours, setMesCours] = useState(null)
  const [profilProf, setProfilProf] = useState(null)

  const estProf = utilisateur?.role === 'PROFESSEUR' || utilisateur?.role === 'ADMIN'

  useEffect(() => {
    api.get('/progression/moi').then(r => setData(r.data)).catch(() => setErreur('Impossible de charger ton tableau de bord. Vérifie ta connexion et recharge la page.')).finally(() => setChargement(false))
  }, [])

  useEffect(() => {
    if (estProf) {
      api.get('/cours/mes-cours').then(r => setMesCours(r.data)).catch(() => setMesCours([]))
      api.get('/professeurs/ma-candidature').then(r => setProfilProf(r.data)).catch(() => {})
    }
  }, [estProf])

  if (chargement) return <div className="vide"><div className="squelette" style={{ width: 260, height: 18, borderRadius: 9 }} /></div>
  if (erreur) return <div className="vide"><Icone nom="alerte" taille={34} /><p>{erreur}</p></div>

  const { profil, stats, progressions, dernieresTentatives, badges } = data
  if (estProf) return <DashboardProf profil={profil} mesCours={mesCours} profilProf={profilProf} />

  const niveau = Math.floor((profil.xpTotal || 0) / 100) + 1
  const xpNiveau = (profil.xpTotal || 0) % 100
  const pctChap = stats.totalChapitres ? Math.round((stats.chapitresTermines / stats.totalChapitres) * 100) : 0

  return (
    <div>
      <Bandeau profil={profil} sous={`${profil.classe || profil.niveau || 'Élève'} · niveau ${niveau}`}>
        <div className="dash-serie" title="Jours d'affilée avec au moins un quiz">
          <Icone nom="flamme" taille={26} />
          <span><b>{profil.streak || 0}</b> jour{profil.streak > 1 ? 's' : ''} d'affilée</span>
        </div>
      </Bandeau>

      <div className="dash-corps">
        <div className="niveau-barre">
          <div className="niveau-barre-tete"><span>Niveau {niveau}</span><span>{xpNiveau} / 100 XP vers le niveau {niveau + 1}</span></div>
          <div className="niveau-barre-piste"><i style={{ width: `${xpNiveau}%` }} /></div>
        </div>

        <div className="stats-grille stat-rangee">
          <Stat icone="etoile" valeur={profil.xpTotal || 0} unite=" XP" label="Points gagnés" />
          <Stat icone="livre" valeur={`${stats.chapitresTermines}/${stats.totalChapitres}`} label="Chapitres terminés" delai={60} />
          <Stat icone="cible" valeur={`${stats.scoreMoyen || 0}%`} label="Score moyen" delai={120} />
          <Stat icone="trophee" valeur={stats.totalBadges || 0} label="Badges obtenus" delai={180} />
        </div>

        {!profil.estPremium && profil.role === 'ELEVE' && (
          <div className="promo-bandeau">
            <div>
              <strong>Passe à Premium</strong>
              <span>Débloque tous les cours, la Révision express et les explications de l'IA. 2 900 FCFA par mois.</span>
            </div>
            <Link to="/tarifs" className="btn btn-or">Voir les tarifs</Link>
          </div>
        )}

        <div className="dashboard-grille">
          <div style={{ display: 'grid', gap: 18 }}>
            <section className="carte-dash">
              <div className="carte-dash-tete">
                <h2>Mes chapitres</h2>
                {stats.totalChapitres > 0 && <span className="ligne-dash-sous">{pctChap} % du programme</span>}
              </div>
              {progressions.length === 0 ? (
                <div className="vide" style={{ padding: '2rem 1rem' }}>
                  <Icone nom="livre" taille={32} />
                  <p style={{ margin: 0 }}>Tu n'as pas encore commencé de chapitre.</p>
                  <Link to="/cours" className="btn btn-foret">Choisir un cours</Link>
                </div>
              ) : (
                <div className="liste-dash">
                  {progressions.map(p => {
                    const s = STATUTS[p.statut] || STATUTS.NON_COMMENCE
                    return (
                      <Link key={p.id} to={`/chapitres/${p.chapitreId}`} className="ligne-dash">
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span className="ligne-dash-titre">{p.chapitre?.titre}</span>
                          <span className="ligne-dash-sous">{p.chapitre?.cours?.titre}</span>
                        </span>
                        {p.score != null && <b className="ligne-dash-score">{p.score}%</b>}
                        <span className={`etat-pastille ${s.classe}`}>{s.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>

            {dernieresTentatives.length > 0 && (
              <section className="carte-dash">
                <h2>Quiz récents</h2>
                <div className="liste-dash">
                  {dernieresTentatives.map((t, i) => (
                    <div key={i} className="ligne-dash sans-lien">
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span className="ligne-dash-titre">{t.quiz?.titre}</span>
                        <span className="ligne-dash-sous">{new Date(t.commenceLe).toLocaleDateString('fr-FR')}</span>
                      </span>
                      <b className={`ligne-dash-score ${t.score >= 50 ? 'bon' : 'faible'}`}>{t.score}%</b>
                      <span className="xp-gagne">+{t.xpGagne} XP</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="carte-dash">
            <h2>Mes badges</h2>
            {badges.length === 0 ? (
              <p className="ligne-dash-sous" style={{ lineHeight: 1.6 }}>Termine des quiz pour gagner ton premier badge.</p>
            ) : (
              <div className="badges-grille">
                {badges.map(b => (
                  <div key={b.id} title={b.badge.description} className="badge-tuile">
                    <span>{b.badge.icone}</span>
                    <small>{b.badge.nom}</small>
                  </div>
                ))}
              </div>
            )}
            <div className="liens-dash">
              <Link to="/cours">Explorer les cours</Link>
              <Link to="/revision-express">Révision express</Link>
              <Link to="/classement">Voir le classement</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
