import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function Layout() {
  const { utilisateur, deconnexion } = useAuth()
  const navigate = useNavigate()
  const [menuOuvert, setMenuOuvert] = useState(false)

  const handleDeconnexion = () => { deconnexion(); navigate("/"); setMenuOuvert(false) }
  const fermerMenu = () => setMenuOuvert(false)

  const lienNav = ({ isActive }) => ({
    color: isActive ? "var(--or)" : "rgba(255,255,255,.8)",
    fontWeight: "500",
    fontSize: "14px",
    padding: "6px 12px",
    borderRadius: "var(--r-sm)",
    background: isActive ? "rgba(255,255,255,.1)" : "transparent",
    transition: "all .15s ease",
  })

  const lienMobile = ({ isActive }) => ({
    color: isActive ? "var(--or)" : "rgba(255,255,255,.85)",
    fontWeight: "500",
    fontSize: "15px",
    display: "block",
  })

  const espaceUrl = utilisateur?.role === 'PARENT' ? '/espace-parent' : '/dashboard'

  const liensCommuns = (
    <>
      <NavLink to="/cours"      style={lienNav} onClick={fermerMenu}>Cours</NavLink>
      <NavLink to="/tuteurs"    style={lienNav} onClick={fermerMenu}>Profs</NavLink>
      <NavLink to="/classement" style={lienNav} onClick={fermerMenu}>Classement</NavLink>
      <NavLink to="/tarifs"     style={lienNav} onClick={fermerMenu}>Tarifs</NavLink>
    </>
  )

  const liensCommusMobile = (
    <>
      <NavLink to="/cours"      style={lienMobile} onClick={fermerMenu}>Cours</NavLink>
      <NavLink to="/tuteurs"    style={lienMobile} onClick={fermerMenu}>Profs</NavLink>
      <NavLink to="/classement" style={lienMobile} onClick={fermerMenu}>Classement</NavLink>
      <NavLink to="/tarifs"     style={lienMobile} onClick={fermerMenu}>Tarifs</NavLink>
    </>
  )

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: "var(--foret)", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
        <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }} onClick={fermerMenu}>
          <span style={{ fontFamily: "var(--serif)", fontSize: "20px", color: "#fff", letterSpacing: "-.3px" }}>
            Adiara<span style={{ color: "var(--or)" }}>Academy</span>
          </span>
        </NavLink>

        {/* Liens desktop */}
        <div className="nav-liens">
          {liensCommuns}
          {utilisateur ? (
            <>
              <NavLink to={espaceUrl} style={lienNav}>Mon espace</NavLink>
              {(utilisateur.role === "PROFESSEUR" || utilisateur.role === "ADMIN") && (
                <NavLink to="/creer-cours" style={({ isActive }) => ({
                  ...lienNav({ isActive }),
                  background: isActive ? "rgba(255,255,255,.15)" : "rgba(255,255,255,.1)",
                  border: "1px solid rgba(255,255,255,.2)",
                  fontWeight: "600",
                })}>+ Cours</NavLink>
              )}
              <span style={{ background: "rgba(200,145,42,.25)", color: "var(--or)", fontSize: "12px", fontWeight: "700", padding: "4px 10px", borderRadius: "999px" }}>
                ⭐ {utilisateur.xpTotal ?? 0} XP
              </span>
              <button onClick={handleDeconnexion} style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", padding: "6px 14px", borderRadius: "var(--r-sm)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/connexion"   style={{ color: "rgba(255,255,255,.85)", fontSize: "14px", fontWeight: "500", padding: "6px 14px" }}>Connexion</NavLink>
              <NavLink to="/inscription" style={{ background: "var(--or)", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "8px 18px", borderRadius: "var(--r-sm)" }}>Commencer</NavLink>
            </>
          )}
        </div>

        {/* Bouton burger mobile */}
        <button
          className="nav-burger"
          aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOuvert}
          onClick={() => setMenuOuvert(o => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Menu mobile déroulant */}
      <div className={`nav-mobile${menuOuvert ? " ouvert" : ""}`} role="navigation" aria-label="Navigation mobile">
        {liensCommusMobile}
        {utilisateur ? (
          <>
            <NavLink to={espaceUrl} style={lienMobile} onClick={fermerMenu}>Mon espace</NavLink>
            {(utilisateur.role === "PROFESSEUR" || utilisateur.role === "ADMIN") && (
              <NavLink to="/creer-cours" style={lienMobile} onClick={fermerMenu}>+ Créer un cours</NavLink>
            )}
            <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", marginTop: "8px", paddingTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "var(--or)", fontSize: "13px", fontWeight: "700" }}>⭐ {utilisateur.xpTotal ?? 0} XP</span>
              <button onClick={handleDeconnexion} style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", padding: "8px 16px", borderRadius: "var(--r-sm)", fontSize: "13px", cursor: "pointer" }}>
                Déconnexion
              </button>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/connexion"   style={lienMobile} onClick={fermerMenu}>Connexion</NavLink>
            <NavLink to="/inscription" style={({ isActive }) => ({ ...lienMobile({ isActive }), background: "var(--or)", padding: "10px 14px", borderRadius: "var(--r-sm)", textAlign: "center" })} onClick={fermerMenu}>Commencer</NavLink>
          </>
        )}
      </div>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ background: "var(--foret)", color: "rgba(255,255,255,.6)", textAlign: "center", padding: "1.5rem", fontSize: "13px", marginTop: "auto" }}>
        <span style={{ fontFamily: "var(--serif)", color: "rgba(255,255,255,.9)", fontSize: "15px" }}>
          Adiara<span style={{ color: "var(--or)" }}>Academy</span>
        </span>
        {" "}· Dakar, Sénégal · {new Date().getFullYear()}
        <div style={{ marginTop: "4px", fontSize: "12px" }}>Les mathématiques pour tous, du collège à l'université.</div>
      </footer>
    </div>
  )
}
