import Icone from './Icones'

// Mise en page commune connexion / inscription : panneau d'accueil + formulaire.
export default function AuthLayout({ titre, sousTitre, children, pied }) {
  return (
    <div className="auth">
      <aside className="auth-cote" aria-hidden="false">
        <div className="auth-cote-int">
          <h2>Apprendre, c'est comme le football : on progresse en s'entraînant chaque jour.</h2>
          <ul>
            <li><Icone nom="cible" taille={20} /><span>Des quiz qui s'adaptent à ton niveau</span></li>
            <li><Icone nom="flamme" taille={20} /><span>Des séries de jours et des points d'expérience</span></li>
            <li><Icone nom="etincelle" taille={20} /><span>Un tuteur IA qui t'explique tes erreurs</span></li>
          </ul>
        </div>
      </aside>
      <section className="auth-form">
        <div className="auth-carte">
          <h1>{titre}</h1>
          <p className="auth-sous">{sousTitre}</p>
          {children}
          {pied && <p className="auth-pied">{pied}</p>}
        </div>
      </section>
    </div>
  )
}
