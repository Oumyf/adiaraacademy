matiere: INFORMATIQUE
niveau: LYCEE
classe: Seconde
titre: Informatique Seconde : binaire, fonctions et listes, et le Web
description: Codage de l'information en binaire, programmation Python avec fonctions et listes, fonctionnement du Web.
premium: non

--- CHAPITRE: Binaire et hexadécimal | xp: 30
## Le codage binaire

Un ordinateur ne manipule que des **bits** (0 ou 1). Un **octet** est un groupe de $8$ bits ; il peut représenter $2^8 = 256$ valeurs (de $0$ à $255$).

## De la base 2 à la base 10

Chaque position correspond à une puissance de $2$ :

$$1101_2 = 1 \times 8 + 1 \times 4 + 0 \times 2 + 1 \times 1 = 13$$

## De la base 10 à la base 2

On divise successivement par $2$ et on lit les restes de bas en haut. Exemple : $10 = 1010_2$.

## L'hexadécimal

La base $16$ utilise les chiffres $0$ à $9$ puis $A$ à $F$ ($A = 10$, $F = 15$). Un chiffre hexadécimal correspond à $4$ bits. Exemple : $\text{FF}_{16} = 255$, $\text{1A}_{16} = 26$.

## Codage des textes

Les caractères sont codés par des nombres : ASCII ($7$ bits), puis Unicode (UTF-8) pour toutes les langues. Par exemple, « A » vaut $65$ en ASCII.

--- QUIZ: Quiz : binaire et hexadécimal | xp: 60
? [F] Combien de bits contient un octet ?
- $4$
- $8$ [ok]
- $16$
- $32$
> Un octet vaut $8$ bits.
? [F] Quelle est la valeur décimale de $101_2$ ?
- $3$
- $5$ [ok]
- $7$
- $10$
> $4 + 0 + 1 = 5$.
? [F] Quels chiffres utilise le binaire ?
- 0 et 1 [ok]
- 0 à 9
- 0 à F
- 1 et 2
> Le bit vaut $0$ ou $1$.
? [M] Quelle est la valeur de $1101_2$ ?
- $11$
- $13$ [ok]
- $14$
- $15$
> $8 + 4 + 0 + 1 = 13$.
? [M] Quelle est l'écriture binaire de $10$ ?
- $1000_2$
- $1010_2$ [ok]
- $1100_2$
- $1001_2$
> $8 + 2 = 10$.
? [M] Combien de valeurs un octet peut-il représenter ?
- $128$
- $255$
- $256$ [ok]
- $512$
> $2^8 = 256$ valeurs, de $0$ à $255$.
? [D] Combien vaut $\text{FF}_{16}$ en décimal ?
- $15$
- $155$
- $255$ [ok]
- $256$
> $15 \times 16 + 15 = 255$.
? [D] Combien de bits sont nécessaires pour écrire $\text{1A}_{16}$ en binaire (chaque chiffre hexadécimal valant $4$ bits) ?
- $4$
- $8$ [ok]
- $16$
- $2$
> Deux chiffres hexadécimaux $\times 4$ bits.

--- CHAPITRE: Fonctions et listes en Python | xp: 30
## Les fonctions

Une **fonction** regroupe des instructions réutilisables. Elle peut recevoir des **paramètres** et renvoyer un résultat avec `return`.

```python
def carre(x):
    return x * x

print(carre(5))
```

Ce programme affiche $25$.

## Les listes

Une **liste** contient plusieurs valeurs ordonnées, accessibles par leur **indice**, qui commence à $0$.

```python
notes = [12, 8, 15]
print(notes[0])
notes.append(10)
print(len(notes))
```

On affiche $12$ puis $4$ : `append` ajoute un élément à la fin et `len` donne le nombre d'éléments.

## Parcourir une liste

```python
total = 0
for n in notes:
    total = total + n
moyenne = total / len(notes)
```

## Quelques opérateurs

`%` donne le reste de la division euclidienne ($17\ \%\ 5 = 2$), `//` le quotient entier ($17\ //\ 5 = 3$).

--- QUIZ: Quiz : fonctions et listes | xp: 60
? [F] Quel mot clé définit une fonction en Python ?
- def [ok]
- fun
- function
- func
> `def` introduit la définition d'une fonction.
? [F] Quel est l'indice du premier élément d'une liste ?
- $0$ [ok]
- $1$
- $-1$
- $2$
> Les indices commencent à $0$.
? [F] Que fait `return` ?
- Renvoie un résultat et termine la fonction [ok]
- Affiche une valeur
- Supprime une variable
- Répète une boucle
> `return` fournit la valeur de sortie.
? [M] Que vaut `carre(4)` pour `def carre(x): return x * x` ?
- $8$
- $16$ [ok]
- $4$
- $44$
> $4 \times 4 = 16$.
? [M] Avec `L = [4, 8, 15]`, que vaut `L[2]` ?
- $4$
- $8$
- $15$ [ok]
- Erreur
> Indices $0, 1, 2$ : $L[2] = 15$.
? [M] Que vaut `len([3, 5, 7, 9])` ?
- $3$
- $4$ [ok]
- $9$
- $24$
> `len` compte les éléments.
? [D] Que valent `17 % 5` et `17 // 5` ?
- $3$ et $2$
- $2$ et $3$ [ok]
- $5$ et $17$
- $12$ et $3$
> $17 = 5 \times 3 + 2$ : reste $2$, quotient $3$.
? [D] Quelle est la moyenne calculée par le code de la leçon pour `[12, 8, 15, 10]` ?
- $10{,}5$
- $11{,}25$ [ok]
- $12$
- $45$
> $(12 + 8 + 15 + 10) / 4 = 45 / 4 = 11{,}25$.

--- CHAPITRE: Le Web | xp: 30
## Principe

Le Web repose sur le modèle **client-serveur** : un **navigateur** (client) envoie une **requête HTTP** à un **serveur**, qui renvoie une **réponse** (page, image, données).

## Les langages du Web

- **HTML** : structure et contenu de la page (titres, paragraphes, liens) ;
- **CSS** : mise en forme (couleurs, polices, disposition) ;
- **JavaScript** : comportement et interactivité, exécuté dans le navigateur.

## URL et protocoles

Une **URL** désigne une ressource : `https://www.exemple.sn/page.html`. Le protocole **HTTPS** chiffre les échanges, contrairement à HTTP.

## Sécurité et vie privée

Un site demandant un mot de passe doit utiliser HTTPS. Les **cookies** mémorisent des informations côté navigateur. Méfiance envers les messages incitant à saisir un mot de passe sur un site inconnu : c'est du **hameçonnage** (phishing).

--- QUIZ: Quiz : le Web | xp: 60
? [F] Quel langage décrit la structure d'une page Web ?
- HTML [ok]
- CSS
- Python
- SQL
> HTML structure le contenu.
? [F] Quel langage met en forme une page Web ?
- HTML
- CSS [ok]
- JSON
- C
> CSS gère couleurs, polices et mise en page.
? [F] Que signifie le modèle client-serveur ?
- Le client envoie une requête, le serveur répond [ok]
- Deux serveurs communiquent
- Le serveur n'existe pas
- Le client fabrique les pages
> Le navigateur est le client.
? [M] Quel protocole chiffre les échanges entre navigateur et serveur ?
- HTTP
- HTTPS [ok]
- FTP
- SMTP
> Le S signifie « sécurisé ».
? [M] Quel langage s'exécute dans le navigateur pour rendre la page interactive ?
- JavaScript [ok]
- SQL
- Java Server
- Bash
> JavaScript gère l'interactivité côté client.
? [M] Que désigne l'URL `https://www.exemple.sn/page.html` ?
- L'adresse d'une ressource sur le Web [ok]
- Un fichier local
- Un mot de passe
- Un langage
> Une URL localise une ressource.
? [D] Un message vous demande de saisir votre mot de passe bancaire via un lien inconnu. De quoi s'agit-il probablement ?
- D'hameçonnage [ok]
- D'une mise à jour
- D'un cookie
- D'une sauvegarde
> C'est une technique pour voler des identifiants.
? [D] Pourquoi HTTPS est-il préférable à HTTP pour un site de paiement ?
- Les échanges sont chiffrés [ok]
- Le site est plus rapide
- Le site est plus joli
- Il n'y a pas de serveur
> Le chiffrement protège les données en transit.
