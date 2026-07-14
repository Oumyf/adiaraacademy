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

export default function Inscription() {
  const { connexion } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', motDePasse: '', role: 'ELEVE', niveau: 'LYCEE', classe: '', ecole: '' })
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)

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
      setErreur(msgs ? msgs.map(e => e.msg).join(' · ') : err.response?.data?.message || 'Erreur.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 128px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: '400', marginBottom: '6px' }}>Creer mon compte</h1>
          <p style={{ color: 'var(--texte-3)', fontSize: '14px' }}>Gratuit et sans engagement.</p>
        </div>
        <div style={{ background: 'var(--blanc)', border: '1px solid var(--bord)', borderRadius: 'var(--r-xl)', padding: '2rem', boxShadow: 'var(--ombre-md)' }}>
          <form onSubmit={handleSubmit}>
            {/* Sélecteur de type de compte */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
              {[{ val: 'ELEVE', label: '🎓 Élève' }, { val: 'PARENT', label: '👨‍👩‍👧 Parent' }].map(({ val, label }) => (
                <button key={val} type="button" onClick={() => setForm(f => ({ ...f, role: val }))}
                  style={{ flex: 1, padding: '10px', border: `2px solid ${form.role === val ? 'var(--foret)' : 'var(--bord)'}`, borderRadius: 'var(--r-md)', background: form.role === val ? 'var(--foret-pale)' : 'var(--blanc)', color: form.role === val ? 'var(--foret)' : 'var(--texte-2)', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
              <Champ label="Prenom" type="text" placeholder="Fatou" required value={form.prenom} onChange={set('prenom')} />
              <Champ label="Nom" type="text" placeholder="Diallo" required value={form.nom} onChange={set('nom')} />
            </div>
            <Champ label="Email" type="email" placeholder="ton@email.com" required value={form.email} onChange={set('email')} />
            <Champ label="Mot de passe" type="password" placeholder="6 caracteres minimum" required value={form.motDePasse} onChange={set('motDePasse')} />

            {form.role === 'ELEVE' && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--texte-2)', marginBottom: '6px' }}>Niveau scolaire</label>
                  <select value={form.niveau} onChange={set('niveau')} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--bord)', borderRadius: 'var(--r-md)', fontSize: '14px', background: 'var(--blanc)', color: 'var(--texte)', outline: 'none' }}>
                    <option value="COLLEGE">College</option>
                    <option value="LYCEE">Lycee</option>
                    <option value="UNIVERSITE">Universite</option>
                  </select>
                </div>
                <Champ label="Classe (optionnel)" type="text" placeholder="ex: Terminale S, L2 Maths" value={form.classe} onChange={set('classe')} />
                <Champ label="Ecole (optionnel)" type="text" placeholder="ex: Lycee Lamine Gueye" value={form.ecole} onChange={set('ecole')} />
              </>
            )}
            {erreur && <div style={{ background: '#FEE2E2', color: 'var(--erreur)', padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: '13px', marginBottom: '1rem' }}>{erreur}</div>}
            <button type="submit" disabled={chargement} style={{ width: '100%', padding: '12px', background: chargement ? 'var(--bord)' : 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: '600', cursor: chargement ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}>
              {chargement ? 'Chargement...' : 'Creer mon compte'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--texte-3)', marginTop: '1.25rem' }}>
            Deja un compte ? <Link to="/connexion" style={{ color: 'var(--foret)', fontWeight: '600' }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
