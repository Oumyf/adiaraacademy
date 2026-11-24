import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Icone from '../components/Icones'
import { Revele } from '../components/Animations'

const PLANS = [
  {
    id: 'gratuit', nom: 'Gratuit', prix: '0', unite: 'FCFA par mois',
    description: 'Pour découvrir la plateforme',
    ok: ['Cours de Mathématiques et de Chimie', 'Quiz avec correction immédiate', 'Quiz qui s\'adaptent à ton niveau', 'Explications de l\'IA : 5 par jour', 'Classement, badges et séries'],
    non: ['Cours de Physique et de SVT', 'Révision express'],
  },
  {
    id: 'premium', nom: 'Premium', prix: '2 900', unite: 'FCFA par mois', badge: 'Le plus choisi',
    description: 'Tout débloqué, sans limite de cours',
    ok: ['Tout du plan Gratuit', 'Cours de Physique et de SVT', 'Révision express (10 questions, 5 minutes)', 'Explications de l\'IA : 60 par jour', 'Sans engagement, résiliable à tout moment'],
    non: [],
  },
  {
    id: 'etablissement', nom: 'Établissement', prix: 'Sur devis', unite: '',
    description: 'Pour collèges, lycées et universités',
    ok: ['Tout du plan Premium', 'Tableau de bord professeur', 'Statistiques par classe', 'Jusqu\'à 500 élèves', 'Contenu adapté à ton établissement'],
    non: [],
  },
]

const FAQ = [
  ['Comment fonctionne le code promo d\'un professeur ?', 'Si un professeur t\'a donné son code, saisis-le à l\'inscription ou avant ton premier paiement. Tu paies moins cher sur tes premiers mois Premium, et ton professeur reçoit une petite commission. Cela ne change rien à ton accès.'],
  ['Comment je paie ?', 'Avec Orange Money ou Wave, depuis ton téléphone. Pas besoin de carte bancaire.'],
  ['Puis-je arrêter quand je veux ?', 'Oui. L\'abonnement dure 30 jours et ne se renouvelle pas tout seul : tu décides de le reprendre ou non.'],
  ['Mes parents peuvent-ils payer ?', 'Oui. Un parent peut payer depuis son propre téléphone avec la référence affichée à la fin du paiement.'],
  ['Que se passe-t-il si mon paiement ne passe pas ?', 'Écris-nous à contact@adiaraacademy.sn avec ta référence. On vérifie et on active ton compte.'],
]

const ETAPES = { CHOIX: 'choix', METHODE: 'methode', INSTRUCTIONS: 'instructions', SUCCES: 'succes' }

const LogoOrangeMoney = () => (
  <div style={{ width: 84, height: 48, borderRadius: 12, background: '#fff', border: '1px solid #E8E2D3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6, flexShrink: 0 }}>
    <img src="/logos/orange-money.png" alt="Orange Money" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
  </div>
)

const LogoWave = () => (
  <img src="/logos/wave.png" alt="Wave" width="48" height="48" style={{ borderRadius: '50%', flexShrink: 0, display: 'block' }} />
)

function Modal({ onFermer, children }) {
  useEffect(() => {
    const f = e => { if (e.key === 'Escape') onFermer() }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [onFermer])
  return (
    <div className="modal-fond" onClick={onFermer}>
      <div className="modal-boite" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <button className="modal-fermer" onClick={onFermer} aria-label="Fermer"><Icone nom="fermer" taille={20} /></button>
        {children}
      </div>
    </div>
  )
}

export default function Tarifs() {
  const { utilisateur, mettreAJourUtilisateur } = useAuth()
  const navigate = useNavigate()
  const [abonnement, setAbonnement] = useState(null)
  const [etape, setEtape] = useState(ETAPES.CHOIX)
  const [methode, setMethode] = useState(null)
  const [instructions, setInstructions] = useState(null)
  const [reference, setReference] = useState(null)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [modalOuverte, setModalOuverte] = useState(false)
  const [prix, setPrix] = useState({ montant: 2900, montantInitial: 2900, reductionPct: 0, code: null })
  const [codeSaisi, setCodeSaisi] = useState('')
  const [erreurCode, setErreurCode] = useState(null)
  const fcfa = n => n.toLocaleString('fr-FR')

  useEffect(() => {
    if (utilisateur) api.get('/abonnements/statut').then(r => setAbonnement(r.data.abonnement)).catch(() => {})
  }, [utilisateur])

  const ouvrirModal = () => {
    if (!utilisateur) { navigate('/inscription'); return }
    if (utilisateur.estPremium) return
    setEtape(ETAPES.METHODE); setErreur(null); setErreurCode(null); setModalOuverte(true)
    api.get('/promo/prix').then(r => setPrix(r.data)).catch(() => {})
  }

  const appliquerCode = async () => {
    setErreurCode(null)
    try {
      const r = await api.post('/promo/appliquer', { code: codeSaisi })
      setPrix(r.data.prix); setCodeSaisi('')
    } catch (e) {
      setErreurCode(e.response?.data?.message || 'Le code n\'a pas pu être appliqué.')
    }
  }

  const initierPaiement = async (methodePaiement) => {
    setMethode(methodePaiement); setChargement(true); setErreur(null)
    try {
      const r = await api.post('/abonnements/initier', { methodePaiement })
      setReference(r.data.reference); setInstructions(r.data.instructions); setEtape(ETAPES.INSTRUCTIONS)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Le paiement n\'a pas pu démarrer. Réessaie dans un instant.')
    } finally { setChargement(false) }
  }

  const confirmerTest = async () => {
    setChargement(true); setErreur(null)
    try {
      const r = await api.post('/abonnements/confirmer-test', { reference })
      mettreAJourUtilisateur({ estPremium: true })
      setAbonnement({ dateFin: r.data.dateFin, methodePaiement: methode, joursRestants: 30 })
      setEtape(ETAPES.SUCCES)
    } catch (e) {
      setErreur(e.response?.data?.message || 'La confirmation a échoué. Réessaie ou écris-nous avec ta référence.')
    } finally { setChargement(false) }
  }

  const fermerModal = () => {
    setModalOuverte(false)
    if (etape === ETAPES.SUCCES) window.location.reload()
  }

  const planActuel = utilisateur?.estPremium ? 'premium' : 'gratuit'
  const dateFin = abonnement?.dateFin ? new Date(abonnement.dateFin).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : null

  return (
    <div>
      <div className="entete-page">
        <div className="entete-page-int" style={{ textAlign: 'center' }}>
          <h1>Un abonnement simple, pour tous les élèves</h1>
          <p style={{ margin: '12px auto 0' }}>Commence gratuitement. Passe à Premium quand tu veux débloquer toutes les matières.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {utilisateur?.estPremium && abonnement && (
          <div className="bandeau-actif">
            <Icone nom="check" taille={20} />
            <span><strong>Premium actif</strong>{dateFin && <> jusqu'au {dateFin} ({abonnement.joursRestants} jours restants)</>}</span>
            <Link to="/cours" className="btn btn-foret" style={{ padding: '8px 16px', fontSize: 13.5 }}>Voir les cours</Link>
          </div>
        )}

        <div className="plans-grille">
          {PLANS.map((plan, i) => {
            const estActuel = planActuel === plan.id
            const vedette = plan.id === 'premium'
            return (
              <Revele key={plan.id} delai={i * 90} className={`plan ${vedette ? 'plan-vedette' : ''} ${estActuel ? 'plan-actuel' : ''}`}>
                {plan.badge && <span className="plan-badge"><Icone nom="etoile" taille={13} /> {plan.badge}</span>}
                {estActuel && <span className="plan-tag">Ton plan actuel</span>}
                <h2>{plan.nom}</h2>
                <p className="plan-desc">{plan.description}</p>
                <div className="plan-prix"><b>{plan.prix}</b>{plan.unite && <small>{plan.unite}</small>}</div>

                {plan.id === 'gratuit' && (estActuel
                  ? <div className="plan-actuel-txt">Tu es sur ce plan</div>
                  : <Link to="/cours" className="btn btn-doux plan-btn">Commencer gratuitement</Link>)}
                {plan.id === 'premium' && (utilisateur?.estPremium
                  ? <div className="plan-actuel-txt">Tu es sur ce plan</div>
                  : <button onClick={ouvrirModal} className="btn btn-or plan-btn">Passer à Premium</button>)}
                {plan.id === 'etablissement' && <a href="mailto:contact@adiaraacademy.sn" className="btn btn-foret plan-btn">Nous contacter</a>}

                <ul className="plan-liste">
                  {plan.ok.map(f => <li key={f}><Icone nom="check" taille={16} /> {f}</li>)}
                  {plan.non.map(f => <li key={f} className="non"><Icone nom="croix" taille={16} /> {f}</li>)}
                </ul>
              </Revele>
            )
          })}
        </div>

        <div className="paiement-note">
          <div className="paiement-logos"><LogoOrangeMoney /><LogoWave /></div>
          <p>Le paiement se fait avec <strong>Orange Money</strong> ou <strong>Wave</strong>. Après avoir choisi ta méthode, tu reçois les instructions et une référence à indiquer.</p>
        </div>

        <h2 className="titre-liste" style={{ margin: '3rem 0 1rem' }}>Questions fréquentes</h2>
        <div className="faq">
          {FAQ.map(([q, r]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{r}</p>
            </details>
          ))}
        </div>
      </div>

      {modalOuverte && (
        <Modal onFermer={fermerModal}>
          {etape === ETAPES.METHODE && (
            <>
              <h2 className="modal-titre">Passer à Premium</h2>
              <p className="modal-sous">
                {prix.reductionPct > 0
                  ? <><s className="prix-barre">{fcfa(prix.montantInitial)}</s> <strong>{fcfa(prix.montant)} FCFA</strong> pour 30 jours (code {prix.code}, {prix.reductionPct} % de réduction).</>
                  : <>{fcfa(prix.montant)} FCFA pour 30 jours, sans engagement.</>}
              </p>
              {!prix.code && (
                <div className="promo-saisie">
                  <input type="text" placeholder="Code promo d'un professeur" value={codeSaisi} onChange={e => setCodeSaisi(e.target.value.toUpperCase())} aria-label="Code promo" />
                  <button type="button" className="btn btn-doux" onClick={appliquerCode} disabled={!codeSaisi.trim()}>Appliquer</button>
                </div>
              )}
              {erreurCode && <div className="ia-erreur" role="alert" style={{ marginBottom: 12 }}>{erreurCode}</div>}
              <div style={{ display: 'grid', gap: 12 }}>
                <button onClick={() => initierPaiement('ORANGE_MONEY')} disabled={chargement} className="methode methode-om">
                  <LogoOrangeMoney />
                  <span><b>Orange Money</b><small>Paiement mobile, code *144#</small></span>
                </button>
                <button onClick={() => initierPaiement('WAVE')} disabled={chargement} className="methode methode-wave">
                  <LogoWave />
                  <span><b>Wave</b><small>Paiement avec l'application Wave</small></span>
                </button>
              </div>
              {erreur && <div className="ia-erreur" role="alert" style={{ marginTop: 14 }}>{erreur}</div>}
            </>
          )}

          {etape === ETAPES.INSTRUCTIONS && instructions && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.2rem' }}>
                {methode === 'ORANGE_MONEY' ? <LogoOrangeMoney /> : <LogoWave />}
                <div>
                  <h2 className="modal-titre" style={{ margin: 0 }}>{methode === 'ORANGE_MONEY' ? 'Orange Money' : 'Wave'}</h2>
                  <div className="modal-sous" style={{ margin: 0 }}>{fcfa(prix.montant)} FCFA pour 30 jours</div>
                </div>
              </div>

              <div className="bloc-instr">
                <div className="bloc-instr-titre">Ce que tu dois faire</div>
                <p>{instructions.message}</p>
                {methode === 'ORANGE_MONEY' && instructions.ussd && <code>{instructions.ussd}</code>}
              </div>

              <div className="bloc-ref">
                <div className="bloc-instr-titre">Référence à indiquer</div>
                <b>{reference}</b>
              </div>

              <p className="modal-note">Une fois le paiement fait, appuie sur le bouton pour activer ton compte. En version bêta, l'activation est immédiate.</p>

              <button onClick={confirmerTest} disabled={chargement} className="btn btn-foret" style={{ width: '100%' }}>
                {chargement ? 'Activation en cours…' : "J'ai fait le paiement"}
              </button>
              {erreur && <div className="ia-erreur" role="alert" style={{ marginTop: 12 }}>{erreur}</div>}
              <button onClick={() => setEtape(ETAPES.METHODE)} className="lien-doux">Changer de méthode</button>
            </>
          )}

          {etape === ETAPES.SUCCES && (
            <div style={{ textAlign: 'center', padding: '.5rem 0' }}>
              <span className="succes-ico"><Icone nom="trophee" taille={34} /></span>
              <h2 className="modal-titre">Bienvenue dans Premium</h2>
              <p className="modal-sous" style={{ lineHeight: 1.7 }}>Ton compte est activé.{dateFin && <><br />Accès valable jusqu'au <strong>{dateFin}</strong>.</>}</p>
              <Link to="/cours" onClick={fermerModal} className="btn btn-foret">Découvrir les cours</Link>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
