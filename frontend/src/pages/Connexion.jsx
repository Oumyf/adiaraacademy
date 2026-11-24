import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import AuthLayout from '../components/AuthLayout'

export default function Connexion() {
  const { connexion } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', motDePasse: '' })
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setErreur(null)
    setChargement(true)
    try {
      const res = await api.post('/auth/connexion', form)
      connexion(res.data.token, res.data.utilisateur)
      navigate('/dashboard')
    } catch (err) {
      setErreur(err.response?.data?.message || 'Connexion impossible. Vérifie ton e-mail et ton mot de passe.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <AuthLayout
      titre="Content de te revoir"
      sousTitre="Connecte-toi pour reprendre là où tu t'es arrêté."
      pied={<>Pas encore de compte ? <Link to="/inscription">Créer un compte</Link></>}
    >
      <form onSubmit={handleSubmit} className="auth-champs">
        <label className="champ-groupe">E-mail
          <input type="email" placeholder="ton@email.com" autoComplete="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </label>
        <label className="champ-groupe">Mot de passe
          <input type="password" placeholder="Ton mot de passe" autoComplete="current-password" required value={form.motDePasse} onChange={e => setForm(f => ({ ...f, motDePasse: e.target.value }))} />
        </label>
        {erreur && <div className="ia-erreur" role="alert">{erreur}</div>}
        <button type="submit" disabled={chargement} className="btn btn-foret" style={{ width: '100%' }}>
          {chargement ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </AuthLayout>
  )
}
