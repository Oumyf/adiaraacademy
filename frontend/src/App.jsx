import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Layout from "./components/layout/Layout"
import Accueil from "./pages/Accueil"
import Connexion from "./pages/Connexion"
import Inscription from "./pages/Inscription"
import Dashboard from "./pages/Dashboard"
import Cours from "./pages/Cours"
import CoursDetail from "./pages/CoursDetail"
import ChapitreDetail from "./pages/ChapitreDetail"
import QuizPage from "./pages/QuizPage"
import Classement from "./pages/Classement"

function RoutePrivee({ children }) {
  const { utilisateur, chargement } = useAuth()
  if (chargement) return <div style={{ display:"flex", justifyContent:"center", padding:"4rem", color:"var(--texte-3)" }}>Chargement...</div>
  return utilisateur ? children : <Navigate to="/connexion" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Accueil />} />
        <Route path="connexion"   element={<Connexion />} />
        <Route path="inscription" element={<Inscription />} />
        <Route path="cours"       element={<Cours />} />
        <Route path="cours/:id"   element={<CoursDetail />} />
        <Route path="classement"  element={<Classement />} />
        <Route path="dashboard"     element={<RoutePrivee><Dashboard /></RoutePrivee>} />
        <Route path="chapitres/:id" element={<RoutePrivee><ChapitreDetail /></RoutePrivee>} />
        <Route path="quiz/:id"      element={<RoutePrivee><QuizPage /></RoutePrivee>} />
      </Route>
    </Routes>
  )
}
