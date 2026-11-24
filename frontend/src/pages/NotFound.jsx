import { Link } from 'react-router-dom'
import Icone from '../components/Icones'
import { SymbolesFlottants } from '../components/Animations'

export default function NotFound() {
  return (
    <div className="page-404">
      <SymbolesFlottants />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="quatre-cent-quatre">4<span><Icone nom="cible" taille={80} /></span>4</div>
        <h1>Cette page est introuvable</h1>
        <p>Le lien est peut-être incorrect, ou la page a été déplacée. Reviens à l'accueil ou reprends tes cours.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-foret">Retour à l'accueil</Link>
          <Link to="/cours" className="btn btn-doux">Voir les cours</Link>
        </div>
      </div>
    </div>
  )
}
