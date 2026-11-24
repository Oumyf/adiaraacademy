matiere: INFORMATIQUE
niveau: COLLEGE
classe: 3ème
titre: Informatique 3ème : algorithmes et premiers programmes Python
description: Variables, conditions, boucles et premiers programmes pour apprendre à raisonner comme un programmeur.
premium: non

--- CHAPITRE: Algorithmes et variables | xp: 25
## Qu'est-ce qu'un algorithme ?

Un **algorithme** est une suite finie d'instructions précises qui permet de résoudre un problème. Une recette de cuisine est un algorithme : chaque étape est claire et suivie dans l'ordre.

## Les variables

Une **variable** est une zone de la mémoire qui porte un nom et contient une valeur. Elle peut changer au cours du programme.

```python
age = 15
prenom = "Awa"
age = age + 1
print(prenom, age)
```

Ce programme affiche : Awa 16.

## Les types

- **entier** (`int`) : 12 ;
- **décimal** (`float`) : 3.14 ;
- **texte** (`str`) : "Dakar" ;
- **booléen** (`bool`) : True ou False.

## Affectation

Le signe `=` ne signifie pas l'égalité mathématique : il **affecte** une valeur à une variable. La ligne `x = x + 1` est donc correcte : on prend l'ancienne valeur de x, on ajoute 1 et on range le résultat dans x.

--- QUIZ: Quiz : algorithmes et variables | xp: 50
? [F] Qu'est-ce qu'un algorithme ?
- Une suite finie d'instructions pour résoudre un problème [ok]
- Un appareil électronique
- Un langage parlé
- Un jeu vidéo
> Un algorithme décrit étape par étape comment résoudre un problème.
? [F] Qu'est-ce qu'une variable ?
- Une zone de mémoire nommée qui contient une valeur [ok]
- Un fichier
- Un écran
- Un clavier
> On peut lire et modifier sa valeur.
? [F] Quel est le type de la valeur "Dakar" ?
- Entier
- Texte (chaîne de caractères) [ok]
- Booléen
- Décimal
> Le texte entre guillemets est de type str.
? [M] Après `x = 5` puis `x = x + 2`, que vaut x ?
- $5$
- $7$ [ok]
- $2$
- $52$
> On ajoute $2$ à l'ancienne valeur.
? [M] Que fait l'instruction `print("Bonjour")` ?
- Elle affiche Bonjour à l'écran [ok]
- Elle imprime sur papier
- Elle supprime Bonjour
- Elle crée une variable
> `print` affiche une valeur.
? [M] Quel est le type de la valeur 3.14 ?
- Entier
- Décimal (float) [ok]
- Texte
- Booléen
> Un nombre à virgule est un float.
? [D] Après `a = 3`, `b = a`, `a = 10`, que vaut b ?
- $3$ [ok]
- $10$
- $13$
- $0$
> b a reçu la valeur de a au moment de l'affectation : $3$.
? [D] Pourquoi l'instruction `x = x + 1` est-elle valide en programmation ?
- Le signe = est une affectation, pas une égalité [ok]
- Parce que x est infini
- Parce que 0 = 1
- Parce qu'elle est fausse
> On met à jour x avec son ancienne valeur augmentée de $1$.

--- CHAPITRE: Conditions | xp: 25
## Prendre une décision

Une **condition** permet d'exécuter des instructions seulement si une propriété est vraie.

```python
note = 12
if note >= 10:
    print("Admis")
else:
    print("Ajourné")
```

## Comparaisons

`==` (égal), `!=` (différent), `<`, `>`, `<=`, `>=`. Attention : `=` affecte, `==` compare.

## Opérateurs logiques

- `and` : vrai si les deux conditions sont vraies ;
- `or` : vrai si au moins une condition est vraie ;
- `not` : inverse la valeur.

## Plusieurs cas

`elif` permet d'enchaîner plusieurs conditions : la première vraie est exécutée, les suivantes sont ignorées. L'indentation (décalage des lignes) définit le bloc d'instructions concerné.

--- QUIZ: Quiz : conditions | xp: 50
? [F] Que signifie `==` en Python ?
- Affectation
- Comparaison d'égalité [ok]
- Addition
- Différence
> `==` compare deux valeurs.
? [F] Que fait le mot clé `else` ?
- Il exécute le bloc si la condition est fausse [ok]
- Il arrête le programme
- Il répète
- Il affiche
> `else` traite le cas contraire.
? [F] Quel opérateur signifie « différent de » ?
- `==`
- `!=` [ok]
- `<=`
- `=`
> `!=` signifie différent.
? [M] Que vaut `5 > 3 and 2 > 4` ?
- True
- False [ok]
- 5
- Erreur
> Une des deux conditions est fausse.
? [M] Que vaut `5 > 3 or 2 > 4` ?
- True [ok]
- False
- 5
- Erreur
> Il suffit qu'une condition soit vraie.
? [M] Avec `note = 8`, qu'affiche le code de la leçon (if note >= 10 ... else) ?
- Admis
- Ajourné [ok]
- Rien
- Erreur
> $8 < 10$ : condition fausse, donc le bloc else.
? [D] Avec `x = 15`, quelle instruction est exécutée dans `if x < 10: ... elif x < 20: ... else: ...` ?
- Le premier bloc
- Le bloc elif [ok]
- Le bloc else
- Aucun
> $15 < 10$ est faux, $15 < 20$ est vrai : le bloc elif.
? [D] Que vaut `not (3 == 3)` ?
- True
- False [ok]
- 3
- Erreur
> $3 == 3$ est vrai, son inverse est faux.

--- CHAPITRE: Boucles | xp: 25
## Répéter des instructions

Une **boucle** répète un bloc d'instructions.

## Boucle for

Utilisée quand on connaît le nombre de répétitions :

```python
for i in range(5):
    print(i)
```

Cela affiche $0, 1, 2, 3, 4$ : `range(5)` va de $0$ à $4$.

## Boucle while

Répète tant qu'une condition est vraie :

```python
n = 1
while n < 100:
    n = n * 2
```

## Accumulateur

Pour calculer la somme $1 + 2 + \dots + 10$ :

```python
somme = 0
for i in range(1, 11):
    somme = somme + i
```

À la fin, somme vaut $55$. Attention : une boucle `while` dont la condition reste toujours vraie ne s'arrête jamais (boucle infinie).

--- QUIZ: Quiz : boucles | xp: 50
? [F] Quelles valeurs prend i dans `for i in range(5)` ?
- 1 à 5
- 0 à 4 [ok]
- 0 à 5
- 1 à 4
> `range(5)` produit $0, 1, 2, 3, 4$.
? [F] Quelle boucle répète tant qu'une condition est vraie ?
- for
- while [ok]
- if
- def
> `while` teste sa condition avant chaque tour.
? [F] Comment appelle-t-on une boucle qui ne s'arrête jamais ?
- Une boucle infinie [ok]
- Une boucle finie
- Une boucle for
- Une condition
> La condition reste toujours vraie.
? [M] Combien de fois s'exécute `for i in range(3): print("A")` ?
- $2$
- $3$ [ok]
- $4$
- $0$
> $i$ prend $3$ valeurs : $0, 1, 2$.
? [M] Que vaut somme après `for i in range(1, 4): somme = somme + i` avec somme=0 au départ ?
- $3$
- $6$ [ok]
- $10$
- $4$
> $1 + 2 + 3 = 6$.
? [M] Avec n = 1 et `while n < 10: n = n * 2`, que vaut n à la fin ?
- $8$
- $16$ [ok]
- $10$
- $32$
> n devient $2, 4, 8, 16$ : on s'arrête dès que n $\ge 10$.
? [D] Que vaut la somme $1 + 2 + \dots + 10$ ?
- $45$
- $55$ [ok]
- $50$
- $100$
> Formule : $10 \times 11 / 2 = 55$.
? [D] Quel risque présente `while True:` sans instruction d'arrêt ?
- Une boucle infinie [ok]
- Un résultat toujours nul
- Une erreur de type
- Aucun
> Sans `break` ou changement de condition, le programme ne termine pas.
