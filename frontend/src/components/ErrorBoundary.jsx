import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { erreur: null }
  }

  static getDerivedStateFromError(erreur) {
    return { erreur }
  }

  componentDidCatch(erreur, info) {
    console.error('[ErrorBoundary]', erreur, info.componentStack)
  }

  render() {
    if (this.state.erreur) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>⚠️</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: '400', fontSize: '1.5rem', color: 'var(--texte)' }}>
            Quelque chose s'est mal passé
          </h2>
          <p style={{ color: 'var(--texte-2)', fontSize: '14px', maxWidth: '400px' }}>
            Une erreur inattendue s'est produite. Recharge la page ou reviens à l'accueil.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => this.setState({ erreur: null })}
              style={{ padding: '10px 20px', background: 'var(--foret)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Réessayer
            </button>
            <a href="/" style={{ padding: '10px 20px', background: 'var(--blanc)', border: '1px solid var(--bord)', color: 'var(--texte)', borderRadius: 'var(--r-md)', fontSize: '14px', fontWeight: '500' }}>
              Accueil
            </a>
          </div>
          {import.meta.env.DEV && (
            <pre style={{ marginTop: '1rem', padding: '1rem', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 'var(--r-md)', fontSize: '12px', color: 'var(--erreur)', textAlign: 'left', maxWidth: '600px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
              {this.state.erreur.toString()}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
