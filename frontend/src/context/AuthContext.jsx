import { createContext, useContext, useState, useEffect } from "react"
import api from "../lib/api"
const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null)
  const [chargement, setChargement] = useState(true)
  useEffect(() => {
    const token = localStorage.getItem("aa_token")
    const user  = localStorage.getItem("aa_user")
    if (token && user) {
      setUtilisateur(JSON.parse(user))
      api.defaults.headers.common["Authorization"] = "Bearer " + token
    }
    setChargement(false)
  }, [])
  const connexion = (token, user) => {
    localStorage.setItem("aa_token", token)
    localStorage.setItem("aa_user", JSON.stringify(user))
    api.defaults.headers.common["Authorization"] = "Bearer " + token
    setUtilisateur(user)
  }
  const deconnexion = () => {
    localStorage.removeItem("aa_token")
    localStorage.removeItem("aa_user")
    delete api.defaults.headers.common["Authorization"]
    setUtilisateur(null)
  }
  return <AuthContext.Provider value={{ utilisateur, connexion, deconnexion, chargement }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
