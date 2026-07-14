import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const PLANS = [
  {
    id: 'gratuit',
    nom: 'Gratuit',
    prix: '0',
    unite: 'FCFA / mois',
    badge: null,
    description: 'Pour découvrir la plateforme',
    fonctionnalites: [
      'Cours de Mathématiques complets',
      'Cours de Chimie complets',
      'Quiz interactifs',
      'Suivi de progression',
      'Classement général',
      'Badges de récompense',
    ],
    blockes: ['Cours de Physique', 'Cours de SVT', 'Mode Révision Express', 'Parcours IA'],
    cta: null,
  },
  {
    id: 'premium',
    nom: 'Premium',
    prix: '2 900',
    unite: 'FCFA / mois',
    badge: '⭐ RECOMMANDÉ',
    description: 'Accès complet à toute la plateforme',
    fonctionnalites: [
      'Tout du plan Gratuit',
      'Cours de Physique débloqués',
      'Cours de SVT débloqués',
      'Mode Révision Express (5 min / 10 questions)',
      'Parcours personnalisé IA (bientôt)',
      'Support prioritaire',
    ],
    blockes: [],
    cta: 'Passer à Premium',
  },
  {
    id: 'etablissement',
    nom: 'Établissement',
    prix: 'Sur devis',
    unite: '',
    badge: '🏫 B2B',
    description: 'Pour collèges, lycées et universités',
    fonctionnalites: [
      'Tout du plan Premium',
      'Tableau de bord professeur',
      'Statistiques par classe',
      "Jusqu'à 500 élèves",
      'Contenu personnalisé par établissement',
      'Facturation mensuelle ou annuelle',
    ],
    blockes: [],
    cta: 'Nous contacter',
  },
]

const ETAPES = { CHOIX: 'choix', METHODE: 'methode', INSTRUCTIONS: 'instructions', SUCCES: 'succes' }

const LogoOrangeMoney = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" aria-label="Orange Money">
    <rect width="48" height="48" rx="12" fill="#FF6600"/>
    <rect x="8" y="8" width="32" height="32" rx="7" fill="white" opacity="0.12"/>
    {/* Cercle Orange */}
    <circle cx="24" cy="18" r="7" fill="white" opacity="0.9"/>
    <circle cx="24" cy="18" r="4.5" fill="#FF6600"/>
    <text x="24" y="34" textAnchor="middle" fill="white" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="8" letterSpacing="0.5">MONEY</text>
  </svg>
)

const LogoWave = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" aria-label="Wave">
    <rect width="48" height="48" rx="12" fill="#1D62ED"/>
    {/* W stylisé en vague */}
    <path d="M9 26 C13 18 17 34 21 24 C25 14 29 30 33 22 L36 16" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <text x="24" y="41" textAnchor="middle" fill="white" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="8" letterSpacing="1">WAVE</text>
  </svg>
)

function Modal({ onFermer, children }) {
  return (
    <div onClick={onFermer} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--blanc)', borderRadius: 'var(--r-xl)', padding: '2rem', maxWidth: '440px', width: '100%', boxShadow: 'var(--ombre-lg)', position: 'relative' }}>
        <button onClick={onFermer} aria-label="Fermer" style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '18px', color: 'var(--texte-3)', cursor: 'pointer' }}>✕</button>
        {children}
      </div>
    </div>
  )
}

export default function Tarifs() {
  const { utilisateur, mettreAJourUtilisateur } = useAuth()
  const navigate = useNavigate()
  const [abonnement, setAbonnement]     = useState(null)
  const [etape, setEtape]               = useState(ETAPES.CHOIX)
  const [methode, setMethode]           = useState(null)
  const [instructions, setInstructions] = useState(null)
  const [reference, setReference]       = useState(null)
  const [chargement, setChargement]     = useState(false)
  const [erreur, setErreur]             = useState(null)
  const [modalOuverte, setModalOuverte] = useState(false)

  useEffect(() => {
    if (utilisateur) {
      api.get('/abonnements/statut')
        .then(r => setAbonnement(r.data.abonnement))
        .catch(() => {})
    }
  }, [utilisateur])

  const ouvrirModal = () => {
    if (!utilisateur) { navigate('/inscription'); return }
    if (utilisateur.estPremium) return
    setEtape(ETAPES.METHODE)
    setErreur(null)
    setModalOuverte(true)
  }

  const initierPaiement = async (methodePaiement) => {
    setMethode(methodePaiement)
    setChargement(true)
    setErreur(null)
    try {
      const r = await api.post('/abonnements/initier', { methodePaiement })
      setReference(r.data.reference)
      setInstructions(r.data.instructions)
      setEtape(ETAPES.INSTRUCTIONS)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Une erreur est survenue.')
    } finally {
      setChargement(false)
    }
  }

  const confirmerTest = async () => {
    setChargement(true)
    setErreur(null)
    try {
      const r = await api.post('/abonnements/confirmer-test', { reference })
      mettreAJourUtilisateur({ estPremium: true })
      setAbonnement({ dateFin: r.data.dateFin, methodePaiement: methode, joursRestants: 30 })
      setEtape(ETAPES.SUCCES)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur lors de la confirmation.')
    } finally {
      setChargement(false)
    }
  }

  const fermerModal = () => {
    setModalOuverte(false)
    if (etape === ETAPES.SUCCES) window.location.reload()
  }

  const planActuel = utilisateur?.estPremium ? 'premium' : 'gratuit'
  const dateFin = abonnement?.dateFin
    ? new Date(abonnement.dateFin).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: '400', marginBottom: '0.75rem' }}>
          Choisissez votre plan
        </h1>
        <p style={{ color: 'var(--texte-2)', fontSize: '15px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.6' }}>
          AdiaraAcademy propose des cours de qualité pour tous les élèves sénégalais, du collège à l'université.
        </p>
      </div>

      {/* Bandeau abonnement actif */}
      {utilisateur?.estPremium && abonnement && (
        <div style={{ background: 'var(--foret-pale)', border: '1px solid var(--foret)', borderRadius: 'var(--r-lg)', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ color: 'var(--foret)', fontWeight: '600', fontSize: '14px' }}>
            ✓ Abonnement Premium actif
            {dateFin && <span style={{ fontWeight: '400', color: 'var(--texte-2)', marginLeft: '8px' }}>— expire le {dateFin} ({abonnement.joursRestants} j. restants)</span>}
          </div>
          <Link to="/cours" style={{ fontSize: '13px', color: 'var(--foret)', fontWeight: '600' }}>Accéder aux cours →</Link>
        </div>
      )}

      {/* Grille des plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {PLANS.map(plan => {
          const estActuel  = planActuel === plan.id
          const estPremium = plan.id === 'premium'
          return (
            <div key={plan.id} style={{ background: 'var(--blanc)', border: `2px solid ${estActuel ? 'var(--foret)' : estPremium ? 'var(--or)' : 'var(--bord)'}`, borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: estPremium ? 'var(--ombre-md)' : 'var(--ombre-sm)' }}>
              {plan.badge && (
                <div style={{ background: estPremium ? 'var(--or)' : 'var(--foret)', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '6px 16px', textAlign: 'center', letterSpacing: '.5px' }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ padding: '1.75rem 1.5rem' }}>
                {estActuel && (
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--foret)', background: 'var(--foret-pale)', padding: '3px 10px', borderRadius: '999px', display: 'inline-block', marginBottom: '10px', letterSpacing: '.5px' }}>
                    VOTRE PLAN ACTUEL
                  </div>
                )}
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: '400', marginBottom: '4px' }}>{plan.nom}</h2>
                <p style={{ color: 'var(--texte-3)', fontSize: '13px', marginBottom: '1.25rem' }}>{plan.description}</p>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--texte)' }}>{plan.prix}</span>
                  {plan.unite && <span style={{ color: 'var(--texte-3)', fontSize: '13px', marginLeft: '6px' }}>{plan.unite}</span>}
                </div>

                {plan.id === 'gratuit' && (
                  estActuel
                    ? <div style={{ padding: '11px 0', textAlign: 'center', fontSize: '14px', color: 'var(--texte-3)', fontWeight: '500' }}>Plan actuel</div>
                    : <Link to="/cours" style={{ display: 'block', padding: '11px', textAlign: 'center', background: 'var(--foret-pale)', color: 'var(--foret)', borderRadius: 'var(--r-md)', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>Commencer gratuitement</Link>
                )}

                {plan.id === 'premium' && (
                  utilisateur?.estPremium
                    ? <div style={{ padding: '11px 0', textAlign: 'center', fontSize: '14px', color: 'var(--succes)', fontWeight: '600' }}>✓ Plan actuel</div>
                    : <button onClick={ouvrirModal} style={{ width: '100%', padding: '12px', background: 'var(--or)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                        {plan.cta}
                      </button>
                )}

                {plan.id === 'etablissement' && (
                  <a href="mailto:contact@adiaraacademy.sn" style={{ display: 'block', padding: '11px', textAlign: 'center', background: 'var(--foret)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
                    {plan.cta}
                  </a>
                )}

                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plan.fonctionnalites.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--texte-2)' }}>
                      <span style={{ color: 'var(--succes)', fontWeight: '700', flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                  {plan.blockes.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--texte-3)' }}>
                      <span style={{ flexShrink: 0 }}>✕</span>{f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Note légale */}
      <div style={{ marginTop: '3rem', background: 'var(--foret-pale)', borderRadius: 'var(--r-xl)', padding: '1.5rem 2rem', border: '1px solid var(--bord)' }}>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: '400', color: 'var(--foret)', marginBottom: '0.5rem' }}>
          Paiement mobile — Orange Money & Wave
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--texte-2)', lineHeight: '1.6', margin: 0 }}>
          Le paiement s'effectue via <strong>Orange Money</strong> ou <strong>Wave</strong>.
          Après initiation, suivez les instructions affichées pour effectuer le virement.
          Contactez-nous à <strong>contact@adiaraacademy.sn</strong> en cas de problème.
        </p>
      </div>

      {/* ── Modal paiement ── */}
      {modalOuverte && (
        <Modal onFermer={fermerModal}>

          {/* Étape 1 — Choix de la méthode */}
          {etape === ETAPES.METHODE && (
            <>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: '400', marginBottom: '0.5rem' }}>Passer à Premium</h2>
              <p style={{ color: 'var(--texte-2)', fontSize: '13px', marginBottom: '1.75rem' }}>
                2 900 FCFA / mois · Sans engagement
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => initierPaiement('ORANGE_MONEY')} disabled={chargement}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', border: '2px solid #FF6600', borderRadius: 'var(--r-lg)', background: chargement ? 'var(--sable)' : '#FFF5EE', cursor: chargement ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'all .15s ease' }}
                  onMouseEnter={e => { if (!chargement) e.currentTarget.style.background = '#FFE8D6' }}
                  onMouseLeave={e => { e.currentTarget.style.background = chargement ? 'var(--sable)' : '#FFF5EE' }}
                >
                  <LogoOrangeMoney />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: '#CC4400' }}>Orange Money</div>
                    <div style={{ fontSize: '12px', color: 'var(--texte-3)', marginTop: '2px' }}>Paiement mobile · *144#</div>
                  </div>
                </button>
                <button onClick={() => initierPaiement('WAVE')} disabled={chargement}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', border: '2px solid #1D62ED', borderRadius: 'var(--r-lg)', background: chargement ? 'var(--sable)' : '#EEF5FF', cursor: chargement ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'all .15s ease' }}
                  onMouseEnter={e => { if (!chargement) e.currentTarget.style.background = '#D6E4FF' }}
                  onMouseLeave={e => { e.currentTarget.style.background = chargement ? 'var(--sable)' : '#EEF5FF' }}
                >
                  <LogoWave />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: '#1445B0' }}>Wave</div>
                    <div style={{ fontSize: '12px', color: 'var(--texte-3)', marginTop: '2px' }}>Paiement mobile · App Wave</div>
                  </div>
                </button>
              </div>
              {erreur && <div style={{ marginTop: '1rem', color: 'var(--erreur)', fontSize: '13px' }}>{erreur}</div>}
            </>
          )}

          {/* Étape 2 — Instructions de paiement */}
          {etape === ETAPES.INSTRUCTIONS && instructions && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                {methode === 'ORANGE_MONEY' ? <LogoOrangeMoney /> : <LogoWave />}
                <div>
                  <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: '400', margin: 0 }}>
                    {methode === 'ORANGE_MONEY' ? 'Orange Money' : 'Wave'}
                  </h2>
                  <div style={{ fontSize: '12px', color: 'var(--texte-3)', marginTop: '2px' }}>2 900 FCFA · 30 jours</div>
                </div>
              </div>

              <div style={{ background: 'var(--sable)', borderRadius: 'var(--r-lg)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--texte-3)', letterSpacing: '.5px', marginBottom: '8px' }}>INSTRUCTIONS</div>
                <p style={{ fontSize: '14px', color: 'var(--texte)', lineHeight: '1.7', margin: 0 }}>
                  {instructions.message}
                </p>
                {methode === 'ORANGE_MONEY' && instructions.ussd && (
                  <div style={{ marginTop: '10px', fontFamily: 'monospace', fontSize: '15px', fontWeight: '700', color: '#CC4400', background: '#FFF5EE', padding: '8px 12px', borderRadius: 'var(--r-sm)' }}>
                    {instructions.ussd}
                  </div>
                )}
              </div>

              <div style={{ background: 'var(--or-pale)', borderRadius: 'var(--r-lg)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔖</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--texte-3)', letterSpacing: '.5px' }}>RÉFÉRENCE À INDIQUER</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: '800', color: 'var(--or)', letterSpacing: '2px', marginTop: '2px' }}>{reference}</div>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--texte-3)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                Après avoir effectué le paiement, cliquez sur le bouton ci-dessous pour activer votre compte.
                <br/>En version bêta, l'activation est instantanée après confirmation.
              </p>

              <button onClick={confirmerTest} disabled={chargement}
                style={{ width: '100%', padding: '13px', background: chargement ? 'var(--bord)' : 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '14px', cursor: chargement ? 'not-allowed' : 'pointer' }}>
                {chargement ? 'Activation en cours…' : "J'ai effectué le paiement →"}
              </button>
              {erreur && <div style={{ marginTop: '0.75rem', color: 'var(--erreur)', fontSize: '13px' }}>{erreur}</div>}
              <button onClick={() => setEtape(ETAPES.METHODE)} style={{ marginTop: '10px', background: 'none', border: 'none', color: 'var(--texte-3)', fontSize: '13px', cursor: 'pointer', padding: 0 }}>
                ← Changer de méthode
              </button>
            </>
          )}

          {/* Étape 3 — Succès */}
          {etape === ETAPES.SUCCES && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: '400', marginBottom: '0.75rem' }}>
                Bienvenue dans Premium !
              </h2>
              <p style={{ color: 'var(--texte-2)', fontSize: '14px', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Ton compte Premium est activé.
                {dateFin && <><br/>Accès valable jusqu'au <strong>{dateFin}</strong>.</>}
              </p>
              <Link to="/cours" onClick={fermerModal}
                style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--foret)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                Découvrir les cours Premium →
              </Link>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
