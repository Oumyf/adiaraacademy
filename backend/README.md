# AdiaraAcademy — Backend API

Plateforme éducative en mathématiques et sciences pour les élèves sénégalais (collège → université).

## Stack technique

- **Runtime** : Node.js + Express
- **Base de données** : PostgreSQL via Prisma ORM
- **Auth** : JWT (jsonwebtoken) + bcryptjs
- **Validation** : express-validator

## Structure du projet

```
backend/
├── prisma/
│   ├── schema.prisma       # Schéma complet de la BDD
│   └── seed.js             # Données initiales (badges, cours exemple)
└── src/
    ├── index.js            # Point d'entrée Express
    ├── prisma.js           # Instance Prisma partagée
    ├── middleware/
    │   └── auth.middleware.js   # JWT + contrôle des rôles
    └── routes/
        ├── auth.routes.js          # Inscription / Connexion
        ├── cours.routes.js         # CRUD cours
        ├── chapitre.routes.js      # CRUD chapitres + progression
        ├── quiz.routes.js          # Quiz + correction + XP
        └── utilisateur.routes.js   # Profil + classement
```

## Mise en place

### 1. Prérequis
- Node.js >= 18
- PostgreSQL >= 14

### 2. Installation
```bash
cd backend
npm install
```

### 3. Configuration
```bash
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL
```

### 4. Base de données
```bash
# Créer les tables
npm run db:migrate

# Insérer les données initiales (badges + cours exemple)
npm run db:seed

# Explorer la BDD visuellement (optionnel)
npm run db:studio
```

### 5. Démarrage
```bash
npm run dev     # développement (hot reload)
npm start       # production
```

## Routes API

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/inscription` | Créer un compte |
| POST | `/api/auth/connexion` | Se connecter |

### Cours
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/cours` | ❌ | Liste des cours publiés |
| GET | `/api/cours/:id` | ❌ | Détail d'un cours |
| POST | `/api/cours` | Prof/Admin | Créer un cours |
| PATCH | `/api/cours/:id/publier` | Prof/Admin | Publier/dépublier |
| DELETE | `/api/cours/:id` | Prof/Admin | Supprimer |

### Quiz
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/quiz/:id` | ✅ | Questions du quiz (sans corrections) |
| POST | `/api/quiz/:id/soumettre` | ✅ | Soumettre + correction + XP |
| POST | `/api/quiz` | Prof/Admin | Créer un quiz |

### Progression
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/progression/moi` | ✅ | Tableau de bord élève |
| GET | `/api/progression/cours/:coursId` | ✅ | Progression dans un cours |

### Utilisateurs
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/utilisateurs/profil` | ✅ | Mon profil |
| PATCH | `/api/utilisateurs/profil` | ✅ | Modifier mon profil |
| GET | `/api/utilisateurs/classement` | ❌ | Top 20 par XP |
| GET | `/api/utilisateurs` | Admin | Liste complète |

## Système XP et badges

### Calcul XP
- Chaque quiz a un `xpMax` (défaut : 50 XP)
- XP gagné = `(score / 100) × xpMax`
- Un score de 80% sur un quiz à 50 XP → 40 XP

### Badges disponibles (seed)
| Badge | Condition |
|-------|-----------|
| 🎯 Premier pas | 1 quiz complété |
| 🔥 Assidu | 7 jours de streak |
| ⭐ Centenaire | 100 XP |
| 🧮 Mathématicien | 500 XP |
| 🏆 Expert | 1000 XP |
| 💡 Quiz master | 10 quiz complétés |

## Rendu des formules mathématiques

Le contenu des chapitres utilise **Markdown + LaTeX**.
Le champ `contenu` peut contenir :

```markdown
La dérivée de $f(x) = x^2$ est $f'(x) = 2x$.

$$\int_0^1 x^2 \, dx = \frac{1}{3}$$
```

Le frontend utilise **KaTeX** pour le rendu côté client.

## Compte admin (seed)
- Email : `admin@adiaraacademy.sn`
- Mot de passe : `admin1234`

⚠️ Changer ce mot de passe en production !
