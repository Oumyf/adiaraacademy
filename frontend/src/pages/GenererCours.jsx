import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import Icone from '../components/Icones'

const MATIERES = [
  ['MATHEMATIQUES', 'Mathématiques'], ['PHYSIQUE', 'Physique'], ['CHIMIE', 'Chimie'],
  ['SCIENCES_VIE_TERRE', 'SVT'], ['INFORMATIQUE', 'Informatique'],
]
const NIVEAUX = [['COLLEGE', 'Collège'], ['LYCEE', 'Lycée'], ['UNIVERSITE', 'Université']]

const msg = (err, defaut) => err.response?.data?.message || defaut

export default function GenererCours() {
  const [etape, setEtape] = useState('formulaire')   // formulaire | plan | generation
  const [form, setForm] = useState({ matiere: 'MATHEMATIQUES', niveau: 'LYCEE', classe: '', theme: '', nbChapitres: 5, premium: false })
  const [plan, setPlan] = useState(null)
  const [occupe, setOccupe] = useState(false)
  const [erreur, setErreur] = useState('')
  const [cours, setCours] = useState(null)           // { coursId, chapitres, objectifs }
  const [statuts, setStatuts] = useState([])         // attente | contenu | quiz | ok | erreur
  const [erreurs, setErreurs] = useState([])

  const maj = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const concevoirPlan = async (e) => {
    e?.preventDefault()
    if (!form.theme.trim()) return setErreur('Indique le thème du cours.')
    setOccupe(true); setErreur('')
    try {
      const { data } = await api.post('/ia/cours/plan', form)
      setPlan(data); setEtape('plan')
    } catch (err) { setErreur(msg(err, "Impossible de concevoir le plan pour le moment.")) }
    finally { setOccupe(false) }
  }

  const majChapitre = (i, v) => setPlan(p => ({ ...p, chapitres: p.chapitres.map((c, k) => k === i ? { ...c, titre: v } : c) }))
  const retirerChapitre = (i) => setPlan(p => ({ ...p, chapitres: p.chapitres.filter((_, k) => k !== i) }))

  const etat = (i, valeur, texte = '') => {
    setStatuts(s => s.map((x, k) => k === i ? valeur : x))
    setErreurs(e => e.map((x, k) => k === i ? texte : x))
  }

  const rediger = async (chapitres, objectifs, i) => {
    try {
      etat(i, 'contenu')
      await api.post(`/ia/chapitres/${chapitres[i].id}/generer-contenu`, { objectifs: objectifs[i] })
      etat(i, 'quiz')
      await api.post(`/ia/chapitres/${chapitres[i].id}/generer-quiz`)
      etat(i, 'ok')
      return null
    } catch (err) {
      const m = msg(err, 'Une erreur est survenue.')
      etat(i, 'erreur', m)
      return m
    }
  }

  const lancer = async () => {
    if (!plan.titre.trim() || !plan.chapitres.length) return setErreur('Le cours doit avoir un titre et au moins un chapitre.')
    setOccupe(true); setErreur('')
    try {
      const { data } = await api.post('/ia/cours/creer', { ...form, titre: plan.titre, description: plan.description, chapitres: plan.chapitres })
      setCours(data)
      setStatuts(data.chapitres.map(() => 'attente')); setErreurs(data.chapitres.map(() => ''))
      setEtape('generation')
      // Rédaction chapitre par chapitre (chaque étape est une requête courte).
      for (let i = 0; i < data.chapitres.length; i++) {
        const echec = await rediger(data.chapitres, data.objectifs, i)
        if (echec && /Limite|Clé|Crédit|activée/.test(echec)) break
      }
    } catch (err) { setErreur(msg(err, 'Impossible de créer le cours.')) }
    finally { setOccupe(false) }
  }

  const reessayer = async (i) => {
    setOccupe(true)
    await rediger(cours.chapitres, cours.objectifs, i)
    setOccupe(false)
  }

  const termine = statuts.length > 0 && statuts.every(s => s === 'ok')

  return (
    <div>
      <div className="entete-page">
        <div className="entete-page-int">
          <h1>Concevoir un cours avec l'IA</h1>
          <p>Choisis un thème : l'IA propose un plan, rédige chaque chapitre et prépare un quiz adaptatif. Tout reste en brouillon jusqu'à ce que tu l'aies relu.</p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {erreur && <div className="ia-erreur" role="alert" style={{ marginBottom: 16 }}>{erreur}</div>}

        {etape === 'formulaire' && (
          <form onSubmit={concevoirPlan} className="carte" style={{ padding: '1.6rem', display: 'grid', gap: 16 }}>
            <div className="grille-2">
              <label className="champ-groupe">Matière
                <select value={form.matiere} onChange={e => maj('matiere', e.target.value)}>{MATIERES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
              </label>
              <label className="champ-groupe">Niveau
                <select value={form.niveau} onChange={e => maj('niveau', e.target.value)}>{NIVEAUX.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
              </label>
            </div>
            <div className="grille-2">
              <label className="champ-groupe">Classe (facultatif)
                <input value={form.classe} onChange={e => maj('classe', e.target.value)} placeholder="Ex. : 3ème, Seconde S, Terminale S2" />
              </label>
              <label className="champ-groupe">Nombre de chapitres
                <select value={form.nbChapitres} onChange={e => maj('nbChapitres', Number(e.target.value))}>{[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} chapitres</option>)}</select>
              </label>
            </div>
            <label className="champ-groupe">Thème du cours
              <input value={form.theme} onChange={e => maj('theme', e.target.value)} placeholder="Ex. : Les fonctions dérivées, Les équations du second degré, La mole" maxLength={200} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--texte-2)' }}>
              <input type="checkbox" checked={form.premium} onChange={e => maj('premium', e.target.checked)} /> Réserver ce cours aux membres Premium
            </label>
            <button className="btn btn-foret" disabled={occupe} type="submit">
              <Icone nom="etincelle" taille={18} /> {occupe ? "L'IA conçoit le plan…" : 'Concevoir le plan'}
            </button>
          </form>
        )}

        {etape === 'plan' && plan && (
          <div className="carte" style={{ padding: '1.6rem', display: 'grid', gap: 16 }}>
            <p style={{ color: 'var(--texte-2)', fontSize: 14 }}>Relis le plan, corrige ou retire des chapitres. La rédaction prend environ une minute par chapitre.</p>
            <label className="champ-groupe">Titre du cours
              <input value={plan.titre} onChange={e => setPlan(p => ({ ...p, titre: e.target.value }))} />
            </label>
            <label className="champ-groupe">Description
              <textarea rows={3} value={plan.description} onChange={e => setPlan(p => ({ ...p, description: e.target.value }))} />
            </label>
            <div style={{ display: 'grid', gap: 10 }}>
              {plan.chapitres.map((c, i) => (
                <div key={i} className="ligne-chapitre">
                  <span className="etape-num" style={{ fontSize: '1.6rem', color: 'var(--or)' }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <input value={c.titre} onChange={e => majChapitre(i, e.target.value)} aria-label={`Titre du chapitre ${i + 1}`} />
                    {c.objectifs?.length > 0 && <div style={{ fontSize: 12.5, color: 'var(--texte-3)', marginTop: 4 }}>{c.objectifs.join(' · ')}</div>}
                  </div>
                  <button type="button" className="icone-btn" onClick={() => retirerChapitre(i)} aria-label={`Retirer le chapitre ${i + 1}`}><Icone nom="croix" taille={16} /></button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-or" onClick={lancer} disabled={occupe}><Icone nom="etincelle" taille={18} /> {occupe ? 'Création…' : 'Créer le cours et rédiger les chapitres'}</button>
              <button className="btn btn-doux" onClick={() => setEtape('formulaire')} disabled={occupe}>Changer le thème</button>
              <button className="btn btn-doux" onClick={concevoirPlan} disabled={occupe}>Refaire le plan</button>
            </div>
          </div>
        )}

        {etape === 'generation' && cours && (
          <div className="carte" style={{ padding: '1.6rem' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '1.5rem', marginBottom: 4 }}>{plan.titre}</h2>
            <p style={{ color: 'var(--texte-2)', fontSize: 14, marginBottom: 16 }}>
              {termine ? 'Le cours est prêt, en brouillon.' : 'Rédaction en cours. Tu peux laisser cette page ouverte.'}
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {cours.chapitres.map((c, i) => (
                <div key={c.id} className={`gen-ligne ${statuts[i]}`}>
                  <span className="gen-ico">
                    {statuts[i] === 'ok' ? <Icone nom="check" taille={16} /> : statuts[i] === 'erreur' ? <Icone nom="croix" taille={16} /> : statuts[i] === 'attente' ? <span className="gen-point" /> : <span className="gen-rond" />}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>{c.ordre}. {c.titre}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--texte-3)' }}>
                      {statuts[i] === 'attente' && 'En attente'}
                      {statuts[i] === 'contenu' && 'Rédaction de la leçon…'}
                      {statuts[i] === 'quiz' && 'Création du quiz…'}
                      {statuts[i] === 'ok' && 'Leçon et quiz prêts'}
                      {statuts[i] === 'erreur' && <span style={{ color: 'var(--erreur)' }}>{erreurs[i]}</span>}
                    </div>
                  </div>
                  {statuts[i] === 'erreur' && <button className="btn btn-doux" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => reessayer(i)} disabled={occupe}>Réessayer</button>}
                </div>
              ))}
            </div>
            {termine && (
              <div style={{ marginTop: 20 }}>
                <div className="niveau-info monte" style={{ marginBottom: 14 }}>
                  Relis chaque chapitre avant de publier : l'IA peut se tromper. Vérifie surtout les formules, les calculs et le programme.
                </div>
                <Link to={`/cours/${cours.coursId}`} className="btn btn-or">Relire et publier le cours <Icone nom="fleche" taille={18} /></Link>
              </div>
            )}
            {!termine && statuts.some(s => s === 'ok') && !occupe && (
              <div style={{ marginTop: 16 }}><Link to={`/cours/${cours.coursId}`} className="btn btn-doux">Ouvrir le cours tel quel</Link></div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
