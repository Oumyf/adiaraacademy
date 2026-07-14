const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('Seed AdiaraAcademy...')

  // ─── Badges ──────────────────────────────────────
  const badges = [
    { nom: 'Premier pas',   description: 'Premier quiz complété',  icone: '🎯', condition: { type: 'quiz_complete', valeur: 1 } },
    { nom: 'Assidu',        description: '7 jours de streak',      icone: '🔥', condition: { type: 'streak',        valeur: 7 } },
    { nom: 'Centenaire',    description: '100 XP accumulés',       icone: '⭐', condition: { type: 'xp_total',      valeur: 100 } },
    { nom: 'Mathematicien', description: '500 XP accumulés',       icone: '🧮', condition: { type: 'xp_total',      valeur: 500 } },
    { nom: 'Expert',        description: '1000 XP accumulés',      icone: '🏆', condition: { type: 'xp_total',      valeur: 1000 } },
    { nom: 'Quiz master',   description: '10 quiz complétés',      icone: '💡', condition: { type: 'quiz_complete', valeur: 10 } },
  ]
  for (const b of badges) {
    await prisma.badge.upsert({
      where: { nom: b.nom },
      update: { icone: b.icone, description: b.description },
      create: b
    })
  }
  console.log('✓ Badges')

  // ─── Mots de passe ───────────────────────────────
  const [hashAdmin, hashProf, hashEleve] = await Promise.all([
    bcrypt.hash('admin1234', 12),
    bcrypt.hash('prof1234', 12),
    bcrypt.hash('eleve1234', 12),
  ])

  // ─── Utilisateurs ────────────────────────────────
  await prisma.utilisateur.upsert({
    where: { email: 'admin@adiaraacademy.sn' },
    update: {},
    create: { nom: 'Admin', prenom: 'AdiaraAcademy', email: 'admin@adiaraacademy.sn', motDePasse: hashAdmin, role: 'ADMIN', niveau: 'UNIVERSITE' }
  })

  const prof = await prisma.utilisateur.upsert({
    where: { email: 'prof@adiaraacademy.sn' },
    update: {},
    create: { nom: 'Diallo', prenom: 'Moussa', email: 'prof@adiaraacademy.sn', motDePasse: hashProf, role: 'PROFESSEUR', niveau: 'LYCEE', ecole: 'Lycée Seydou Nourou Tall', xpTotal: 0, streak: 0 }
  })

  const eleve1 = await prisma.utilisateur.upsert({
    where: { email: 'eleve@adiaraacademy.sn' },
    update: {},
    create: { nom: 'Sow', prenom: 'Aminata', email: 'eleve@adiaraacademy.sn', motDePasse: hashEleve, role: 'ELEVE', niveau: 'LYCEE', classe: 'Terminale S', ecole: 'Lycée Blaise Diagne', xpTotal: 75, streak: 3 }
  })

  await prisma.utilisateur.upsert({
    where: { email: 'oumar@adiaraacademy.sn' },
    update: {},
    create: { nom: 'Ndiaye', prenom: 'Oumar', email: 'oumar@adiaraacademy.sn', motDePasse: hashEleve, role: 'ELEVE', niveau: 'LYCEE', classe: 'Terminale S', xpTotal: 200, streak: 7 }
  })

  await prisma.utilisateur.upsert({
    where: { email: 'fatou@adiaraacademy.sn' },
    update: {},
    create: { nom: 'Dieng', prenom: 'Fatou', email: 'fatou@adiaraacademy.sn', motDePasse: hashEleve, role: 'ELEVE', niveau: 'LYCEE', classe: '1ère S', xpTotal: 120, streak: 5 }
  })

  await prisma.utilisateur.upsert({
    where: { email: 'ibrahima@adiaraacademy.sn' },
    update: {},
    create: { nom: 'Ba', prenom: 'Ibrahima', email: 'ibrahima@adiaraacademy.sn', motDePasse: hashEleve, role: 'ELEVE', niveau: 'LYCEE', classe: 'Terminale S', xpTotal: 340, streak: 12 }
  })

  await prisma.utilisateur.upsert({
    where: { email: 'mariama@adiaraacademy.sn' },
    update: {},
    create: { nom: 'Fall', prenom: 'Mariama', email: 'mariama@adiaraacademy.sn', motDePasse: hashEleve, role: 'ELEVE', niveau: 'COLLEGE', classe: '3ème', xpTotal: 55, streak: 2 }
  })

  await prisma.utilisateur.upsert({
    where: { email: 'cheikh@adiaraacademy.sn' },
    update: {},
    create: { nom: 'Mbaye', prenom: 'Cheikh', email: 'cheikh@adiaraacademy.sn', motDePasse: hashEleve, role: 'ELEVE', niveau: 'UNIVERSITE', classe: 'L1 Maths-Info', xpTotal: 510, streak: 20 }
  })

  // Élève premium pour tester l'accès au contenu Premium
  await prisma.utilisateur.upsert({
    where: { email: 'premium@adiaraacademy.sn' },
    update: { estPremium: true },
    create: { nom: 'Diallo', prenom: 'Aïssatou', email: 'premium@adiaraacademy.sn', motDePasse: hashEleve, role: 'ELEVE', niveau: 'LYCEE', classe: 'Terminale S', xpTotal: 180, streak: 8, estPremium: true }
  })
  console.log('✓ Utilisateurs')

  // ─── Cours + Chapitres + Quiz + Questions ────────
  // Supprimer dans le bon ordre (FK constraints)
  await prisma.tentative.deleteMany()
  await prisma.progression.deleteMany()
  await prisma.badgeUtilisateur.deleteMany()
  await prisma.cours.deleteMany({ where: { auteurId: prof.id } })

  // ══════════════════════════════════════════════════
  // 1. MATHÉMATIQUES — Algèbre
  // ══════════════════════════════════════════════════
  const coursMaths = await prisma.cours.create({ data: {
    titre: 'Algèbre — Équations et inéquations',
    description: 'Maîtrisez la résolution des équations et inéquations du premier et second degré, fondement de toutes les mathématiques au lycée.',
    matiere: 'MATHEMATIQUES', niveau: 'LYCEE', classe: 'Seconde',
    publie: true, auteurId: prof.id,
    chapitres: { create: [
      {
        titre: 'Les équations du premier degré',
        ordre: 1, xpObtenu: 20,
        contenu: String.raw`# Les équations du premier degré

Une **équation du premier degré** à une inconnue est de la forme :

$$ax + b = 0 \quad (a \neq 0)$$

## Méthode de résolution

Pour résoudre $ax + b = 0$ :

1. Isoler le terme en $x$ : $ax = -b$
2. Diviser par $a$ : $x = -\dfrac{b}{a}$

## Exemples

### Exemple 1
Résoudre $3x + 6 = 0$

$$3x = -6 \implies x = -2$$

**Vérification :** $3 \times (-2) + 6 = -6 + 6 = 0$ ✓

### Exemple 2
Résoudre $2x - 5 = x + 3$

$$2x - x = 3 + 5 \implies x = 8$$

## Équations avec fractions

$$\frac{x+1}{2} = \frac{x-1}{3}$$

Multiplier par le PPCM (6) :

$$3(x+1) = 2(x-1) \implies 3x + 3 = 2x - 2 \implies x = -5$$

> **Attention :** Toujours vérifier sa solution en la substituant dans l'équation initiale.`,
        quiz: { create: [{
          titre: 'Quiz — Équations du 1er degré', type: 'QCM', xpMax: 50, dureMin: 5,
          questions: { create: [
            {
              enonce: 'Quelle est la solution de l\'équation $4x - 8 = 0$ ?',
              options: ['$x = -2$', '$x = 2$', '$x = 4$', '$x = 0$'],
              reponseCorrecte: '$x = 2$',
              explication: '$4x = 8 \\implies x = 2$',
              difficulte: 'FACILE', ordre: 1
            },
            {
              enonce: 'Résoudre $3x + 7 = x - 1$',
              options: ['$x = -4$', '$x = 4$', '$x = 3$', '$x = -3$'],
              reponseCorrecte: '$x = -4$',
              explication: '$3x - x = -1 - 7 \\implies 2x = -8 \\implies x = -4$',
              difficulte: 'MOYEN', ordre: 2
            },
            {
              enonce: 'Si $ax + b = 0$ avec $a \\neq 0$, alors $x = ?$',
              options: ['$x = a/b$', '$x = -b/a$', '$x = b/a$', '$x = -a/b$'],
              reponseCorrecte: '$x = -b/a$',
              explication: 'On isole x : $ax = -b$, donc $x = -b/a$.',
              difficulte: 'MOYEN', ordre: 3
            },
            {
              enonce: 'L\'équation $5(x - 2) = 3(x + 4)$ a pour solution :',
              options: ['$x = 11$', '$x = -1$', '$x = 7$', '$x = 13$'],
              reponseCorrecte: '$x = 11$',
              explication: '$5x - 10 = 3x + 12 \\implies 2x = 22 \\implies x = 11$',
              difficulte: 'MOYEN', ordre: 4
            }
          ]}
        }]}
      },
      {
        titre: 'Les inéquations du premier degré',
        ordre: 2, xpObtenu: 25,
        contenu: String.raw`# Les inéquations du premier degré

Une **inéquation** est une inégalité contenant une inconnue. On cherche l'ensemble des valeurs qui la vérifient.

## Règles essentielles

| Opération | Effet sur le signe |
|---|---|
| Ajouter/soustraire un même nombre | Le signe **ne change pas** |
| Multiplier/diviser par un **positif** | Le signe **ne change pas** |
| Multiplier/diviser par un **négatif** | Le signe **s'inverse** |

## Exemple fondamental

Résoudre $-2x + 4 > 0$

$$-2x > -4$$

On divise par **-2** (négatif) → le signe s'inverse :

$$x < 2$$

**Solution :** $x \in ]-\infty\, ;\, 2[$

## Représentation sur la droite numérique

Pour $x < 2$ : ←●○ (cercle ouvert en 2, flèche vers la gauche)

> **Rappel :** Crochet fermé $]$ ou $[$ = exclu, crochet $[$ ou $]$ = inclus.

## Exercice type

Résoudre $3x - 1 \leq 2x + 5$

$$3x - 2x \leq 5 + 1 \implies x \leq 6$$

**Solution :** $x \in ]-\infty\, ;\, 6]$`,
        quiz: { create: [{
          titre: 'Quiz — Inéquations', type: 'QCM', xpMax: 50, dureMin: 5,
          questions: { create: [
            {
              enonce: 'Résoudre $2x - 6 > 0$. La solution est :',
              options: ['$x < 3$', '$x > 3$', '$x > -3$', '$x < -3$'],
              reponseCorrecte: '$x > 3$',
              explication: '$2x > 6 \\implies x > 3$',
              difficulte: 'FACILE', ordre: 1
            },
            {
              enonce: 'Résoudre $-3x \\leq 9$. On obtient :',
              options: ['$x \\leq -3$', '$x \\geq -3$', '$x \\leq 3$', '$x \\geq 3$'],
              reponseCorrecte: '$x \\geq -3$',
              explication: 'Division par -3 (négatif) : le sens s\'inverse. $x \\geq -3$.',
              difficulte: 'MOYEN', ordre: 2
            },
            {
              enonce: 'Quand on divise une inégalité par un nombre négatif, que se passe-t-il ?',
              options: ['Rien ne change', 'Le signe de l\'inégalité s\'inverse', 'L\'inégalité devient une égalité', 'L\'inégalité n\'a plus de solution'],
              reponseCorrecte: 'Le signe de l\'inégalité s\'inverse',
              explication: 'C\'est la règle fondamentale des inéquations : diviser ou multiplier par un négatif inverse le sens.',
              difficulte: 'FACILE', ordre: 3
            }
          ]}
        }]}
      }
    ]}
  }})

  // ══════════════════════════════════════════════════
  // 2. PHYSIQUE — Mécanique
  // ══════════════════════════════════════════════════
  const coursPhysique = await prisma.cours.create({ data: {
    titre: 'Mécanique — Les lois de Newton',
    description: 'Comprendre les trois lois fondamentales de la mécanique newtonienne et leur application aux mouvements des objets.',
    matiere: 'PHYSIQUE', niveau: 'LYCEE', classe: 'Première S',
    publie: true, premium: true, auteurId: prof.id,
    chapitres: { create: [
      {
        titre: 'Les forces et leur représentation',
        ordre: 1, xpObtenu: 20,
        contenu: String.raw`# Les forces et leur représentation

## Qu'est-ce qu'une force ?

Une **force** est une action exercée par un objet sur un autre. Elle peut :
- Modifier la vitesse (accélérer, freiner)
- Modifier la direction du mouvement
- Déformer un objet

## Caractéristiques d'une force

Une force est un **vecteur** caractérisé par :

| Caractéristique | Description |
|---|---|
| **Point d'application** | Où la force s'exerce |
| **Direction** | L'axe selon lequel elle agit |
| **Sens** | La flèche de la direction |
| **Intensité** | Sa valeur en Newton (N) |

## Les forces usuelles

### Le poids $\vec{P}$
$$\vec{P} = m\vec{g}$$
- Direction : verticale
- Sens : vers le bas (centre de la Terre)
- Intensité : $P = mg$ (avec $g \approx 10\ \text{N/kg}$ au Sénégal)

### La réaction normale $\vec{N}$
Exercée par le support sur l'objet, perpendiculaire à la surface.

### La force de frottement $\vec{f}$
S'oppose au mouvement ou à la tendance au mouvement.

## Diagramme des forces (bilan de forces)

Pour un livre posé sur une table :
- $\vec{P}$ vers le bas
- $\vec{N}$ vers le haut
- À l'équilibre : $\vec{P} + \vec{N} = \vec{0}$`,
        quiz: { create: [{
          titre: 'Quiz — Les forces', type: 'QCM', xpMax: 50, dureMin: 5,
          questions: { create: [
            {
              enonce: 'Un objet de masse $m = 2\ \\text{kg}$ est posé sur une table. Calculer son poids (avec $g = 10\ \\text{N/kg}$).',
              options: ['$P = 5\ \\text{N}$', '$P = 20\ \\text{N}$', '$P = 2\ \\text{N}$', '$P = 10\ \\text{N}$'],
              reponseCorrecte: '$P = 20\ \\text{N}$',
              explication: '$P = mg = 2 \\times 10 = 20\ \\text{N}$',
              difficulte: 'FACILE', ordre: 1
            },
            {
              enonce: 'La réaction normale d\'un plan horizontal est toujours :',
              options: ['Horizontale', 'Verticale vers le bas', 'Perpendiculaire à la surface', 'Parallèle au mouvement'],
              reponseCorrecte: 'Perpendiculaire à la surface',
              explication: 'La réaction normale est par définition perpendiculaire (normale) à la surface de contact.',
              difficulte: 'FACILE', ordre: 2
            },
            {
              enonce: 'Un objet est en équilibre sur un plan horizontal. Quelle relation lie $\\vec{P}$ et $\\vec{N}$ ?',
              options: ['$\\vec{P} = \\vec{N}$', '$\\vec{P} + \\vec{N} = \\vec{0}$', '$P > N$', '$P < N$'],
              reponseCorrecte: '$\\vec{P} + \\vec{N} = \\vec{0}$',
              explication: 'Pour l\'équilibre, la somme de toutes les forces est nulle : $\\vec{P} + \\vec{N} = \\vec{0}$.',
              difficulte: 'MOYEN', ordre: 3
            }
          ]}
        }]}
      },
      {
        titre: 'Les trois lois de Newton',
        ordre: 2, xpObtenu: 30,
        contenu: String.raw`# Les trois lois de Newton

## 1ère loi — Principe d'inertie

> Tout corps persévère dans son état de repos ou de mouvement rectiligne uniforme si les forces qui s'exercent sur lui se compensent.

$$\sum \vec{F} = \vec{0} \iff \text{mouvement rectiligne uniforme (ou repos)}$$

## 2ème loi — Loi fondamentale de la dynamique

> La somme des forces appliquées à un objet est égale au produit de sa masse par son accélération.

$$\sum \vec{F} = m\vec{a}$$

**Unités :** F en Newton (N), m en kilogramme (kg), a en m/s²

### Application

Une voiture de 1000 kg accélère sous une force de 2000 N. Quelle est son accélération ?

$$a = \frac{\sum F}{m} = \frac{2000}{1000} = 2\ \text{m/s}^2$$

## 3ème loi — Principe des actions réciproques

> Si un objet A exerce une force sur B, alors B exerce sur A une force **égale, opposée et de même droite d'action**.

$$\vec{F}_{A \to B} = -\vec{F}_{B \to A}$$

> **Attention :** Ces deux forces s'exercent sur deux objets **différents** — elles ne se compensent donc pas !`,
        quiz: { create: [{
          titre: 'Quiz — Lois de Newton', type: 'QCM', xpMax: 60, dureMin: 8,
          questions: { create: [
            {
              enonce: 'Une bille roule en ligne droite à vitesse constante sur un sol sans frottement. Quelle loi décrit ce comportement ?',
              options: ['2ème loi de Newton', '3ème loi de Newton', '1ère loi de Newton (inertie)', 'Loi de Hooke'],
              reponseCorrecte: '1ère loi de Newton (inertie)',
              explication: 'Si la somme des forces est nulle, le mouvement est rectiligne uniforme — c\'est le principe d\'inertie.',
              difficulte: 'FACILE', ordre: 1
            },
            {
              enonce: 'Une force de 500 N est appliquée à un objet de 25 kg. Son accélération est :',
              options: ['$a = 12500\ \\text{m/s}^2$', '$a = 20\ \\text{m/s}^2$', '$a = 0,05\ \\text{m/s}^2$', '$a = 475\ \\text{m/s}^2$'],
              reponseCorrecte: '$a = 20\ \\text{m/s}^2$',
              explication: '$a = F/m = 500/25 = 20\ \\text{m/s}^2$',
              difficulte: 'FACILE', ordre: 2
            },
            {
              enonce: 'Selon la 3ème loi de Newton, si la Terre attire un objet avec une force de 60 N, alors :',
              options: ['L\'objet n\'exerce aucune force sur la Terre', 'L\'objet attire la Terre avec 30 N', 'L\'objet attire la Terre avec 60 N', 'L\'objet repousse la Terre avec 60 N'],
              reponseCorrecte: 'L\'objet attire la Terre avec 60 N',
              explication: 'Les forces d\'interaction sont égales et opposées : si la Terre attire l\'objet avec 60 N, l\'objet attire la Terre avec 60 N.',
              difficulte: 'MOYEN', ordre: 3
            },
            {
              enonce: 'Un objet est soumis à deux forces $F_1 = 30\ \\text{N}$ (vers la droite) et $F_2 = 50\ \\text{N}$ (vers la gauche). La résultante est :',
              options: ['80 N vers la droite', '20 N vers la gauche', '20 N vers la droite', '80 N vers la gauche'],
              reponseCorrecte: '20 N vers la gauche',
              explication: '$F_{res} = 50 - 30 = 20\ \\text{N}$ dans le sens de la force la plus grande (gauche).',
              difficulte: 'MOYEN', ordre: 4
            }
          ]}
        }]}
      }
    ]}
  }})

  // ══════════════════════════════════════════════════
  // 3. CHIMIE — Réactions chimiques
  // ══════════════════════════════════════════════════
  const coursChimie = await prisma.cours.create({ data: {
    titre: 'Chimie — Atomes, molécules et réactions',
    description: 'Les bases de la chimie : structure de la matière, tableau périodique, liaisons chimiques et équilibrage des réactions.',
    matiere: 'CHIMIE', niveau: 'LYCEE', classe: 'Seconde',
    publie: true, auteurId: prof.id,
    chapitres: { create: [
      {
        titre: 'Atomes et configuration électronique',
        ordre: 1, xpObtenu: 20,
        contenu: String.raw`# Atomes et configuration électronique

## Structure de l'atome

Un atome est constitué de :
- Un **noyau** central (protons $Z$ + neutrons $N$)
- Des **électrons** qui gravitent autour du noyau

### Notations
$$^A_Z X$$
- $Z$ = numéro atomique (nombre de protons)
- $A$ = nombre de masse ($A = Z + N$)
- $N$ = nombre de neutrons = $A - Z$

**Exemple :** $^{12}_6 C$ → 6 protons, 6 neutrons, 6 électrons

## Configuration électronique

Les électrons se répartissent sur des **couches** :
- Couche K : 2 électrons max
- Couche L : 8 électrons max
- Couche M : 18 électrons max (8 pour les éléments courants)

### Règle de remplissage
On remplit dans l'ordre K, L, M...

**Exemple — Oxygène ($Z = 8$) :**
$(K)^2(L)^6$ → 2 électrons en K, 6 en L

**Exemple — Sodium ($Z = 11$) :**
$(K)^2(L)^8(M)^1$

## Électrons de valence

Les électrons de la **couche externe** (valence) déterminent la réactivité.
- Sodium : 1 électron de valence → très réactif
- Néon : 8 électrons de valence → gaz noble, inerte`,
        quiz: { create: [{
          titre: 'Quiz — Atomes', type: 'QCM', xpMax: 50, dureMin: 5,
          questions: { create: [
            {
              enonce: 'L\'atome $^{23}_{11}\\text{Na}$ (sodium) possède :',
              options: ['11 protons et 11 neutrons', '11 protons et 12 neutrons', '12 protons et 11 neutrons', '23 protons'],
              reponseCorrecte: '11 protons et 12 neutrons',
              explication: '$Z = 11$ protons, $N = A - Z = 23 - 11 = 12$ neutrons.',
              difficulte: 'FACILE', ordre: 1
            },
            {
              enonce: 'Combien d\'électrons de valence possède l\'atome de chlore ($Z = 17$) ?',
              options: ['2', '5', '7', '8'],
              reponseCorrecte: '7',
              explication: 'Configuration : $(K)^2(L)^8(M)^7$. La couche externe M contient 7 électrons.',
              difficulte: 'MOYEN', ordre: 2
            },
            {
              enonce: 'Quel est le nombre de masse d\'un atome avec 8 protons et 8 neutrons ?',
              options: ['8', '16', '64', '0'],
              reponseCorrecte: '16',
              explication: '$A = Z + N = 8 + 8 = 16$. C\'est l\'oxygène ${}^{16}_8 O$.',
              difficulte: 'FACILE', ordre: 3
            }
          ]}
        }]}
      },
      {
        titre: 'Équilibrage des équations chimiques',
        ordre: 2, xpObtenu: 25,
        contenu: String.raw`# Équilibrage des équations chimiques

## Loi de conservation de la masse

> **Loi de Lavoisier :** Rien ne se perd, rien ne se crée, tout se transforme.

Le nombre d'atomes de chaque élément est **identique** avant et après la réaction.

## Méthode d'équilibrage

### Étapes
1. Écrire l'équation non équilibrée
2. Compter les atomes de chaque côté
3. Ajuster les **coefficients stœchiométriques** (jamais les indices)
4. Vérifier

### Exemple : Combustion du méthane

$$\text{CH}_4 + \text{O}_2 \to \text{CO}_2 + \text{H}_2\text{O}$$

| Élément | Gauche | Droite |
|---|---|---|
| C | 1 | 1 ✓ |
| H | 4 | 2 ✗ |
| O | 2 | 3 ✗ |

Ajustement :

$$\text{CH}_4 + 2\,\text{O}_2 \to \text{CO}_2 + 2\,\text{H}_2\text{O}$$

**Vérification :** C : 1=1 ✓, H : 4=4 ✓, O : 4=4 ✓

## Réaction de synthèse de l'eau

$$2\,\text{H}_2 + \text{O}_2 \to 2\,\text{H}_2\text{O}$$`,
        quiz: { create: [{
          titre: 'Quiz — Équations chimiques', type: 'VRAI_FAUX', xpMax: 40, dureMin: 4,
          questions: { create: [
            {
              enonce: 'Dans une réaction chimique, la masse totale des réactifs est égale à la masse totale des produits.',
              reponseCorrecte: 'vrai',
              explication: 'C\'est la loi de conservation de la masse (Lavoisier).',
              difficulte: 'FACILE', ordre: 1
            },
            {
              enonce: 'Pour équilibrer une équation chimique, on peut modifier les indices des formules (ex : changer H₂O en H₃O).',
              reponseCorrecte: 'faux',
              explication: 'On ne modifie jamais les indices — cela changerait la nature des substances. On n\'ajuste que les coefficients stœchiométriques.',
              difficulte: 'MOYEN', ordre: 2
            },
            {
              enonce: 'L\'équation $H_2 + O_2 \\to H_2O$ est correctement équilibrée.',
              reponseCorrecte: 'faux',
              explication: 'Non : 2 atomes O à gauche, 1 à droite. L\'équation équilibrée est $2H_2 + O_2 \\to 2H_2O$.',
              difficulte: 'MOYEN', ordre: 3
            },
            {
              enonce: 'Le coefficient stœchiométrique 2 devant $\\text{H}_2\\text{O}$ signifie qu\'il y a 2 molécules d\'eau.',
              reponseCorrecte: 'vrai',
              explication: 'Le coefficient stœchiométrique indique le nombre de molécules (ou moles) de la substance.',
              difficulte: 'FACILE', ordre: 4
            }
          ]}
        }]}
      }
    ]}
  }})

  // ══════════════════════════════════════════════════
  // 4. SVT — La cellule
  // ══════════════════════════════════════════════════
  const coursSVT = await prisma.cours.create({ data: {
    titre: 'SVT — La cellule, unité du vivant',
    description: 'Découvrez la structure des cellules eucaryotes et procaryotes, leurs organites et les grandes fonctions cellulaires.',
    matiere: 'SCIENCES_VIE_TERRE', niveau: 'COLLEGE', classe: '3ème',
    publie: true, premium: true, auteurId: prof.id,
    chapitres: { create: [
      {
        titre: 'Structure de la cellule eucaryote',
        ordre: 1, xpObtenu: 15,
        contenu: String.raw`# Structure de la cellule eucaryote

## La théorie cellulaire

Tous les êtres vivants sont constitués de **cellules** — les unités fondamentales de la vie.

- Robert Hooke (1665) : découverte des premières cellules (liège)
- Schleiden & Schwann (1838) : tous les êtres vivants sont constitués de cellules

## Composants d'une cellule eucaryote

### La membrane plasmique
- Enveloppe qui délimite la cellule
- Contrôle les échanges avec l'extérieur (perméabilité sélective)
- Constituée d'une **double couche de phospholipides**

### Le noyau
- Contient l'**ADN** (information génétique)
- Entouré par l'**enveloppe nucléaire**
- Contient le **nucléole** (fabrication des ribosomes)

### Le cytoplasme
Milieu liquide (cytosol) contenant les organites.

### Les principaux organites

| Organite | Fonction |
|---|---|
| **Mitochondrie** | Production d'énergie (ATP) — "centrale énergétique" |
| **Réticulum endoplasmique** | Synthèse et transport de protéines/lipides |
| **Appareil de Golgi** | Tri et expédition des protéines |
| **Ribosomes** | Synthèse des protéines |
| **Lysosomes** | Digestion cellulaire |

### La paroi (cellules végétales seulement)
Couche rigide en **cellulose** autour de la membrane — donne la forme à la cellule végétale.

## Cellule animale vs cellule végétale

| | Animale | Végétale |
|---|---|---|
| Paroi en cellulose | ✗ | ✓ |
| Chloroplastes | ✗ | ✓ |
| Grande vacuole | ✗ | ✓ |
| Centrosome | ✓ | Rare |`,
        quiz: { create: [{
          titre: 'Quiz — La cellule', type: 'QCM', xpMax: 40, dureMin: 5,
          questions: { create: [
            {
              enonce: 'Quel organite est responsable de la production d\'énergie (ATP) dans la cellule ?',
              options: ['Le noyau', 'Le ribosome', 'La mitochondrie', 'L\'appareil de Golgi'],
              reponseCorrecte: 'La mitochondrie',
              explication: 'La mitochondrie est la "centrale énergétique" de la cellule, elle produit l\'ATP par respiration cellulaire.',
              difficulte: 'FACILE', ordre: 1
            },
            {
              enonce: 'Quelle structure est présente dans les cellules végétales mais pas dans les cellules animales ?',
              options: ['Le noyau', 'La membrane plasmique', 'La paroi en cellulose', 'Les ribosomes'],
              reponseCorrecte: 'La paroi en cellulose',
              explication: 'La paroi cellulaire en cellulose est spécifique aux cellules végétales, champignons et certaines bactéries.',
              difficulte: 'FACILE', ordre: 2
            },
            {
              enonce: 'L\'ADN de la cellule eucaryote se trouve principalement :',
              options: ['Dans le cytoplasme', 'Dans le noyau', 'Dans les ribosomes', 'Dans la membrane'],
              reponseCorrecte: 'Dans le noyau',
              explication: 'Chez les eucaryotes, l\'ADN est enfermé dans le noyau, protégé par l\'enveloppe nucléaire.',
              difficulte: 'FACILE', ordre: 3
            }
          ]}
        }]}
      },
      {
        titre: 'La photosynthèse',
        ordre: 2, xpObtenu: 20,
        contenu: String.raw`# La photosynthèse

## Définition

La **photosynthèse** est le processus par lequel les végétaux chlorophylliens fabriquent des matières organiques à partir de matières minérales en utilisant l'énergie lumineuse.

## Équation globale

$$6\,\text{CO}_2 + 6\,\text{H}_2\text{O} + \text{lumière} \to C_6H_{12}O_6 + 6\,\text{O}_2$$

*Le dioxyde de carbone et l'eau → glucose et dioxygène*

## Où se déroule la photosynthèse ?

Dans les **chloroplastes**, organites spécifiques aux cellules végétales.

Le **chloroplaste** contient :
- Des **thylakoïdes** (membranes internes) — où se captent les photons
- Le **stroma** (liquide interne) — où le CO₂ est incorporé

### La chlorophylle
Pigment vert qui absorbe la lumière (surtout rouge et bleue, pas le vert qu'elle réfléchit).

## Les deux phases

### 1. Phase lumineuse (dans les thylakoïdes)
- Capture de l'énergie lumineuse
- Photolyse de l'eau → O₂ libéré
- Production d'ATP et NADPH

### 2. Phase sombre / Cycle de Calvin (dans le stroma)
- Fixation du CO₂
- Utilisation de l'ATP et du NADPH
- Production de glucose

> **Bilan écologique :** La photosynthèse est à la base de toutes les chaînes alimentaires et produit l'oxygène atmosphérique.`,
        quiz: { create: [{
          titre: 'Quiz — Photosynthèse', type: 'VRAI_FAUX', xpMax: 40, dureMin: 4,
          questions: { create: [
            {
              enonce: 'La photosynthèse produit du dioxyde de carbone (CO₂) et consomme de l\'oxygène (O₂).',
              reponseCorrecte: 'faux',
              explication: 'C\'est l\'inverse : la photosynthèse CONSOMME du CO₂ et PRODUIT de l\'O₂.',
              difficulte: 'FACILE', ordre: 1
            },
            {
              enonce: 'La photosynthèse se déroule dans les chloroplastes.',
              reponseCorrecte: 'vrai',
              explication: 'Les chloroplastes sont les organites spécialisés dans la photosynthèse chez les végétaux.',
              difficulte: 'FACILE', ordre: 2
            },
            {
              enonce: 'La chlorophylle absorbe principalement la lumière verte.',
              reponseCorrecte: 'faux',
              explication: 'La chlorophylle réfléchit le vert (d\'où la couleur des feuilles), elle absorbe surtout le rouge et le bleu.',
              difficulte: 'MOYEN', ordre: 3
            }
          ]}
        }]}
      }
    ]}
  }})

  // ══════════════════════════════════════════════════
  // 5. INFORMATIQUE — Algorithmique
  // ══════════════════════════════════════════════════
  const coursInfo = await prisma.cours.create({ data: {
    titre: 'Informatique — Introduction à l\'algorithmique',
    description: 'Apprendre à penser de manière algorithmique : variables, conditions, boucles et fonctions, avec des exemples concrets.',
    matiere: 'INFORMATIQUE', niveau: 'LYCEE', classe: 'Terminale',
    publie: true, auteurId: prof.id,
    chapitres: { create: [
      {
        titre: 'Variables, types et opérations',
        ordre: 1, xpObtenu: 15,
        contenu: String.raw`# Variables, types et opérations

## Qu'est-ce qu'un algorithme ?

Un **algorithme** est une suite finie et ordonnée d'instructions permettant de résoudre un problème.

Un bon algorithme :
- A une **entrée** (données)
- Produit une **sortie** (résultat)
- Se **termine** en un temps fini
- Est **correct** (produit le bon résultat)

## Les variables

Une variable est un **espace mémoire nommé** qui stocke une valeur.

\`\`\`
Variable age : Entier
Variable prenom : Chaîne
Variable moyenne : Réel
Variable reussi : Booléen
\`\`\`

## Types de données

| Type | Exemples | Usage |
|---|---|---|
| Entier | 0, 5, -3, 100 | Compteurs, indices |
| Réel | 3.14, -0.5, 2.0 | Calculs décimaux |
| Chaîne | "Dakar", "Bonjour" | Texte |
| Booléen | Vrai, Faux | Conditions |

## Opérations de base

\`\`\`
// Affectation
age ← 17
prenom ← "Awa"

// Opérations arithmétiques
somme ← 5 + 3      // = 8
produit ← 4 * 7    // = 28
quotient ← 10 / 4  // = 2.5
reste ← 10 mod 3   // = 1

// Entrée / Sortie
Lire(age)
Écrire("Bonjour ", prenom)
\`\`\``,
        quiz: { create: [{
          titre: 'Quiz — Variables et types', type: 'QCM', xpMax: 40, dureMin: 5,
          questions: { create: [
            {
              enonce: 'Quel type de variable utiliser pour stocker le prénom d\'un élève ?',
              options: ['Entier', 'Réel', 'Chaîne', 'Booléen'],
              reponseCorrecte: 'Chaîne',
              explication: 'Un prénom est du texte, on utilise donc le type Chaîne (ou String).',
              difficulte: 'FACILE', ordre: 1
            },
            {
              enonce: 'Que vaut `10 mod 3` ?',
              options: ['3', '1', '0', '3.33'],
              reponseCorrecte: '1',
              explication: '10 = 3 × 3 + 1, donc le reste de la division de 10 par 3 est 1.',
              difficulte: 'MOYEN', ordre: 2
            },
            {
              enonce: 'Quelle est la différence entre une variable de type Entier et de type Réel ?',
              options: ['Aucune différence', 'Entier stocke des nombres sans décimales, Réel avec décimales', 'Entier est plus grand que Réel', 'Réel ne peut pas être négatif'],
              reponseCorrecte: 'Entier stocke des nombres sans décimales, Réel avec décimales',
              explication: 'Un Entier est un nombre sans partie décimale (0, 1, -5...). Un Réel peut avoir une partie décimale (3.14, -0.5...).',
              difficulte: 'FACILE', ordre: 3
            }
          ]}
        }]}
      },
      {
        titre: 'Conditions et boucles',
        ordre: 2, xpObtenu: 20,
        contenu: String.raw`# Conditions et boucles

## Les structures conditionnelles

### Si...Sinon

\`\`\`
Si (note >= 10) Alors
    Écrire("Reçu !")
Sinon
    Écrire("Recalé")
FinSi
\`\`\`

### Si...SinonSi...Sinon

\`\`\`
Si (note >= 16) Alors
    Écrire("Très Bien")
SinonSi (note >= 14) Alors
    Écrire("Bien")
SinonSi (note >= 12) Alors
    Écrire("Assez Bien")
SinonSi (note >= 10) Alors
    Écrire("Passable")
Sinon
    Écrire("Insuffisant")
FinSi
\`\`\`

## Les boucles

### Boucle Pour (nombre d'itérations connu)

\`\`\`
// Afficher les nombres de 1 à 10
Pour i de 1 à 10 Faire
    Écrire(i)
FinPour
\`\`\`

### Boucle TantQue (condition)

\`\`\`
// Demander un nombre positif
Lire(n)
TantQue (n <= 0) Faire
    Écrire("Entrez un nombre positif :")
    Lire(n)
FinTantQue
\`\`\`

## Exemple complet — Calcul de la moyenne

\`\`\`
Variable somme, note : Réel
Variable n, i : Entier

Écrire("Combien de notes ?")
Lire(n)
somme ← 0

Pour i de 1 à n Faire
    Écrire("Note ", i, " : ")
    Lire(note)
    somme ← somme + note
FinPour

Écrire("Moyenne = ", somme / n)
\`\`\``,
        quiz: { create: [{
          titre: 'Quiz — Conditions et boucles', type: 'QCM', xpMax: 50, dureMin: 6,
          questions: { create: [
            {
              enonce: 'Combien de fois la boucle `Pour i de 1 à 5` s\'exécute-t-elle ?',
              options: ['4 fois', '5 fois', '6 fois', '1 fois'],
              reponseCorrecte: '5 fois',
              explication: 'La boucle s\'exécute pour i = 1, 2, 3, 4, 5 — soit 5 itérations.',
              difficulte: 'FACILE', ordre: 1
            },
            {
              enonce: 'Quelle boucle utiliser quand on ne connaît pas à l\'avance le nombre d\'itérations ?',
              options: ['Boucle Pour', 'Boucle TantQue', 'Boucle FinPour', 'Boucle Répéter'],
              reponseCorrecte: 'Boucle TantQue',
              explication: 'La boucle TantQue répète des instructions tant qu\'une condition est vraie, sans connaître le nombre d\'itérations.',
              difficulte: 'FACILE', ordre: 2
            },
            {
              enonce: 'Qu\'affiche ce code ?\n```\nSi (5 > 3) Alors\n    Écrire("A")\nSinon\n    Écrire("B")\nFinSi```',
              options: ['A', 'B', 'AB', 'Rien'],
              reponseCorrecte: 'A',
              explication: '5 > 3 est vrai, donc on entre dans le bloc "Alors" et on affiche "A".',
              difficulte: 'FACILE', ordre: 3
            }
          ]}
        }]}
      }
    ]}
  }})

  console.log('✓ Cours créés (Maths, Physique, Chimie, SVT, Informatique)')

  // ─── Progressions de l'élève Aminata ─────────────
  // Récupérer les IDs des chapitres
  const chapMathsRaw = await prisma.chapitre.findMany({
    where: { coursId: coursMaths.id }, orderBy: { ordre: 'asc' }, include: { quiz: { include: { tentatives: true } } }
  })
  const chapPhysiqueRaw = await prisma.chapitre.findMany({
    where: { coursId: coursPhysique.id }, orderBy: { ordre: 'asc' }, include: { quiz: true }
  })

  // Chapitre 1 Maths → TERMINE
  if (chapMathsRaw[0]) {
    await prisma.progression.upsert({
      where: { utilisateurId_chapitreId: { utilisateurId: eleve1.id, chapitreId: chapMathsRaw[0].id } },
      update: { statut: 'TERMINE', score: 75, xpGagne: 20 },
      create: { utilisateurId: eleve1.id, chapitreId: chapMathsRaw[0].id, statut: 'TERMINE', score: 75, xpGagne: 20, tentatives: 1 }
    })

    // Tentative quiz du chapitre 1 Maths
    if (chapMathsRaw[0].quiz[0]) {
      const existeTentative = await prisma.tentative.findFirst({
        where: { utilisateurId: eleve1.id, quizId: chapMathsRaw[0].quiz[0].id }
      })
      if (!existeTentative) {
        await prisma.tentative.create({
          data: {
            utilisateurId: eleve1.id,
            quizId: chapMathsRaw[0].quiz[0].id,
            reponses: [
              { questionOrdre: 1, reponse: '$x = 2$', correct: true },
              { questionOrdre: 2, reponse: '$x = -4$', correct: true },
              { questionOrdre: 3, reponse: '$x = -b/a$', correct: true },
              { questionOrdre: 4, reponse: '$x = 7$', correct: false }
            ],
            score: 75,
            xpGagne: 37,
            dureeSec: 210
          }
        })
      }
    }
  }

  // Chapitre 2 Maths → EN_COURS
  if (chapMathsRaw[1]) {
    await prisma.progression.upsert({
      where: { utilisateurId_chapitreId: { utilisateurId: eleve1.id, chapitreId: chapMathsRaw[1].id } },
      update: { statut: 'EN_COURS', score: null },
      create: { utilisateurId: eleve1.id, chapitreId: chapMathsRaw[1].id, statut: 'EN_COURS', tentatives: 0 }
    })
  }

  // Chapitre 1 Physique → TERMINE
  if (chapPhysiqueRaw[0]) {
    await prisma.progression.upsert({
      where: { utilisateurId_chapitreId: { utilisateurId: eleve1.id, chapitreId: chapPhysiqueRaw[0].id } },
      update: { statut: 'TERMINE', score: 100, xpGagne: 20 },
      create: { utilisateurId: eleve1.id, chapitreId: chapPhysiqueRaw[0].id, statut: 'TERMINE', score: 100, xpGagne: 20, tentatives: 1 }
    })

    if (chapPhysiqueRaw[0].quiz[0]) {
      const existeTentativePhys = await prisma.tentative.findFirst({
        where: { utilisateurId: eleve1.id, quizId: chapPhysiqueRaw[0].quiz[0].id }
      })
      if (!existeTentativePhys) {
        await prisma.tentative.create({
          data: {
            utilisateurId: eleve1.id,
            quizId: chapPhysiqueRaw[0].quiz[0].id,
            reponses: [
              { questionOrdre: 1, reponse: '$P = 20\\ \\text{N}$', correct: true },
              { questionOrdre: 2, reponse: 'Perpendiculaire à la surface', correct: true },
              { questionOrdre: 3, reponse: '$\\vec{P} + \\vec{N} = \\vec{0}$', correct: true }
            ],
            score: 100,
            xpGagne: 50,
            dureeSec: 145
          }
        })
      }
    }
  }

  // Badge "Premier pas" pour Aminata (a fait plus d'un quiz)
  const badgePremierPas = await prisma.badge.findUnique({ where: { nom: 'Premier pas' } })
  if (badgePremierPas) {
    await prisma.badgeUtilisateur.upsert({
      where: { utilisateurId_badgeId: { utilisateurId: eleve1.id, badgeId: badgePremierPas.id } },
      update: {},
      create: { utilisateurId: eleve1.id, badgeId: badgePremierPas.id }
    })
  }

  console.log('✓ Progressions et tentatives pour Aminata')

  // ─── Parent + lien enfant ─────────────────────────
  const hashParent = await bcrypt.hash('parent1234', 12)
  const parent = await prisma.utilisateur.upsert({
    where: { email: 'parent@adiaraacademy.sn' },
    update: { role: 'PARENT' },
    create: { nom: 'Sow', prenom: 'Aissatou', email: 'parent@adiaraacademy.sn', motDePasse: hashParent, role: 'PARENT', niveau: 'LYCEE' }
  })
  await prisma.lienParentEnfant.upsert({
    where: { parentId_enfantId: { parentId: parent.id, enfantId: eleve1.id } },
    update: {},
    create: { parentId: parent.id, enfantId: eleve1.id }
  })
  console.log('✓ Compte parent créé et lié à Aminata')

  // ─── Profil professeur ────────────────────────────
  await prisma.profilProfesseur.upsert({
    where: { userId: prof.id },
    update: { verifie: true },
    create: {
      userId: prof.id,
      bio: 'Professeur de mathématiques et physique avec 8 ans d\'expérience au lycée. Spécialisé en Terminale S. Méthodes actives, exercices progressifs.',
      matieres: ['MATHEMATIQUES', 'PHYSIQUE'],
      tarifHeure: 5000,
      ville: 'Dakar',
      verifie: true,
      disponible: true
    }
  })
  console.log('✓ Profil professeur créé pour Moussa Diallo')

  console.log('')
  console.log('═══════════════════════════════════════════')
  console.log('Comptes créés :')
  console.log('  admin@adiaraacademy.sn   / admin1234  (ADMIN)')
  console.log('  prof@adiaraacademy.sn    / prof1234   (PROFESSEUR)')
  console.log('  eleve@adiaraacademy.sn   / eleve1234  (ÉLÈVE)')
  console.log('  premium@adiaraacademy.sn / eleve1234  (ÉLÈVE PREMIUM)')
  console.log('  parent@adiaraacademy.sn  / parent1234 (PARENT — lié à Aminata)')
  console.log('  oumar@adiaraacademy.sn   / eleve1234  (ÉLÈVE)')
  console.log('  fatou@adiaraacademy.sn   / eleve1234  (ÉLÈVE)')
  console.log('═══════════════════════════════════════════')
  console.log('Seed terminé !')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
