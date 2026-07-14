const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

async function envoyerEmail({ destinataire, sujet, html }) {
  if (!process.env.SMTP_USER) {
    console.log(`[email] (SMTP non configuré) → ${destinataire} | ${sujet}`)
    return
  }
  try {
    await transporter.sendMail({
      from: `"AdiaraAcademy" <${process.env.SMTP_USER}>`,
      to:      destinataire,
      subject: sujet,
      html
    })
  } catch (err) {
    console.error('[email] Erreur envoi:', err.message)
  }
}

function emailBienvenuePremi(prenom, dateFin) {
  const date = new Date(dateFin).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  return {
    sujet: '🌟 Bienvenue dans AdiaraAcademy Premium !',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1A4A2E;padding:24px;text-align:center">
          <span style="color:#C8912A;font-size:22px;font-weight:bold">AdiaraAcademy</span>
        </div>
        <div style="padding:32px 24px;background:#F7F4EE">
          <h2 style="color:#1A1A1A">Félicitations, ${prenom} ! 🎉</h2>
          <p style="color:#4A5568;line-height:1.7">
            Ton compte <strong>Premium</strong> est actif jusqu'au <strong>${date}</strong>.
          </p>
          <p style="color:#4A5568">Tu as maintenant accès à :</p>
          <ul style="color:#1A4A2E;line-height:1.8">
            <li>Tous les cours de Physique et SVT</li>
            <li>Mode Révision Express (10 questions / 5 min)</li>
            <li>Parcours personnalisé IA (bientôt disponible)</li>
          </ul>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cours"
             style="display:inline-block;background:#C8912A;color:#fff;padding:12px 28px;border-radius:8px;font-weight:bold;margin-top:16px;text-decoration:none">
            Commencer à apprendre →
          </a>
        </div>
        <div style="padding:16px;text-align:center;color:#8B96A3;font-size:12px">
          AdiaraAcademy · Dakar, Sénégal
        </div>
      </div>
    `
  }
}

function emailRappelStreak(prenom, streak) {
  return {
    sujet: `🔥 Ton streak de ${streak} jours t'attend !`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1A4A2E;padding:24px;text-align:center">
          <span style="color:#C8912A;font-size:22px;font-weight:bold">AdiaraAcademy</span>
        </div>
        <div style="padding:32px 24px;background:#F7F4EE;text-align:center">
          <div style="font-size:48px;margin-bottom:12px">🔥</div>
          <h2 style="color:#1A1A1A">Bonjour ${prenom} !</h2>
          <p style="color:#4A5568;line-height:1.7">
            Tu as un streak de <strong>${streak} jours</strong> consécutifs.<br/>
            Reviens aujourd'hui pour ne pas le perdre !
          </p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cours"
             style="display:inline-block;background:#1A4A2E;color:#fff;padding:12px 28px;border-radius:8px;font-weight:bold;margin-top:16px;text-decoration:none">
            Réviser maintenant →
          </a>
        </div>
        <div style="padding:16px;text-align:center;color:#8B96A3;font-size:12px">
          AdiaraAcademy · Dakar, Sénégal
        </div>
      </div>
    `
  }
}

function emailExpirationProche(prenom, joursRestants) {
  return {
    sujet: `⚠️ Ton abonnement Premium expire dans ${joursRestants} jour(s)`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1A4A2E;padding:24px;text-align:center">
          <span style="color:#C8912A;font-size:22px;font-weight:bold">AdiaraAcademy</span>
        </div>
        <div style="padding:32px 24px;background:#F7F4EE">
          <h2 style="color:#1A1A1A">Bonjour ${prenom},</h2>
          <p style="color:#4A5568;line-height:1.7">
            Ton abonnement Premium expire dans <strong>${joursRestants} jour(s)</strong>.
            Renouvelle-le pour continuer à accéder à tous les cours.
          </p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tarifs"
             style="display:inline-block;background:#C8912A;color:#fff;padding:12px 28px;border-radius:8px;font-weight:bold;margin-top:16px;text-decoration:none">
            Renouveler mon abonnement →
          </a>
        </div>
        <div style="padding:16px;text-align:center;color:#8B96A3;font-size:12px">
          AdiaraAcademy · Dakar, Sénégal
        </div>
      </div>
    `
  }
}

module.exports = { envoyerEmail, emailBienvenuePremi, emailRappelStreak, emailExpirationProche }
