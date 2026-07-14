require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { rateLimit } = require('express-rate-limit')

const authRoutes        = require('./routes/auth.routes')
const coursRoutes       = require('./routes/cours.routes')
const { chapitreRouter, progressionRouter } = require('./routes/chapitre.routes')
const quizRoutes        = require('./routes/quiz.routes')
const utilisateurRoutes = require('./routes/utilisateur.routes')
const abonnementRoutes    = require('./routes/abonnement.routes')
const certificationRoutes = require('./routes/certification.routes')
const notificationRoutes  = require('./routes/notification.routes')
const parentRoutes        = require('./routes/parent.routes')
const professeurRoutes    = require('./routes/professeur.routes')

const app = express()

const limiteurAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth',         limiteurAuth, authRoutes)
app.use('/api/cours',        coursRoutes)
app.use('/api/chapitres',    chapitreRouter)
app.use('/api/quiz',         quizRoutes)
app.use('/api/progression',  progressionRouter)
app.use('/api/utilisateurs', utilisateurRoutes)
app.use('/api/abonnements',    abonnementRoutes)
app.use('/api/certifications', certificationRoutes)
app.use('/api/notifications',  notificationRoutes)
app.use('/api/parents',        parentRoutes)
app.use('/api/professeurs',    professeurRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'AdiaraAcademy API', version: '1.0.0' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Erreur interne du serveur' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('AdiaraAcademy API demarree sur http://localhost:' + PORT)
})
