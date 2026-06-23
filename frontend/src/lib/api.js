import axios from "axios"
const api = axios.create({ baseURL: "/api", headers: { "Content-Type": "application/json" } })
api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem("aa_token")
    localStorage.removeItem("aa_user")
    window.location.href = "/connexion"
  }
  return Promise.reject(err)
})
export default api
