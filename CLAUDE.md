# CLAUDE.md — AdiaraAcademy

Ce fichier est lu par Claude Code au début de chaque session sur ce repo.
Il fait autorité sur les conventions ; en cas de doute, il prime sur l'intuition du modèle.

## Contexte projet

AdiaraAcademy est une plateforme éducative gratuite/freemium (maths, physique, chimie, SVT)
pour élèves sénégalais du collège à l'université. Modèle à 4 flux de revenus : freemium élève,
abonnement établissement (B2B), pack Bac, marketplace profs particuliers (commission 10%).

- Repository : github.com/Oumyf/adiaraacademy
- Version CDC de référence : `docs/CDC_AdiaraAcademy_Complet_v4.docx`
- Prototype visuel de référence : `docs/AdiaraAcademy_prototype.html` (15 écrans, source de vérité UX)
- Équipe : Adiaratou Oumy Fall (lead technique — API, BDD, IA, freemium, déploiement backend),
  Souleymane Ndiaye (fullstack — pages, responsive, paiement, déploiement frontend),
  Cherif Diouf (conseil architecture / revue)

## Stack

| Couche | Techno |
|---|---|
| Frontend | React 18 + Vite, React Router v6, Axios, KaTeX, react-markdown + remark-math + rehype-katex |
| Backend | Node.js 20 + Express 4, Prisma ORM, JWT, bcryptjs, express-validator |
| BDD | PostgreSQL 14+ (UUID, JSONB pour options QCM/conditions badges/tags profs) |
| IA (Phase 2) | API Anthropic Claude — résumé de cours, parcours personnalisé |
| Paiement (Phase 2/4) | Orange Money / Wave |
| Notifications | EmailJS / Twilio SMS (Phase 2), Web Push (Phase PWA) |
| Déploiement | Vercel (frontend) + Railway (API + Postgres) |

## Conventions — ne jamais dévier sans validation explicite

- **Langue** : variables et commentaires en français. Identifiants de code en anglais/français
  cohérent avec l'existant (`utilisateurs`, `cours`, `chapitres`... déjà posé dans le schema Prisma).
- **Nommage** : camelCase pour variables/fonctions, PascalCase pour composants React.
- **Appels API** : toujours via `frontend/src/lib/api.js` (Axios + intercepteur 401). Jamais de
  `fetch()` direct dans un composant.
- **Couleurs** : toujours via les variables CSS du design system ci-dessous. Jamais de valeur hex
  hardcodée dans un composant.
- **Vérification Premium** : toujours en middleware backend. Ne jamais fier un accès premium à un
  état frontend seul (localStorage, contexte React) — un utilisateur pourrait le falsifier.
- **Commission profs particuliers** : calcul fait exclusivement côté backend.
- **Protection des mineurs** : toute demande de séance avec un prof particulier doit être validée
  par un compte parent rattaché avant confirmation. Non négociable, contexte légal Sénégal.
- **Sécurité** : mots de passe hashés bcrypt 12 rounds. JWT expire à 7 jours. Toute route sensible
  passe par `authentifier()` + `autoriser()`. `.env` jamais commité (`.env.example` comme modèle).
- **Git** : branches `main` (stable) / `develop` / `feature/nom-tache` / `fix/nom-bug`. Commits
  `feat:` / `fix:` / `refactor:` / `docs:` / `style:` / `chore:`. Toute modification passe en PR
  reviewée par l'autre développeur avant merge sur `main`.

## Design system (référence : `docs/AdiaraAcademy_prototype.html`)

Avant de créer un composant React, toujours vérifier s'il existe déjà un équivalent visuel dans
le prototype HTML — c'est la source de vérité UX validée par l'équipe, pas une improvisation.

```
--foret       #1A4A2E   couleur principale — header, boutons primaires, accents forts
--foret-pale  #EAF2EC   fonds de cartes, états hover
--or          #C8912A   accent doré — XP, badges, CTA, badge Premium
--or-pale     #FEF6E4   fond doux éléments XP et Premium
--terre       #A8533A   accent module Profs Particuliers — distinct du Premium
--sable       #F7F4EE   fond de page global
--blanc       #FFFFFF   fond des cartes et panneaux
--texte       #1A1A1A   texte principal
--texte-2     #4A5568   texte secondaire, descriptions
--texte-3     #8B96A3   texte tertiaire, placeholders
--erreur      #C53030   erreurs, réponses incorrectes, cours verrouillé
--succes      #276749   succès, réponses correctes, badge Gratuit, prof vérifié
--serif       Instrument Serif — titres h1/h2/h3, scores, XP, prix
--sans        Plus Jakarta Sans — corps de texte, labels, boutons, formulaires
```

## Dette identifiée dans le prototype (à corriger en migrant vers React, pas à reproduire)

- Le prototype n'a quasi aucun `@media` — redessiner en mobile-first, pas juste porter tel quel.
- Aucun `aria-*`/`alt`/`<label>` dans le prototype — les ajouter systématiquement dans les
  composants réels (formulaires, icônes SVG, quiz).
- Le code couleur seul (vert/rouge) sur les réponses de quiz doit être doublé d'une icône
  check/croix (accessibilité daltonisme).
- Les timers (`setInterval` en mode Révision Express) doivent être nettoyés dans un cleanup
  `useEffect` pour éviter les fuites mémoire en React.
- Remplacer les `alert()` du prototype par un composant toast/modal cohérent avec le design system.
- L'écran "cours verrouillé" doit montrer un véritable aperçu flou du contenu (voir CDC T13),
  pas seulement une icône + liste de features.

## État actuel du code (à vérifier avant toute nouvelle feature)

- Schema Prisma : 9 tables validées et migrées.
- Pages React livrées : Accueil, Connexion, Inscription, Dashboard, Cours, CoursDetail,
  ChapitreDetail, QuizPage, Classement.
- Pages du prototype **pas encore codées** : Tarifs, Écran verrouillé, Tutors, TutorProfile,
  BecomeTutor, ParentDashboard, Express.
- Bugs connus prioritaires (voir `docs/CDC...` §8.2) : `useParams` manquant dans `CoursDetail.jsx`
  et `ChapitreDetail.jsx` ; XP navbar ne se rafraîchit pas après quiz ; streak non incrémenté
  côté backend ; dashboard cassé en mobile.

## Garde-fous produits/juridiques (contexte Sénégal — CDC §15)

- Statut fiscal des commissions profs à clarifier avec un comptable local avant lancement — ne
  jamais présenter la commission comme définitive dans le code ou les CGU générées.
- Orange Money et Wave priorisés sur la carte bancaire.
- Vérification diplôme des profs particuliers : manuelle par l'équipe, pas de check automatisé.
- Zone présentiel de lancement : Dakar, Thiès, Saint-Louis, Mbour uniquement.
