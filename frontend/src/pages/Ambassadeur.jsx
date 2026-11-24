import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import Icone from '../components/Icones'

const fcfa = n => `${(n || 0).toLocaleString('fr-FR')} FCFA`
const date = d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Ambassadeur() {
  const [data, setData] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [copie, setCopie] = useState(null)

  useEffect(() => {
    api.get('/promo/mon-code').then(r => setData(r.data)).catch(() => setErreur('Impossible de charger tes informations. Réessaie dans un instant.'))
  }, [])

  const copier = async (texte, cle) => {
    try { await navigator.clipboard.writeText(texte); setCopie(cle); setTimeout(() => setCopie(null), 1800) } catch { /* ignoré */ }
  }

  if (erreur) return <div className="ambassadeur-page"><div className="ia-erreur" role="alert">{erreur}</div></div>
  if (!data) return <div className="ambassadeur-page"><p>Chargement…</p></div>

  if (!data.code) {
    return (
      <div className="ambassadeur-page">
        <h1>Programme ambassadeur</h1>
        <p>Tu n'as pas encore de code. Les professeurs partenaires reçoivent un code personnel : leurs élèves paient moins cher leurs premiers mois Premium, et le professeur touche une commission sur chaque paiement.</p>
        <p>Pour recevoir ton code, écris-nous à <a href="mailto:contact@adiaraacademy.sn">contact@adiaraacademy.sn</a> avec l'e-mail de ton compte.</p>
        <Link to="/dashboard" className="btn btn-doux">Retour au tableau de bord</Link>
      </div>
    )
  }

  const lien = `${window.location.origin}/inscription?code=${encodeURIComponent(data.code)}`
  const s = data.stats

  return (
    <div className="ambassadeur-page">
      <h1>Mon code ambassadeur</h1>
      <p>Tes élèves utilisent ce code à l'inscription ou avant leur premier paiement. Ils paient <strong>{data.reductionPct} % de moins</strong> sur leurs {data.nbPaiementsRemise} premiers mois Premium, et tu reçois <strong>{data.commissionPct} %</strong> de chaque paiement pendant leurs {data.nbPaiementsCommission} premiers mois.</p>

      <div className="bloc-ref" style={{ marginTop: 16 }}>
        <div className="bloc-instr-titre">Ton code</div>
        <b>{data.code}</b>
        {!data.actif && <p className="promo-ko">Ce code est désactivé pour le moment.</p>}
      </div>
      <div className="promo-saisie" style={{ marginTop: 12 }}>
        <input type="text" readOnly value={lien} aria-label="Lien d'inscription avec ton code" onFocus={e => e.target.select()} />
        <button type="button" className="btn btn-doux" onClick={() => copier(lien, 'lien')}>{copie === 'lien' ? 'Copié' : 'Copier le lien'}</button>
        <button type="button" className="btn btn-doux" onClick={() => copier(data.code, 'code')}>{copie === 'code' ? 'Copié' : 'Copier le code'}</button>
      </div>

      <div className="stats-grille stat-rangee" style={{ marginTop: 28 }}>
        <div className="stat-tuile"><span className="stat-ico"><Icone nom="eleves" taille={20} /></span><span className="stat-val">{s.inscrits}</span><span className="stat-lib">Élèves inscrits avec ton code</span></div>
        <div className="stat-tuile"><span className="stat-ico"><Icone nom="check" taille={20} /></span><span className="stat-val">{s.abonnesPayants}</span><span className="stat-lib">Élèves ayant payé</span></div>
        <div className="stat-tuile"><span className="stat-ico"><Icone nom="etoile" taille={20} /></span><span className="stat-val" style={{ fontSize: '1.3rem' }}>{fcfa(s.aPayer)}</span><span className="stat-lib">En attente de versement</span></div>
        <div className="stat-tuile"><span className="stat-ico"><Icone nom="trophee" taille={20} /></span><span className="stat-val" style={{ fontSize: '1.3rem' }}>{fcfa(s.payee)}</span><span className="stat-lib">Déjà versé</span></div>
      </div>

      <h2 style={{ marginTop: 32 }}>Tes élèves</h2>
      {data.eleves.length === 0
        ? <p>Personne ne s'est encore inscrit avec ton code. Partage le lien ci-dessus avec tes élèves ou leurs parents.</p>
        : (
          <table className="tableau-promo">
            <thead><tr><th>Élève</th><th>Inscrit le</th><th>Premium</th></tr></thead>
            <tbody>{data.eleves.map(e => <tr key={e.id}><td>{e.nom}</td><td>{date(e.inscritLe)}</td><td>{e.premium ? 'Oui' : 'Non'}</td></tr>)}</tbody>
          </table>
        )}

      <h2 style={{ marginTop: 32 }}>Tes commissions</h2>
      {data.commissions.length === 0
        ? <p>Aucune commission pour le moment. Elle apparaît dès qu'un élève de ton code paie son abonnement.</p>
        : (
          <table className="tableau-promo">
            <thead><tr><th>Date</th><th>Montant</th><th>Statut</th></tr></thead>
            <tbody>{data.commissions.map(c => (
              <tr key={c.id}><td>{date(c.creeLe)}</td><td>{fcfa(c.montant)}</td><td>{c.statut === 'PAYEE' ? `Versée le ${date(c.payeeLe)}` : 'En attente de versement'}</td></tr>
            ))}</tbody>
          </table>
        )}
      <p className="modal-note">Les commissions sont versées une fois par mois par Wave ou Orange Money, après vérification des paiements.</p>
    </div>
  )
}
