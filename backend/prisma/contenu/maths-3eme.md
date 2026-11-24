matiere: MATHEMATIQUES
niveau: COLLEGE
classe: 3ème
titre: Mathématiques 3ème : Thalès, systèmes et fonctions (préparation au BFEM)
description: Les trois grands chapitres du BFEM : théorème de Thalès, systèmes d'équations, fonctions linéaires et affines.
premium: non

--- CHAPITRE: Le théorème de Thalès | xp: 25
## L'énoncé

Soit un triangle $ABC$. Soit $M$ un point de $[AB]$ et $N$ un point de $[AC]$. Si les droites $(MN)$ et $(BC)$ sont **parallèles**, alors :

$$\frac{AM}{AB} = \frac{AN}{AC} = \frac{MN}{BC}$$

Les longueurs du « petit » triangle $AMN$ sont proportionnelles à celles du « grand » triangle $ABC$.

## Méthode pour calculer une longueur

1. **Vérifier** que deux droites sont parallèles.
2. Écrire les **trois rapports égaux**.
3. Choisir l'égalité qui contient l'inconnue et trois longueurs connues.
4. Résoudre avec le produit en croix.

Exemple : $AM = 3$, $AB = 9$, $AN = 2$. On cherche $AC$.

$$\frac{AM}{AB} = \frac{AN}{AC} \implies \frac{3}{9} = \frac{2}{AC} \implies AC = \frac{2 \times 9}{3} = 6$$

## La réciproque

Si les rapports $\dfrac{AM}{AB}$ et $\dfrac{AN}{AC}$ sont égaux **et** que les points $A, M, B$ et $A, N, C$ sont alignés dans le même ordre, alors $(MN)$ est parallèle à $(BC)$.

## Agrandissement et réduction

Si les longueurs sont multipliées par un coefficient $k$ :

- les **aires** sont multipliées par $k^2$ ;
- les **volumes** sont multipliés par $k^3$.

> **Attention :** n'utilise jamais Thalès sans avoir une raison de dire que les droites sont parallèles.

--- QUIZ: Quiz : Le théorème de Thalès | xp: 50
? [F] Quelle condition faut-il pour appliquer le théorème de Thalès dans le triangle $ABC$ ?
- Le triangle est rectangle
- Deux droites sont parallèles [ok]
- Le triangle est isocèle
- Les côtés sont égaux
> Thalès s'applique quand $(MN)$ est parallèle à $(BC)$ avec $M \in [AB]$ et $N \in [AC]$.
? [F] Quelle égalité est vraie si $(MN) // (BC)$ ?
- $\dfrac{AM}{MB} = \dfrac{AN}{AC}$
- $\dfrac{AM}{AB} = \dfrac{AN}{AC}$ [ok]
- $\dfrac{AM}{AB} = \dfrac{BC}{MN}$
- $AM \times AB = AN \times AC$
> Les rapports égaux sont $\dfrac{AM}{AB} = \dfrac{AN}{AC} = \dfrac{MN}{BC}$ : petit triangle sur grand triangle.
? [F] Si les longueurs d'une figure sont multipliées par $2$, par combien l'aire est-elle multipliée ?
- $2$
- $4$ [ok]
- $6$
- $8$
> Les aires sont multipliées par $k^2$ avec $k = 2$ : $k^2 = 4$.
? [M] $(MN) // (BC)$, $AM = 3$, $AB = 9$ et $AN = 2$. Combien mesure $AC$ ?
- $6$ [ok]
- $4{,}5$
- $18$
- $\dfrac{2}{3}$
> $\dfrac{AM}{AB} = \dfrac{AN}{AC}$ donne $\dfrac{3}{9} = \dfrac{2}{AC}$, donc $AC = \dfrac{2 \times 9}{3} = 6$.
? [M] Avec $AM = 3$, $AB = 9$ et $MN = 4$, combien mesure $BC$ ?
- $12$ [ok]
- $13{,}5$
- $\dfrac{4}{3}$
- $36$
> $\dfrac{AM}{AB} = \dfrac{MN}{BC}$ donne $\dfrac{3}{9} = \dfrac{4}{BC}$, donc $BC = \dfrac{4 \times 9}{3} = 12$.
? [M] Une réduction de rapport $\dfrac{1}{3}$ transforme un triangle d'aire $90$ cm². Quelle est la nouvelle aire ?
- $30$ cm²
- $10$ cm² [ok]
- $270$ cm²
- $3$ cm²
> L'aire est multipliée par $k^2 = \dfrac{1}{9}$ : $90 \div 9 = 10$ cm².
? [D] $AM = 4$, $AB = 10$, $AN = 5$, $AC = 12$. Les droites $(MN)$ et $(BC)$ sont-elles parallèles ?
- Oui, car les rapports sont égaux
- Non, car $\dfrac{4}{10} \neq \dfrac{5}{12}$ [ok]
- Oui, car $4 + 10 = 14$
- On ne peut pas savoir
> $\dfrac{4}{10} = 0{,}4$ et $\dfrac{5}{12} \approx 0{,}417$. Les rapports sont différents : les droites ne sont pas parallèles.
? [D] Un modèle réduit d'un bateau est à l'échelle $\dfrac{1}{50}$. Son volume de stockage fait $2$ litres. Quel est le volume réel ?
- $100$ litres
- $5\,000$ litres
- $250\,000$ litres [ok]
- $125\,000$ litres
> Les volumes sont multipliés par $k^3$ avec $k = 50$ : $50^3 = 125\,000$, donc $2 \times 125\,000 = 250\,000$ litres.

--- CHAPITRE: Les systèmes d'équations | xp: 25
## Le principe

Un **système de deux équations à deux inconnues** $x$ et $y$ s'écrit :

$$\begin{cases} x + y = 10 \\ x - y = 2 \end{cases}$$

**Résoudre** le système, c'est trouver tous les couples $(x\,;\,y)$ qui vérifient les deux équations à la fois.

## Méthode par addition (combinaison)

On additionne ou on soustrait les équations pour **éliminer** une inconnue.

Ici, on additionne : $2x = 12$, donc $x = 6$. On remplace dans la première : $6 + y = 10$, donc $y = 4$.

Solution : $(6\,;\,4)$. **Vérification :** $6 + 4 = 10$ et $6 - 4 = 2$. ✓

## Méthode par substitution

On exprime une inconnue en fonction de l'autre, puis on remplace.

$$\begin{cases} 2x + y = 11 \\ x + y = 7 \end{cases}$$

De la 2ᵉ équation : $y = 7 - x$. On remplace : $2x + 7 - x = 11$, donc $x = 4$ et $y = 3$.

## Résoudre un problème

1. Choisir **deux inconnues**.
2. Écrire **deux équations**.
3. Résoudre le système.
4. Répondre par une phrase.

Exemple : 2 stylos et 3 cahiers coûtent $1\,100$ F, et 3 stylos et 1 cahier coûtent $600$ F. Avec $s$ le prix d'un stylo et $c$ celui d'un cahier : $\begin{cases} 2s + 3c = 1100 \\ 3s + c = 600 \end{cases}$. Un stylo coûte $100$ F et un cahier $300$ F.

--- QUIZ: Quiz : Les systèmes d'équations | xp: 50
? [F] Quelle est la solution du système $\begin{cases} x + y = 10 \\ x - y = 2 \end{cases}$ ?
- $(4\,;\,6)$
- $(6\,;\,4)$ [ok]
- $(5\,;\,5)$
- $(8\,;\,2)$
> En additionnant : $2x = 12$, donc $x = 6$ puis $y = 4$.
? [F] Le couple $(2\,;\,3)$ est-il solution de $x + y = 5$ ?
- Oui [ok]
- Non
- Seulement si $x > y$
- On ne peut pas savoir
> $2 + 3 = 5$ : l'équation est vérifiée.
? [F] Combien d'inconnues contient un système $\begin{cases} x + y = 4 \\ x - y = 0 \end{cases}$ ?
- $1$
- $2$ [ok]
- $3$
- $4$
> Les inconnues sont $x$ et $y$.
? [M] Résous $\begin{cases} 2x + y = 11 \\ x + y = 7 \end{cases}$.
- $(4\,;\,3)$ [ok]
- $(3\,;\,4)$
- $(2\,;\,5)$
- $(5\,;\,1)$
> On soustrait les deux équations : $x = 4$. Puis $4 + y = 7$ donne $y = 3$.
? [M] Résous $\begin{cases} x + 2y = 8 \\ x - y = 2 \end{cases}$.
- $(4\,;\,2)$ [ok]
- $(2\,;\,3)$
- $(6\,;\,1)$
- $(0\,;\,4)$
> On soustrait : $3y = 6$, donc $y = 2$. Puis $x = 2 + 2 = 4$.
? [M] La somme de deux nombres est $15$ et leur différence est $3$. Quels sont ces nombres ?
- $9$ et $6$ [ok]
- $10$ et $5$
- $8$ et $7$
- $12$ et $3$
> $x + y = 15$ et $x - y = 3$ donnent $2x = 18$, donc $x = 9$ et $y = 6$.
? [D] $2$ stylos et $3$ cahiers coûtent $1\,100$ F. $3$ stylos et $1$ cahier coûtent $600$ F. Quel est le prix d'un cahier ?
- $100$ F
- $200$ F
- $300$ F [ok]
- $400$ F
> Avec $c = 600 - 3s$ : $2s + 1800 - 9s = 1100$, donc $-7s = -700$ et $s = 100$. Puis $c = 600 - 300 = 300$ F.
? [D] Au marché, Awa achète $3$ kg de tomates et $2$ kg d'oignons pour $2\,400$ F. Fatou achète $1$ kg de tomates et $2$ kg d'oignons pour $1\,200$ F. Quel est le prix d'un kilo de tomates ?
- $500$ F
- $600$ F [ok]
- $700$ F
- $400$ F
> En soustrayant les deux achats : $2t = 1200$, donc $t = 600$ F. Oignons : $600 + 2o = 1200$ donne $o = 300$ F.

--- CHAPITRE: Fonctions linéaires et affines | xp: 25
## Fonction linéaire

Une **fonction linéaire** s'écrit $f(x) = ax$. Sa représentation graphique est une **droite qui passe par l'origine** du repère.

Si $f(x) = 3x$ : $f(4) = 12$. Le nombre $a$ est le **coefficient**.

## Fonction affine

Une **fonction affine** s'écrit :

$$f(x) = ax + b$$

Sa représentation est une **droite**. Le nombre $a$ est le **coefficient directeur** (la pente) et $b$ l'**ordonnée à l'origine** (la valeur de $f(0)$).

Pour $f(x) = 2x + 1$ :
- $f(-3) = 2 \times (-3) + 1 = -5$ ;
- l'**antécédent** de $7$ est la solution de $2x + 1 = 7$, c'est-à-dire $x = 3$.

## Calculer $a$ et $b$ avec deux points

Si $f(x_1) = y_1$ et $f(x_2) = y_2$ :

$$a = \frac{y_2 - y_1}{x_2 - x_1} \qquad b = y_1 - a x_1$$

Exemple : $f(2) = 7$ et $f(-1) = -2$. Alors $a = \dfrac{7 - (-2)}{2 - (-1)} = 3$ et $b = 7 - 3 \times 2 = 1$, donc $f(x) = 3x + 1$.

## Sens de variation

- si $a > 0$, la fonction est **croissante** ;
- si $a < 0$, la fonction est **décroissante** ;
- si $a = 0$, elle est **constante**.

> **Application :** un taxi facture $500$ F de prise en charge plus $200$ F par kilomètre. Le prix pour $x$ km est $f(x) = 200x + 500$. Pour $12$ km : $200 \times 12 + 500 = 2\,900$ F.

--- QUIZ: Quiz : Fonctions linéaires et affines | xp: 50
? [F] Pour $f(x) = 3x$, combien vaut $f(4)$ ?
- $7$
- $12$ [ok]
- $34$
- $1$
> $f(4) = 3 \times 4 = 12$.
? [F] Quelle est l'ordonnée à l'origine de $f(x) = 2x + 5$ ?
- $2$
- $5$ [ok]
- $7$
- $-5$
> L'ordonnée à l'origine est $b = f(0) = 5$.
? [F] La représentation graphique d'une fonction linéaire est…
- une parabole
- une droite qui passe par l'origine [ok]
- une droite horizontale
- une courbe quelconque
> $f(x) = ax$ donne $f(0) = 0$ : c'est une droite passant par l'origine du repère.
? [M] Pour $f(x) = 2x + 1$, quelle est la valeur de $f(-3)$ ?
- $-5$ [ok]
- $-7$
- $7$
- $-6$
> $f(-3) = 2 \times (-3) + 1 = -6 + 1 = -5$.
? [M] Quel est l'antécédent de $7$ par $f(x) = 2x + 1$ ?
- $15$
- $3$ [ok]
- $4$
- $-3$
> On résout $2x + 1 = 7$ : $2x = 6$, donc $x = 3$.
? [M] Un taxi facture $500$ F de prise en charge plus $200$ F par km. Quel est le prix pour $12$ km ?
- $2\,400$ F
- $2\,900$ F [ok]
- $2\,500$ F
- $3\,100$ F
> $f(12) = 200 \times 12 + 500 = 2\,400 + 500 = 2\,900$ F.
? [D] Une fonction affine $f$ vérifie $f(2) = 7$ et $f(-1) = -2$. Quelle est son expression ?
- $f(x) = 3x + 1$ [ok]
- $f(x) = 2x + 3$
- $f(x) = 3x - 1$
- $f(x) = 5x - 3$
> $a = \dfrac{7 - (-2)}{2 - (-1)} = 3$ et $b = 7 - 3 \times 2 = 1$. Vérification : $f(-1) = -3 + 1 = -2$.
? [D] La fonction $f(x) = -2x + 6$ est…
- croissante, car $6 > 0$
- décroissante, car $a = -2 < 0$ [ok]
- constante
- croissante, car elle passe par $(0\,;\,6)$
> Le sens de variation dépend du signe de $a$ : ici $a = -2 < 0$, donc la fonction est décroissante.
