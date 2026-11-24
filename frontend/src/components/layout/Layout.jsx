import { useEffect, useState } from "react"
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Icone, { Logo } from "../Icones"

export default function Layout() {
  const { utilisateur, deconnexion } = useAuth()
  const navigate = useNavigate()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const { pathname } = useLocation()
  const [defile, setDefile] = useState(false)
  const [hautVisible, setHautVisible] = useState(false)
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || "light")

  const basculerTheme = () => {
    const suivant = theme === "dark" ? "light" : "dark"
    const racine = document.documentElement
    racine.classList.add("theme-transition")
    racine.setAttribute("data-theme", suivant)
    try { localStorage.setItem("aa_theme", suivant) } catch { /* stockage indisponible */ }
    setTheme(suivant)
    window.setTimeout(() => racine.classList.remove("theme-transition"), 450)
  }

  useEffect(() => {
    const surDefilement = () => { setDefile(window.scrollY > 24); setHautVisible(window.scrollY > 600) }
    surDefilement()
    window.addEventListener("scroll", surDefilement, { passive: true })
    return () => window.removeEventListener("scroll", surDefilement)
  }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  const handleDeconnexion = () => { deconnexion(); navigate("/"); setMenuOuvert(false) }
  const fermerMenu = () => setMenuOuvert(false)

  const classeLien = ({ isActive }) => `nav-lien${isActive ? " active" : ""}`
  const lienMobile = ({ isActive }) => ({
    color: isActive ? "var(--or)" : "rgba(255,255,255,.88)",
    fontWeight: "600", fontSize: "15px", display: "block",
  })

  const espaceUrl = utilisateur?.role === "PARENT" ? "/espace-parent" : "/dashboard"
  const estProf = utilisateur?.role === "PROFESSEUR" || utilisateur?.role === "ADMIN"
  const estAdmin = utilisateur?.role === "ADMIN"

  const liens = [
    { to: "/cours", label: "Cours" },
    { to: "/tuteurs", label: "Profs particuliers" },
    { to: "/classement", label: "Classement" },
    { to: "/tarifs", label: "Tarifs" },
  ]

  return (
    <div className={`app${pathname === "/" ? " nav-sur-hero" : ""}${estAdmin ? " nav-staff" : ""}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className={`nav${defile ? " nav-defile" : ""}`} aria-label="Navigation principale">
        <NavLink to="/" className="nav-marque" onClick={fermerMenu}>
          <Logo hauteur={50} />
        </NavLink>

        <div className="nav-liens">
          {liens.map(l => <NavLink key={l.to} to={l.to} className={classeLien}>{l.label}</NavLink>)}
          {utilisateur ? (
            <>
              <NavLink to={espaceUrl} className={classeLien}>Mon espace</NavLink>
              {estProf && <NavLink to="/creer-cours" className={classeLien}>Créer</NavLink>}
              {estProf && <NavLink to="/generer-cours" className={classeLien}>Cours IA</NavLink>}
              {estAdmin && <NavLink to="/admin/ambassadeurs" className={classeLien}>Ambassadeurs</NavLink>}
              <span className="nav-xp" title="Points d'expérience">
                <Icone nom="etoile" taille={14} /> {utilisateur.xpTotal ?? 0} XP
              </span>
              <button className="nav-sortie" onClick={handleDeconnexion}>Déconnexion</button>
            </>
          ) : (
            <>
              <NavLink to="/connexion" className={classeLien}>Connexion</NavLink>
              <NavLink to="/inscription" className="nav-cta" style={{ marginLeft: 6 }}>Commencer</NavLink>
            </>
          )}
        </div>

        <div className="nav-droite">
          <button type="button" className="bascule-theme" onClick={basculerTheme} aria-label={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"} title={theme === "dark" ? "Thème clair" : "Thème sombre"}>
            <Icone key={theme} nom={theme === "dark" ? "soleil" : "lune"} taille={18} />
          </button>
        <button className="nav-burger" aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOuvert} onClick={() => setMenuOuvert(o => !o)}>
          <Icone nom={menuOuvert ? "fermer" : "menu"} />
        </button>
        </div>
      </nav>

      <div className={`nav-mobile${menuOuvert ? " ouvert" : ""}`} role="navigation" aria-label="Navigation mobile">
        {liens.map(l => <NavLink key={l.to} to={l.to} style={lienMobile} onClick={fermerMenu}>{l.label}</NavLink>)}
        {utilisateur ? (
          <>
            <NavLink to={espaceUrl} style={lienMobile} onClick={fermerMenu}>Mon espace</NavLink>
            {estProf && <NavLink to="/creer-cours" style={lienMobile} onClick={fermerMenu}>Créer un cours</NavLink>}
            {estProf && <NavLink to="/generer-cours" style={lienMobile} onClick={fermerMenu}>Cours par IA</NavLink>}
            {estAdmin && <NavLink to="/admin/ambassadeurs" style={lienMobile} onClick={fermerMenu}>Ambassadeurs</NavLink>}
            <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", marginTop: 8, paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="nav-xp"><Icone nom="etoile" taille={14} /> {utilisateur.xpTotal ?? 0} XP</span>
              <button className="nav-sortie" onClick={handleDeconnexion}>Déconnexion</button>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/connexion" style={lienMobile} onClick={fermerMenu}>Connexion</NavLink>
            <NavLink to="/inscription" className="nav-cta" style={{ textAlign: "center" }} onClick={fermerMenu}>Commencer gratuitement</NavLink>
          </>
        )}
      </div>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {hautVisible && (
        <button type="button" className="retour-haut" aria-label="Revenir en haut de la page" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span style={{ display: "inline-flex", transform: "rotate(-90deg)" }}><Icone nom="fleche" taille={18} /></span>
        </button>
      )}

      <footer className="pied">
        <div className="pied-int">
          <div>
            <div className="nav-marque" style={{ marginBottom: 12 }}><Logo hauteur={44} /></div>
            <p style={{ fontSize: 14, maxWidth: "34ch" }}>Maths, Physique, Chimie, SVT et Informatique, du collège à l'université, pensés pour le programme sénégalais.</p>
          </div>
          <div>
            <h4>Apprendre</h4>
            <Link to="/cours">Tous les cours</Link>
            <Link to="/revision-express">Révision express</Link>
            <Link to="/classement">Classement</Link>
          </div>
          <div>
            <h4>Profs particuliers</h4>
            <Link to="/tuteurs">Trouver un prof</Link>
            <Link to="/devenir-prof">Devenir prof</Link>
            <Link to="/tarifs">Tarifs</Link>
          </div>
          <div>
            <h4>Compte</h4>
            <Link to="/connexion">Connexion</Link>
            <Link to="/inscription">Inscription</Link>
            <Link to="/espace-parent">Espace parent</Link>
          </div>
        </div>
        <div className="pied-base">Dakar, Sénégal · {new Date().getFullYear()} · AdiaraAcademy</div>
      </footer>
    </div>
  )
}
