import { useEffect, useState } from 'react'
import api from '../lib/api'

const fcfa = n => `${(n || 0).toLocaleString('fr-FR')} FCFA`

export default function AdminAmbassadeurs() {
  const [liste, setListe] = useState([])
  const [form, setForm] = useState({ email: '', code: '', reductionPct: '', commissionPct: '' })
  const [message, setMessage] = useState(null)
  const [erreur, setErreur] = useState(null)

  const charger = () => api.get('/promo/admin').then(r => setListe(r.data)).catch(() => setErreur('Impossible de charger la liste.'))
  useEffect(() => { charger() }, [])

  const creer = async e => {
    e.preventDefault(); setErreur(null); setMessage(null)
    try {
      const r = await api.post('/promo/admin', form)
      setMessage(`Code créé : ${r.data.code}`)
      setForm({ email: '', code: '', reductionPct: '', commissionPct: '' })
      charger()
    } catch (err) { setErreur(err.response?.data?.message || 'La création a échoué.') }
  }

  const payer = async c => {
    if (!window.confirm(`Marquer ${fcfa(c.aPayer)} comme versés à ${c.partenaire} ? Fais-le seulement après avoir envoyé l'argent par Wave ou Orange Money.`)) return
    try { const r = await api.post(`/promo/admin/${c.id}/payer`); setMessage(r.data.message); charger() }
    catch { setErreur('Action impossible.') }
  }

  const basculer = async c => {
    try { await api.patch(`/promo/admin/${c.id}/actif`, { actif: !c.actif }); charger() }
    catch { setErreur('Action impossible.') }
  }

  const totalDu = liste.reduce((s, c) => s + c.aPayer, 0)

  return (
    <div className="ambassadeur-page">
      <h1>Ambassadeurs</h1>
      <p>Total à verser ce mois : <strong>{fcfa(totalDu)}</strong>. Avant de payer, vérifie dans ton relevé Wave ou Orange Money que les références listées ont bien été encaissées.</p>

      <form onSubmit={creer} className="auth-champs" style={{ maxWidth: 520, marginTop: 20 }}>
        <h2>Créer un code</h2>
        <label className="champ-groupe">E-mail du partenaire (il doit avoir un compte)
          <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </label>
        <label className="champ-groupe">Code (laisser vide pour le générer)
          <input type="text" placeholder="PROF-MAMADOU" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
        </label>
        <div className="grille-2" style={{ gap: 12 }}>
          <label className="champ-groupe">Réduction élève, % (défaut 20)
            <input type="number" min="0" max="50" value={form.reductionPct} onChange={e => setForm(f => ({ ...f, reductionPct: e.target.value }))} />
          </label>
          <label className="champ-groupe">Commission prof, % (défaut 20)
            <input type="number" min="0" max="50" value={form.commissionPct} onChange={e => setForm(f => ({ ...f, commissionPct: e.target.value }))} />
          </label>
        </div>
        {message && <div role="status" className="promo-ok">{message}</div>}
        {erreur && <div className="ia-erreur" role="alert">{erreur}</div>}
        <button type="submit" className="btn btn-foret">Créer le code</button>
      </form>

      <h2 style={{ marginTop: 32 }}>Codes existants</h2>
      {liste.length === 0 ? <p>Aucun code pour le moment.</p> : (
        <table className="tableau-promo">
          <thead><tr><th>Partenaire</th><th>Code</th><th>Réduction / commission</th><th>Inscrits</th><th>À verser</th><th>Déjà versé</th><th></th></tr></thead>
          <tbody>
            {liste.map(c => (
              <tr key={c.id}>
                <td>{c.partenaire}<br /><small>{c.email}</small></td>
                <td>{c.code}{!c.actif && <><br /><small>désactivé</small></>}</td>
                <td>{c.reductionPct} % / {c.commissionPct} %</td>
                <td>{c.inscrits}</td>
                <td>{fcfa(c.aPayer)}{c.references.length > 0 && <><br /><small>Réf. : {c.references.join(', ')}</small></>}</td>
                <td>{fcfa(c.payee)}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {c.aPayer > 0 && <button className="btn btn-foret" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => payer(c)}>Marquer versé</button>}{' '}
                  <button className="btn btn-doux" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => basculer(c)}>{c.actif ? 'Désactiver' : 'Réactiver'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
