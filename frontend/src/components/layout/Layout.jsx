import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function Layout() {
  const { utilisateur, deconnexion } = useAuth()
  const navigate = useNavigate()
  const handleDeconnexion = () => { deconnexion(); navigate("/") }
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: "var(--foret)", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", position: "sticky", top: 0, zIndex: 100 }}>
        <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: "20px", color: "#fff" }}>
            Adiara<span style={{ color: "var(--or)" }}>Academy</span>
          </span>
        </NavLink>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <NavLink to="/cours" style={({ isActive }) => ({ color: isActive ? "var(--or)" : "rgba(255,255,255,.8)", fontWeight: "500", fontSize: "14px", padding: "6px 12px" })}>Cours</NavLink>
          <NavLink to="/classement" style={({ isActive }) => ({ color: isActive ? "var(--or)" : "rgba(255,255,255,.8)", fontWeight: "500", fontSize: "14px", padding: "6px 12px" })}>Classement</NavLink>
          {utilisateur ? (
            <>
              <NavLink to="/dashboard" style={({ isActive }) => ({ color: isActive ? "var(--or)" : "rgba(255,255,255,.8)", fontWeight: "500", fontSize: "14px", padding: "6px 12px" })}>Mon espace</NavLink>
              <button onClick={handleDeconnexion} style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", padding: "6px 14px", borderRadius: "var(--r-sm)", fontSize: "13px", cursor: "pointer" }}>Deconnexion</button>
            </>
          ) : (
            <>
              <NavLink to="/connexion" style={{ color: "rgba(255,255,255,.85)", fontSize: "14px", padding: "6px 14px" }}>Connexion</NavLink>
              <NavLink to="/inscription" style={{ background: "var(--or)", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "8px 18px", borderRadius: "var(--r-sm)" }}>Commencer</NavLink>
            </>
          )}
        </div>
      </nav>
      <main style={{ flex: 1 }}><Outlet /></main>
      <footer style={{ background: "var(--foret)", color: "rgba(255,255,255,.6)", textAlign: "center", padding: "1.5rem", fontSize: "13px" }}>
        <span style={{ fontFamily: "var(--serif)", color: "rgba(255,255,255,.9)" }}>Adiara<span style={{ color: "var(--or)" }}>Academy</span></span> - Dakar, Senegal
      </footer>
    </div>
  )
}
