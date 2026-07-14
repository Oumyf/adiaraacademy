import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Layout from "./components/layout/Layout"

const Accueil        = lazy(() => import("./pages/Accueil"))
const Connexion      = lazy(() => import("./pages/Connexion"))
const Inscription    = lazy(() => import("./pages/Inscription"))
const Dashboard      = lazy(() => import("./pages/Dashboard"))
const Cours          = lazy(() => import("./pages/Cours"))
const CoursDetail    = lazy(() => import("./pages/CoursDetail"))
const ChapitreDetail = lazy(() => import("./pages/ChapitreDetail"))
const QuizPage       = lazy(() => import("./pages/QuizPage"))
const Classement     = lazy(() => import("./pages/Classement"))
const CreerCours     = lazy(() => import("./pages/CreerCours"))
const CreerChapitre  = lazy(() => import("./pages/CreerChapitre"))
const CreerQuiz      = lazy(() => import("./pages/CreerQuiz"))
const EditCours        = lazy(() => import("./pages/EditCours"))
const EditChapitre     = lazy(() => import("./pages/EditChapitre"))
const NotFound         = lazy(() => import("./pages/NotFound"))
const Tarifs           = lazy(() => import("./pages/Tarifs"))
const RevisionExpress  = lazy(() => import("./pages/RevisionExpress"))
const ParentDashboard  = lazy(() => import("./pages/ParentDashboard"))
const Tuteurs          = lazy(() => import("./pages/Tuteurs"))
const TuteurProfil     = lazy(() => import("./pages/TuteurProfil"))
const DevenirProf      = lazy(() => import("./pages/DevenirProf"))

const Chargement = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "4rem", color: "var(--texte-3)" }}>
    Chargement...
  </div>
)

function RoutePrivee({ children }) {
  const { utilisateur, chargement } = useAuth()
  if (chargement) return <Chargement />
  return utilisateur ? children : <Navigate to="/connexion" replace />
}

function RouteParent({ children }) {
  const { utilisateur, chargement } = useAuth()
  if (chargement) return <Chargement />
  if (!utilisateur) return <Navigate to="/connexion" replace />
  if (utilisateur.role !== "PARENT" && utilisateur.role !== "ADMIN")
    return <Navigate to="/dashboard" replace />
  return children
}

function RouteProf({ children }) {
  const { utilisateur, chargement } = useAuth()
  if (chargement) return <Chargement />
  if (!utilisateur) return <Navigate to="/connexion" replace />
  if (utilisateur.role !== "PROFESSEUR" && utilisateur.role !== "ADMIN")
    return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Suspense fallback={<Chargement />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Accueil />} />
          <Route path="connexion"   element={<Connexion />} />
          <Route path="inscription" element={<Inscription />} />
          <Route path="cours"            element={<Cours />} />
          <Route path="cours/:id"        element={<CoursDetail />} />
          <Route path="classement"       element={<Classement />} />
          <Route path="tarifs"           element={<Tarifs />} />
          <Route path="revision-express" element={<RoutePrivee><RevisionExpress /></RoutePrivee>} />
          <Route path="tuteurs"          element={<Tuteurs />} />
          <Route path="tuteurs/:id"      element={<TuteurProfil />} />
          <Route path="devenir-prof"     element={<DevenirProf />} />
          <Route path="espace-parent"    element={<RouteParent><ParentDashboard /></RouteParent>} />

          <Route path="dashboard"     element={<RoutePrivee><Dashboard /></RoutePrivee>} />
          <Route path="chapitres/:id" element={<RoutePrivee><ChapitreDetail /></RoutePrivee>} />
          <Route path="quiz/:id"      element={<RoutePrivee><QuizPage /></RoutePrivee>} />

          <Route path="creer-cours"                  element={<RouteProf><CreerCours /></RouteProf>} />
          <Route path="cours/:id/creer-chapitre"     element={<RouteProf><CreerChapitre /></RouteProf>} />
          <Route path="cours/:id/modifier"           element={<RouteProf><EditCours /></RouteProf>} />
          <Route path="chapitres/:id/creer-quiz"     element={<RouteProf><CreerQuiz /></RouteProf>} />
          <Route path="chapitres/:id/modifier"       element={<RouteProf><EditChapitre /></RouteProf>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
