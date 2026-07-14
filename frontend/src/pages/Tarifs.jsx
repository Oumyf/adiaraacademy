import { useState } from 'react'
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
    blockes: [
      'Cours de Physique',
      'Cours de SVT',
      'Mode Révision Express',
      'Parcours personnalisé IA',
    ],
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
      'Parcours personnalisé IA (Phase 3)',
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
      'Jusqu\'à 500 élèves',
      'Contenu personnalisé par établissement',
      'Facturation mensuelle ou annuelle',
    ],
    blockes: [],
    cta: 'Nous contacter',
  },
]

export default function Tarifs() {
  const { utilisateur } = useAuth()
  const navigate = useNavigate()
  const [chargement, setChargement] = useState(false)
  const [succes, setSucces] = useState(false)
  const [erreur, setErreur] = useState(null)

  const souscrire = async () => {
    if (!utilisateur) { navigate('/inscription'); return }
    if (utilisateur.estPremium) return
    setChargement(true)
    setErreur(null)
    try {
      await api.post('/abonnements/souscrire')
      setSucces(true)
      setTimeout(() => window.location.reload(), 1500)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Une erreur est survenue.')
    } finally {
      setChargement(false)
    }
  }

  const planActuel = utilisateur?.estPremium ? 'premium' : 'gratuit'

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: '400', marginBottom: '0.75rem' }}>
          Choisissez votre plan
        </h1>
        <p style={{ color: 'var(--texte-2)', fontSize: '15px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.6' }}>
          AdiaraAcademy propose des cours de qualité pour tous les élèves sénégalais,
          du collège à l'université.
        </p>
      </div>

      {succes && (
        <div style={{ background: '#E6F4EC', border: '1px solid var(--succes)', borderRadius: 'var(--r-lg)', padding: '1rem 1.5rem', marginBottom: '2rem', color: 'var(--succes)', fontWeight: '600', textAlign: 'center' }}>
          Votre compte Premium est activé ! Bienvenue parmi les membres Premium.
        </div>
      )}

      {erreur && (
        <div style={{ background: '#FEF2F2', border: '1px solid var(--erreur)', borderRadius: 'var(--r-lg)', padding: '1rem 1.5rem', marginBottom: '2rem', color: 'var(--erreur)', fontWeight: '500', textAlign: 'center' }}>
          {erreur}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {PLANS.map(plan => {
          const estActuel = planActuel === plan.id
          const estPremium = plan.id === 'premium'
          return (
            <div key={plan.id} style={{
              background: 'var(--blanc)',
              border: `2px solid ${estActuel ? 'var(--foret)' : estPremium ? 'var(--or)' : 'var(--bord)'}`,
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              boxShadow: estPremium ? 'var(--ombre-md)' : 'var(--ombre-sm)',
            }}>
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
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: '400', color: 'var(--texte)' }}>{plan.prix}</span>
                  {plan.unite && <span style={{ color: 'var(--texte-3)', fontSize: '13px', marginLeft: '6px' }}>{plan.unite}</span>}
                </div>

                {plan.id === 'gratuit' && (
                  estActuel
                    ? <div style={{ padding: '11px 0', textAlign: 'center', fontSize: '14px', color: 'var(--texte-3)', fontWeight: '500' }}>Plan actuel</div>
                    : <Link to="/cours" style={{ display: 'block', padding: '11px', textAlign: 'center', background: 'var(--foret-pale)', color: 'var(--foret)', borderRadius: 'var(--r-md)', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>Commencer gratuitement</Link>
                )}

                {plan.id === 'premium' && (
                  utilisateur?.estPremium
                    ? <div style={{ padding: '11px 0', textAlign: 'center', fontSize: '14px', color: 'var(--succes)', fontWeight: '600' }}>Plan actuel</div>
                    : <button onClick={souscrire} disabled={chargement} style={{ width: '100%', padding: '12px', background: 'var(--or)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontWeight: '700', fontSize: '14px', cursor: chargement ? 'wait' : 'pointer', opacity: chargement ? 0.7 : 1 }}>
                        {chargement ? 'Activation…' : plan.cta}
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
                      <span style={{ color: 'var(--succes)', fontWeight: '700', flexShrink: 0 }}>✓</span>
                      {f}
                    </div>
                  ))}
                  {plan.blockes.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--texte-3)' }}>
                      <span style={{ flexShrink: 0 }}>✕</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '3rem', background: 'var(--foret-pale)', borderRadius: 'var(--r-xl)', padding: '1.5rem 2rem', border: '1px solid var(--bord)' }}>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: '400', color: 'var(--foret)', marginBottom: '0.75rem' }}>
          Paiement mobile (Phase 3)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--texte-2)', lineHeight: '1.6', margin: 0 }}>
          Le paiement en ligne via <strong>Orange Money</strong> et <strong>Wave</strong> sera disponible prochainement.
          En attendant, l'activation Premium est gratuite pour les testeurs bêta.
          Contactez-nous à <strong>contact@adiaraacademy.sn</strong> pour toute question.
        </p>
      </div>
    </div>
  )
}
