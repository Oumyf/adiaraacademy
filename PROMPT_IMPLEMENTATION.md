# Prompt d'implémentation — AdiaraAcademy

À coller dans Claude Code, à la racine du repo `adiaraacademy`, une fois que
`CLAUDE.md`, `docs/CDC_AdiaraAcademy_Complet_v4.docx` et
`docs/AdiaraAcademy_prototype.html` sont présents dans le repo.

Traiter les phases **dans l'ordre**, une par une. Ne pas passer à la phase
suivante sans avoir fait valider les critères d'acceptation de la précédente.

---

## Phase 0 — Audit avant tout code

1. Lire `CLAUDE.md` en entier et le respecter pour toute la session.
2. Lire `docs/AdiaraAcademy_prototype.html` — c'est la référence UX/design.
   Ne styliser aucun composant sans vérifier son équivalent visuel dedans.
3. Cloner/vérifier l'état du repo, lancer :
   - `cd backend && npm install && npx prisma generate`
   - `cd frontend && npm install`
4. Vérifier `GET /api/health` → `{ "status": "ok" }`.
5. Produire un rapport court : quels fichiers/routes listés dans `CLAUDE.md`
   existent réellement, lesquels manquent, tout écart avec l'état décrit.

**Critère d'acceptation** : rapport d'écart produit, backend démarre sans erreur.

---

## Phase 1 — Corriger les bugs critiques (bloquants avant toute nouvelle feature)

- `useParams` manquant dans `CoursDetail.jsx` et `ChapitreDetail.jsx` (remplacer
  tout usage de `window.location.pathname` par `useParams`).
- Rafraîchir le XP de la navbar après soumission d'un quiz
  (`GET /api/utilisateurs/profil` après le `POST /api/quiz/:id/soumettre`).
- Ajouter la logique de streak dans `POST /api/auth/connexion`.
- Page 404 + gestion d'erreur réseau générique.
- Corriger le responsive du dashboard sous 768px (colonne unique) — c'est un
  prérequis direct pour la Phase 5 (PWA).

**Critère d'acceptation** : parcours complet inscription → cours → quiz →
score fonctionne sans erreur console, dashboard utilisable sur un viewport
375px.

---

## Phase 2 — Construire les pages manquantes du prototype

Pour chaque page, reproduire fidèlement la structure/hiérarchie visuelle du
prototype HTML, mais en corrigeant systématiquement les manques identifiés
dans `CLAUDE.md` (responsive mobile-first, aria/alt/label, icônes sur les
états colorés, cleanup des timers, toasts au lieu d'`alert()`).

1. **Page Tarifs** (3 colonnes Gratuit/Premium/Établissement) — brancher sur
   `GET /api/abonnements/statut` et `POST /api/abonnements/premium`.
2. **Écran cours verrouillé** — vrai aperçu flou du contenu (CSS `filter:
   blur()` sur un extrait réel du chapitre, pas un placeholder).
3. **Badge Gratuit/Premium** sur les cartes cours du catalogue.
4. **Bannière upgrade** dans le dashboard utilisateur gratuit.
5. **Mode Révision Express** — 10 questions / 5 min, timer nettoyé
   correctement en `useEffect`.
6. **Dashboard parent** — résultats enfant, temps de révision, badges,
   bannière Match Alert (branchée sur `GET /api/alertes/enfant/:id`).
7. **Liste des profs** + **profil détaillé prof** + **page "Devenir prof"** —
   brancher sur les routes `/api/professeurs*`.

**Critère d'acceptation** : chaque page correspond visuellement à son écran
du prototype, responsive, sans régression sur les pages existantes.

---

## Phase 3 — Backend Freemium (tables 19 du CDC)

- Table `abonnements` + routes API premium.
- Intégration paiement Orange Money / Wave (abonnement premium).
- Certificat PDF à la complétion d'un cours.
- Notifications streak (email ou SMS).

**Critère d'acceptation** : un utilisateur peut souscrire, l'accès premium
se vérifie en middleware backend, un certificat PDF est généré et
téléchargeable.

---

## Phase 4 — PWA (décision produit : mobile = PWA renforcée, pas d'app native)

Avant de coder, concevoir dans le design system l'état "hors-ligne / contenu
en cache" (bannière, indicateur), absent du prototype actuel.

1. **Manifest** (`display: standalone`, icônes, splash screen aux couleurs
   `--foret`/`--or`).
2. **Service Worker (Workbox)** — cache-first pour chapitres/quiz déjà
   consultés, network-first avec fallback pour les appels dynamiques
   (classement, progression).
3. **IndexedDB** — stockage local des chapitres/quiz consultés pour révision
   hors-ligne complète.
4. **Background Sync API** — un quiz complété hors-ligne calcule le score/XP
   localement et se synchronise à la reconnexion, sans perte de progression.
5. **Web Push** — alertes streak et rappels de révision (remplace ou
   complète EmailJS/Twilio).
6. (Optionnel, plus tard) **TWA** pour publication Play Store sans code
   natif additionnel.

**Critère d'acceptation** : app installable sur Android (bannière
d'installation ou "Ajouter à l'écran d'accueil"), navigation dans un
chapitre déjà visité fonctionne en coupant le réseau, un quiz répondu
hors-ligne remonte son score au retour de connexion.

---

## Phase 5 — Établissements, IA de base, déploiement (tables 20 du CDC)

- Tables `etablissements`, `classes`, `eleves_classes`.
- Dashboards prof (contenu), parent, établissement.
- Intégration IA : résumé automatique de chapitre + parcours personnalisé
  (API Anthropic Claude, clé `ANTHROPIC_API_KEY`, feature réservée Premium
  — vérification backend).
- Déploiement frontend (Vercel) + backend/BDD (Railway).

**Critère d'acceptation** : un établissement pilote peut être onboardé de
bout en bout, résumé IA généré et affiché uniquement pour un compte premium.

---

## Phase 6 — Marketplace Profs Particuliers (tables 21 du CDC)

- 7 tables BDD profs/séances/avis/alertes.
- Job cron de détection automatique des difficultés (score moyen <50% sur
  3+ quiz d'une matière).
- Candidature → vérification manuelle → activation profil "Vérifié".
- Demande de séance → confirmation sous 24h → paiement Orange Money/Wave
  avec commission 15% calculée côté backend → avis post-séance.
- **Rappel garde-fou** : toute demande de séance pour un élève mineur doit
  être validée par le compte parent rattaché avant confirmation.

**Critère d'acceptation** : parcours complet détection → alerte → recherche
→ demande → confirmation → paiement → avis fonctionnel, commission jamais
calculée côté client.

---

## Notes transverses (valables à toutes les phases)

- Ne jamais introduire de couleur hex hardcodée hors des variables CSS.
- Toute nouvelle route sensible passe par `authentifier()` + `autoriser()`.
- Ouvrir une PR par tâche/feature, jamais de commit direct sur `main`.
- Si un écart avec `docs/CDC_AdiaraAcademy_Complet_v4.docx` est constaté en
  cours de route, le signaler plutôt que de trancher seul.
