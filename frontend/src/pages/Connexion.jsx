import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

function Champ({ label, ...props }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--texte-2)', marginBottom: '6px' }}>{label}</label>
      <input {...props} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', color: 'var(--texte)', background: 'var(--blanc)', outline: 'none' }}
        onFocus={e => e.target.style.borderColor = 'var(--foret)'}
        onBlur={e => e.target.style.borderColor = 'var(--bord)'}
      />
    </div>
  )
}

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
      setErreur(err.response?.data?.message || 'Erreur de connexion.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 128px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: '400', marginBottom: '6px' }}>Bon retour !</h1>
          <p style={{ color: 'var(--texte-3)', fontSize: '14px' }}>Connecte-toi pour reprendre la ou tu t'es arrete.</p>
        </div>
        <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-md)' }}>
          <form onSubmit={handleSubmit}>
            <Champ label="Email" type="email" placeholder="ton@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Champ label="Mot de passe" type="password" placeholder="••••••••" required value={form.motDePasse} onChange={e => setForm(f => ({ ...f, motDePasse: e.target.value }))} />
            {erreur && <div style={{ background: '#FEE2E2', color: 'var(--erreur)', padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: '13px', marginBottom: '1rem' }}>{erreur}</div>}
            <button type="submit" disabled={chargement} style={{ width: '100%', padding: '12px', background: chargement ? 'var(--bord)' : 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: '600', cursor: chargement ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}>
              {chargement ? 'Chargement...' : 'Se connecter'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--texte-3)', marginTop: '1.25rem' }}>
            Pas encore de compte ? <Link to="/inscription" style={{ color: 'var(--foret)', fontWeight: '600' }}>Creer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
