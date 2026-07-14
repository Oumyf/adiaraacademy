const express = require('express')
const PDFDocument = require('pdfkit')
const prisma = require('../prisma')
const { authentifier } = require('../middleware/auth.middleware')

const router = express.Router()

const LABEL_MATIERE = {
  MATHEMATIQUES:     'Mathématiques',
  PHYSIQUE:          'Physique',
  CHIMIE:            'Chimie',
  SCIENCES_VIE_TERRE:'Sciences de la Vie et de la Terre',
  INFORMATIQUE:      'Informatique'
}

// GET /api/certifications/:coursId — télécharge un certificat PDF
router.get('/:coursId', authentifier, async (req, res) => {
  const utilisateurId = req.utilisateur.id
  try {
    const [cours, user] = await Promise.all([
      prisma.cours.findUnique({
        where: { id: req.params.coursId },
        include: { chapitres: { select: { id: true } } }
      }),
      prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
        select: { nom: true, prenom: true }
      })
    ])

    if (!cours) return res.status(404).json({ message: 'Cours introuvable' })
    if (cours.chapitres.length === 0)
      return res.status(400).json({ message: 'Ce cours ne contient aucun chapitre.' })

    const progressions = await prisma.progression.findMany({
      where: {
        utilisateurId,
        chapitreId: { in: cours.chapitres.map(c => c.id) },
        statut: 'TERMINE'
      }
    })

    const nbTermines = progressions.length
    const nbTotal    = cours.chapitres.length
    if (nbTermines < nbTotal) {
      return res.status(403).json({
        message: `Certificat disponible après avoir terminé tous les chapitres (${nbTermines}/${nbTotal} complétés).`
      })
    }

    // Score moyen sur les quiz de ce cours
    const tentatives = await prisma.tentative.findMany({
      where: {
        utilisateurId,
        quiz: { chapitreId: { in: cours.chapitres.map(c => c.id) } }
      },
      select: { score: true }
    })
    const scoreMoyen = tentatives.length
      ? Math.round(tentatives.reduce((s, t) => s + t.score, 0) / tentatives.length)
      : null

    // ─── Génération PDF ───────────────────────────────
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 })

    const nomFichier = `certificat-${cours.titre.replace(/\s+/g, '-').toLowerCase()}.pdf`
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${nomFichier}"`)
    doc.pipe(res)

    const W = doc.page.width
    const H = doc.page.height

    // Fond crème
    doc.rect(0, 0, W, H).fill('#F7F4EE')

    // Bande verte en haut
    doc.rect(0, 0, W, 14).fill('#1A4A2E')

    // Bande or en bas
    doc.rect(0, H - 14, W, 14).fill('#C8912A')

    // Cadre double
    doc.rect(28, 28, W - 56, H - 56).lineWidth(2.5).strokeColor('#1A4A2E').stroke()
    doc.rect(34, 34, W - 68, H - 68).lineWidth(1).strokeColor('#C8912A').stroke()

    // Logo / titre
    doc.fontSize(11).fillColor('#8B96A3').font('Helvetica')
       .text('ADIARAACADEMY', 0, 52, { align: 'center', characterSpacing: 4 })

    doc.fontSize(9).fillColor('#C8912A')
       .text('adiaraacademy.sn', 0, 68, { align: 'center', characterSpacing: 1 })

    // Titre principal
    doc.fontSize(34).fillColor('#1A1A1A').font('Helvetica')
       .text('Certificat de Réussite', 0, 108, { align: 'center' })

    // Ligne décorative
    doc.moveTo(W / 2 - 80, 152).lineTo(W / 2 + 80, 152).lineWidth(1).strokeColor('#C8912A').stroke()

    doc.fontSize(13).fillColor('#4A5568').font('Helvetica')
       .text('Ce certificat atteste que', 0, 168, { align: 'center' })

    // Nom de l'élève
    doc.fontSize(36).fillColor('#1A4A2E').font('Helvetica-Bold')
       .text(`${user.prenom} ${user.nom}`, 0, 195, { align: 'center' })

    doc.fontSize(13).fillColor('#4A5568').font('Helvetica')
       .text('a complété avec succès le cours', 0, 248, { align: 'center' })

    // Nom du cours
    doc.fontSize(22).fillColor('#C8912A').font('Helvetica-Bold')
       .text(cours.titre, 60, 270, { align: 'center', width: W - 120 })

    // Matière
    const matiere = LABEL_MATIERE[cours.matiere] || cours.matiere
    doc.fontSize(12).fillColor('#8B96A3').font('Helvetica')
       .text(matiere, 0, 308, { align: 'center' })

    // Score
    if (scoreMoyen !== null) {
      doc.fontSize(12).fillColor('#276749')
         .text(`Score moyen : ${scoreMoyen}%`, 0, 328, { align: 'center' })
    }

    // Ligne décorative bas
    doc.moveTo(W / 2 - 80, 360).lineTo(W / 2 + 80, 360).lineWidth(1).strokeColor('#C8912A').stroke()

    // Date
    const date = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
    doc.fontSize(11).fillColor('#8B96A3').font('Helvetica')
       .text(`Délivré le ${date} · Dakar, Sénégal`, 0, 374, { align: 'center' })

    doc.end()
  } catch (err) {
    console.error('[certification]', err.message)
    if (!res.headersSent) res.status(500).json({ message: 'Erreur lors de la génération du certificat.' })
  }
})

module.exports = router
