matiere: INFORMATIQUE
niveau: LYCEE
classe: Terminale
titre: Informatique Terminale : récursivité, bases de données SQL et cryptographie
description: Fonctions récursives, interrogation d'une base de données relationnelle en SQL, principes du chiffrement.
premium: oui

--- CHAPITRE: Récursivité | xp: 40
## Principe

Une fonction est **récursive** lorsqu'elle s'appelle elle-même. Elle comporte toujours :

- un **cas de base**, qui arrête les appels ;
- un **appel récursif** sur un problème plus petit.

```python
def fact(n):
    if n == 0:
        return 1
    return n * fact(n - 1)
```

`fact(4)` renvoie $4 \times 3 \times 2 \times 1 = 24$.

## Suite de Fibonacci

$F_0 = 0$, $F_1 = 1$, $F_n = F_{n-1} + F_{n-2}$ : $0, 1, 1, 2, 3, 5, 8, 13\dots$ Une écriture récursive naïve est très coûteuse car les mêmes valeurs sont recalculées.

## Terminaison

Pour garantir qu'une fonction termine, on identifie une quantité entière positive qui **diminue strictement** à chaque appel (ici $n$). Sans cas de base atteint, Python lève une erreur de dépassement de la pile (`RecursionError`).

## Récursif et itératif

Toute fonction récursive peut s'écrire avec une boucle, parfois plus efficace en mémoire.

--- QUIZ: Quiz : récursivité | xp: 80
? [F] Quelle est la propriété d'une fonction récursive ?
- Elle s'appelle elle-même [ok]
- Elle n'a pas de paramètre
- Elle utilise uniquement des boucles
- Elle ne renvoie rien
> L'appel récursif traite un problème plus petit.
? [F] À quoi sert le cas de base ?
- À arrêter les appels récursifs [ok]
- À afficher
- À accélérer
- À définir les variables
> Sans cas de base, la fonction ne termine pas.
? [F] Que vaut `fact(4)` ?
- $10$
- $24$ [ok]
- $16$
- $4$
> $4 \times 3 \times 2 \times 1 = 24$.
? [M] Que vaut $F_6$ dans la suite de Fibonacci ($F_0 = 0$, $F_1 = 1$) ?
- $5$
- $8$ [ok]
- $13$
- $6$
> $0, 1, 1, 2, 3, 5, 8$ : $F_6 = 8$.
? [M] Quelle erreur survient quand il manque un cas de base ?
- RecursionError (dépassement de pile) [ok]
- SyntaxError
- ZeroDivisionError
- Aucune
> Les appels s'empilent indéfiniment.
? [M] Que vaut `fact(0)` avec la fonction de la leçon ?
- $0$
- $1$ [ok]
- Erreur
- $-1$
> C'est le cas de base : $0! = 1$.
? [D] Pourquoi une écriture récursive naïve de Fibonacci est-elle lente ?
- Les mêmes valeurs sont recalculées de nombreuses fois [ok]
- Python est lent
- La suite est infinie
- Elle utilise des flottants
> L'arbre des appels croît de façon exponentielle.
? [D] Que doit faire la quantité qui garantit la terminaison ?
- Diminuer strictement à chaque appel [ok]
- Augmenter à chaque appel
- Rester constante
- Être négative
> Un entier positif qui décroît finit par atteindre le cas de base.

--- CHAPITRE: Bases de données et SQL | xp: 40
## Le modèle relationnel

Une base de données relationnelle est un ensemble de **tables** (relations). Chaque ligne est un **enregistrement**, chaque colonne un **attribut**. Une **clé primaire** identifie de façon unique chaque ligne. Une **clé étrangère** référence la clé primaire d'une autre table.

## Requêtes SQL

```sql
SELECT nom, age FROM eleves WHERE age > 15 ORDER BY nom;
```

- `SELECT` : colonnes à afficher ;
- `FROM` : table ;
- `WHERE` : filtre ;
- `ORDER BY` : tri.

## Agrégats

`COUNT(*)` compte les lignes, `SUM`, `AVG`, `MIN`, `MAX` calculent des valeurs sur une colonne.

## Jointure

```sql
SELECT eleves.nom, classes.libelle
FROM eleves JOIN classes ON eleves.id_classe = classes.id;
```

La jointure associe les lignes de deux tables grâce à la clé étrangère. Les instructions `INSERT`, `UPDATE`, `DELETE` modifient les données.

--- QUIZ: Quiz : SQL | xp: 80
? [F] Quelle clause filtre les lignes ?
- WHERE [ok]
- FROM
- ORDER BY
- JOIN
> WHERE applique une condition.
? [F] À quoi sert une clé primaire ?
- À identifier chaque ligne de façon unique [ok]
- À trier la table
- À chiffrer les données
- À supprimer des lignes
> Elle est unique et non nulle.
? [F] Quelle commande ajoute une ligne ?
- INSERT [ok]
- SELECT
- DROP
- SORT
> INSERT INTO ajoute un enregistrement.
? [M] Que renvoie `SELECT COUNT(*) FROM eleves` pour une table de $25$ élèves ?
- $1$
- $25$ [ok]
- $0$
- $5$
> COUNT(*) compte les lignes.
? [M] Quelle clause trie le résultat ?
- ORDER BY [ok]
- GROUP
- WHERE
- LIMIT
> ORDER BY trie par colonne.
? [M] Qu'est-ce qu'une clé étrangère ?
- Une colonne qui référence la clé primaire d'une autre table [ok]
- Une clé de chiffrement
- Une ligne supprimée
- Un mot de passe
> Elle relie deux tables.
? [D] Quelle requête affiche le nom des élèves de plus de $15$ ans ?
- `SELECT nom FROM eleves WHERE age > 15;` [ok]
- `SELECT age FROM eleves WHERE nom > 15;`
- `FROM eleves SELECT nom;`
- `WHERE age > 15 SELECT nom;`
> Ordre correct : SELECT, FROM, WHERE.
? [D] Pourquoi utiliser une jointure ?
- Pour combiner les données de deux tables liées [ok]
- Pour effacer une table
- Pour trier
- Pour chiffrer
> JOIN associe les lignes grâce à la clé étrangère.

--- CHAPITRE: Introduction à la cryptographie | xp: 40
## Objectifs

La cryptographie protège la **confidentialité**, l'**intégrité** et l'**authenticité** des messages.

## Chiffrement symétrique

La **même clé** chiffre et déchiffre. Exemple historique : le **chiffre de César**, qui décale chaque lettre de $k$ positions. Avec $k = 3$, « SENEGAL » devient « VHQHJDO ». Ce chiffre est très fragile : il n'y a que $25$ clés possibles, et l'analyse des fréquences le casse facilement. Un standard moderne est **AES**.

## Chiffrement asymétrique

Chaque personne possède une **clé publique** (diffusée) et une **clé privée** (secrète). On chiffre avec la clé publique du destinataire ; seul le détenteur de la clé privée peut déchiffrer. L'algorithme **RSA** repose sur la difficulté de factoriser un grand produit de nombres premiers.

## Fonctions de hachage

Une **fonction de hachage** (SHA-256, SHA-3) produit une empreinte de taille fixe. Elle est à sens unique : retrouver le message à partir de l'empreinte est impraticable. Elle sert à vérifier l'intégrité et à stocker des mots de passe.

## Un défi à venir

Un ordinateur quantique suffisamment puissant casserait RSA : la **cryptographie post-quantique** prépare déjà des algorithmes résistants.

--- QUIZ: Quiz : cryptographie | xp: 80
? [F] Combien de clés utilise le chiffrement symétrique ?
- Une seule, partagée [ok]
- Deux différentes
- Aucune
- Trois
> La même clé chiffre et déchiffre.
? [F] Avec quelle clé chiffre-t-on un message destiné à Awa en cryptographie asymétrique ?
- La clé publique d'Awa [ok]
- La clé privée d'Awa
- La clé de l'expéditeur
- Aucune
> Seule la clé privée d'Awa pourra déchiffrer.
? [F] Qu'est-ce qu'une fonction de hachage ?
- Une fonction qui produit une empreinte de taille fixe [ok]
- Un chiffrement réversible
- Une clé
- Un protocole
> Elle est à sens unique.
? [M] Chiffrez « ABC » avec le chiffre de César de décalage $3$.
- DEF [ok]
- BCD
- XYZ
- CDE
> A devient D, B devient E, C devient F.
? [M] Combien de décalages non nuls existe-t-il pour le chiffre de César ?
- $25$ [ok]
- $26$
- $13$
- $100$
> L'alphabet compte $26$ lettres, le décalage $0$ ne change rien.
? [M] Sur quoi repose la sécurité de RSA ?
- La difficulté de factoriser un grand produit de nombres premiers [ok]
- La longueur du mot de passe
- La vitesse du réseau
- Le choix de la police
> Factoriser est difficile pour de grands nombres.
? [D] Pourquoi le chiffre de César est-il facile à casser ?
- Il y a peu de clés et les fréquences des lettres se conservent [ok]
- Il est trop long
- Il est asymétrique
- Il utilise des nombres premiers
> L'analyse fréquentielle révèle le décalage.
? [D] Pourquoi stocke-t-on l'empreinte d'un mot de passe plutôt que le mot de passe ?
- Le hachage est à sens unique, donc le mot de passe n'est pas lisible [ok]
- C'est plus court seulement
- Le mot de passe est inutile
- C'est une obligation du navigateur
> Même en cas de fuite, le mot de passe n'est pas directement récupérable.
