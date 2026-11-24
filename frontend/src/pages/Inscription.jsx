import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import AuthLayout from '../components/AuthLayout'
import Icone from '../components/Icones'

export default function Inscription() {
  const { connexion } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', motDePasse: '', role: 'ELEVE', niveau: 'LYCEE', classe: '', ecole: '', codePromo: '' })
  const [params] = useSearchParams()
  const [infoCode, setInfoCode] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)

  useEffect(() => {
    const c = params.get('code')
    if (c) setForm(f => ({ ...f, codePromo: c.toUpperCase() }))
  }, [params])

  useEffect(() => {
    const c = form.codePromo.trim()
    if (c.length < 4) { setInfoCode(null); return }
    const t = setTimeout(() => {
      api.get(`/promo/verifier/${encodeURIComponent(c)}`).then(r => setInfoCode(r.data)).catch(() => setInfoCode(null))
    }, 400)
    return () => clearTimeout(t)
  }, [form.codePromo])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setErreur(null)
    setChargement(true)
    try {
      const res = await api.post('/auth/inscription', form)
      connexion(res.data.token, res.data.utilisateur)
      navigate(res.data.utilisateur.role === 'PARENT' ? '/espace-parent' : '/dashboard')
    } catch (err) {
      const msgs = err.response?.data?.erreurs
      setErreur(msgs ? msgs.map(e => e.msg).join(' · ') : err.response?.data?.message || "L'inscription a échoué. Réessaie.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <AuthLayout
      titre="Crée ton compte"
      sousTitre="C'est gratuit, et ton premier chapitre est offert."
      pied={<>Déjà un compte ? <Link to="/connexion">Se connecter</Link></>}
    >
      <form onSubmit={handleSubmit} className="auth-champs">
        <div className="choix-role" role="radiogroup" aria-label="Type de compte">
          {[{ val: 'ELEVE', label: 'Élève', ico: 'livre' }, { val: 'PARENT', label: 'Parent', ico: 'eleves' }].map(({ val, label, ico }) => (
            <button key={val} type="button" role="radio" aria-checked={form.role === val} className={form.role === val ? 'actif' : ''} onClick={() => setForm(f => ({ ...f, role: val }))}>
              <Icone nom={ico} taille={20} /> {label}
            </button>
          ))}
        </div>

        <div className="grille-2" style={{ gap: 12 }}>
          <label className="champ-groupe">Prénom
            <input type="text" placeholder="Fatou" autoComplete="given-name" required value={form.prenom} onChange={set('prenom')} />
          </label>
          <label className="champ-groupe">Nom
            <input type="text" placeholder="Diallo" autoComplete="family-name" required value={form.nom} onChange={set('nom')} />
          </label>
        </div>
        <label className="champ-groupe">E-mail
          <input type="email" placeholder="ton@email.com" autoComplete="email" required value={form.email} onChange={set('email')} />
        </label>
        <label className="champ-groupe">Mot de passe
          <input type="password" placeholder="6 caractères minimum" autoComplete="new-password" required value={form.motDePasse} onChange={set('motDePasse')} />
        </label>

        {form.role === 'ELEVE' && (
          <>
            <label className="champ-groupe">Niveau scolaire
              <select value={form.niveau} onChange={set('niveau')}>
                <option value="COLLEGE">Collège</option>
                <option value="LYCEE">Lycée</option>
                <option value="UNIVERSITE">Université</option>
              </select>
            </label>
            <div className="grille-2" style={{ gap: 12 }}>
              <label className="champ-groupe">Classe (facultatif)
                <input type="text" placeholder="Terminale S, L2 Maths" value={form.classe} onChange={set('classe')} />
              </label>
              <label className="champ-groupe">École (facultatif)
                <input type="text" placeholder="Lycée Lamine Guèye" value={form.ecole} onChange={set('ecole')} />
              </label>
            </div>
          </>
        )}
        <label className="champ-groupe">Code promo d'un professeur (facultatif)
          <input type="text" placeholder="PROF-MAMADOU" autoComplete="off" value={form.codePromo} onChange={e => setForm(f => ({ ...f, codePromo: e.target.value.toUpperCase() }))} />
          {infoCode?.valide && <span className="promo-ok">Code de {infoCode.partenaire} : {infoCode.reductionPct} % de réduction sur tes {infoCode.nbPaiements} premiers mois Premium.</span>}
          {infoCode && !infoCode.valide && <span className="promo-ko">Ce code n'existe pas ou n'est plus valable.</span>}
        </label>
        {erreur && <div className="ia-erreur" role="alert">{erreur}</div>}
        <button type="submit" disabled={chargement} className="btn btn-foret" style={{ width: '100%' }}>
          {chargement ? 'Création…' : 'Créer mon compte'}
        </button>
      </form>
    </AuthLayout>
  )
}
