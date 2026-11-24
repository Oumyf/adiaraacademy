matiere: MATHEMATIQUES
niveau: LYCEE
classe: Seconde
titre: Mathématiques Seconde : fonctions, vecteurs et statistiques
description: Généralités sur les fonctions, vecteurs du plan et statistiques descriptives : les bases du lycée pour bien démarrer.
premium: non

--- CHAPITRE: Généralités sur les fonctions | xp: 25
## Définition

Une **fonction** $f$ associe à chaque nombre $x$ d'un ensemble $D$ (l'**ensemble de définition**) **un unique** nombre noté $f(x)$, appelé **image** de $x$.

Si $f(x) = y$, on dit que $x$ est un **antécédent** de $y$. Un nombre peut avoir plusieurs antécédents.

## Ensemble de définition

Trouver l'ensemble de définition, c'est repérer les valeurs **interdites** :

- on ne divise pas par $0$ : $f(x) = \dfrac{1}{x - 2}$ n'est pas définie en $x = 2$ ;
- on ne prend pas la racine carrée d'un nombre négatif : $f(x) = \sqrt{x - 1}$ est définie pour $x \geq 1$.

## Lecture graphique

- L'**image** de $a$ se lit sur l'axe des ordonnées, en partant de $a$ sur l'axe des abscisses.
- Les **antécédents** de $k$ s'obtiennent en traçant la droite horizontale $y = k$ et en lisant les abscisses des points d'intersection.

## Variations

- $f$ est **croissante** sur un intervalle $I$ si $x_1 < x_2$ entraîne $f(x_1) \leq f(x_2)$.
- $f$ est **décroissante** si $x_1 < x_2$ entraîne $f(x_1) \geq f(x_2)$.

Un **tableau de variations** résume ces informations avec des flèches.

## Exemple

Soit $f(x) = x^2 - 4$.
- $f(3) = 9 - 4 = 5$ ;
- les antécédents de $0$ : $x^2 = 4$ donc $x = 2$ ou $x = -2$ ;
- $f$ est décroissante sur $]-\infty\,;\,0]$ et croissante sur $[0\,;\,+\infty[$.

> **À retenir :** une image est unique, mais un nombre peut avoir $0$, $1$ ou plusieurs antécédents.

--- QUIZ: Quiz : Généralités sur les fonctions | xp: 50
? [F] Pour $f(x) = x^2 - 4$, combien vaut $f(3)$ ?
- $2$
- $5$ [ok]
- $13$
- $-1$
> $f(3) = 3^2 - 4 = 9 - 4 = 5$.
? [F] Une fonction associe à chaque $x$ de son ensemble de définition…
- plusieurs images
- une unique image [ok]
- aucune image
- exactement deux images
> Par définition d'une fonction, chaque $x$ a une seule image.
? [F] Pour quelle valeur $f(x) = \dfrac{1}{x - 2}$ n'est-elle pas définie ?
- $x = 0$
- $x = 1$
- $x = 2$ [ok]
- $x = -2$
> On ne peut pas diviser par zéro : $x - 2 = 0$ donne $x = 2$.
? [M] Quels sont les antécédents de $0$ par $f(x) = x^2 - 4$ ?
- $2$ seulement
- $-2$ et $2$ [ok]
- $4$ et $-4$
- Il n'y en a pas
> $x^2 - 4 = 0$ équivaut à $x^2 = 4$, donc $x = 2$ ou $x = -2$.
? [M] Quel est l'ensemble de définition de $f(x) = \sqrt{x - 1}$ ?
- $\mathbb{R}$
- $[1\,;\,+\infty[$ [ok]
- $]1\,;\,+\infty[$
- $[0\,;\,+\infty[$
> Il faut $x - 1 \geq 0$, soit $x \geq 1$. La racine de $0$ existe : $x = 1$ est inclus.
? [M] $f$ est croissante sur $[0\,;\,5]$ et $f(1) = 3$. Quelle affirmation est certaine ?
- $f(4) \geq 3$ [ok]
- $f(4) < 3$
- $f(0) > 3$
- $f(4) = 3$
> Sur un intervalle où $f$ est croissante, $x_1 < x_2$ entraîne $f(x_1) \leq f(x_2)$. Comme $1 < 4$, on a $f(4) \geq f(1) = 3$.
? [D] Quel est l'ensemble de définition de $f(x) = \dfrac{x + 1}{x^2 - 9}$ ?
- $\mathbb{R} \setminus \{3\}$
- $\mathbb{R} \setminus \{-3\,;\,3\}$ [ok]
- $\mathbb{R} \setminus \{9\}$
- $\mathbb{R}$
> Le dénominateur s'annule pour $x^2 = 9$, soit $x = 3$ ou $x = -3$. Ces deux valeurs sont interdites.
? [D] Combien d'antécédents le nombre $-1$ possède-t-il par $f(x) = x^2$ ?
- $2$
- $1$
- $0$ [ok]
- Une infinité
> Un carré est toujours positif ou nul : l'équation $x^2 = -1$ n'a pas de solution réelle.

--- CHAPITRE: Les vecteurs du plan | xp: 25
## Qu'est-ce qu'un vecteur ?

Un **vecteur** $\overrightarrow{AB}$ est défini par trois informations : une **direction** (celle de la droite $(AB)$), un **sens** (de $A$ vers $B$) et une **norme** (la longueur $AB$).

Deux vecteurs sont **égaux** s'ils ont même direction, même sens et même norme. $\overrightarrow{AB} = \overrightarrow{CD}$ équivaut à dire que $ABDC$ est un parallélogramme (éventuellement aplati).

## Coordonnées

Dans un repère, si $A(x_A\,;\,y_A)$ et $B(x_B\,;\,y_B)$ :

$$\overrightarrow{AB} \begin{pmatrix} x_B - x_A \\ y_B - y_A \end{pmatrix}$$

Exemple : $A(1\,;\,2)$ et $B(4\,;\,6)$ donnent $\overrightarrow{AB}(3\,;\,4)$.

## Norme

$$\|\overrightarrow{AB}\| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$$

Pour $\overrightarrow{AB}(3\,;\,4)$ : $\|\overrightarrow{AB}\| = \sqrt{9 + 16} = 5$.

## Somme et produit par un réel

- $\vec{u}(x\,;\,y) + \vec{v}(x'\,;\,y') = (x + x'\,;\,y + y')$ ;
- $k\vec{u} = (kx\,;\,ky)$.

**Relation de Chasles :** $\overrightarrow{AB} + \overrightarrow{BC} = \overrightarrow{AC}$.

## Colinéarité

Deux vecteurs $\vec{u}(x\,;\,y)$ et $\vec{v}(x'\,;\,y')$ sont **colinéaires** si et seulement si :

$$x y' - y x' = 0$$

Trois points $A$, $B$, $C$ sont **alignés** si et seulement si $\overrightarrow{AB}$ et $\overrightarrow{AC}$ sont colinéaires.

> **Milieu :** si $I$ est le milieu de $[AB]$, alors $I\left(\dfrac{x_A + x_B}{2}\,;\,\dfrac{y_A + y_B}{2}\right)$.

--- QUIZ: Quiz : Les vecteurs du plan | xp: 50
? [F] Quelles sont les coordonnées de $\overrightarrow{AB}$ pour $A(1\,;\,2)$ et $B(4\,;\,6)$ ?
- $(5\,;\,8)$
- $(3\,;\,4)$ [ok]
- $(-3\,;\,-4)$
- $(4\,;\,12)$
> On soustrait les coordonnées de $A$ à celles de $B$ : $(4 - 1\,;\,6 - 2) = (3\,;\,4)$.
? [F] Combien vaut $\overrightarrow{AB} + \overrightarrow{BC}$ ?
- $\overrightarrow{AC}$ [ok]
- $\overrightarrow{CA}$
- $\overrightarrow{BA}$
- $\vec{0}$
> C'est la relation de Chasles.
? [F] Quelle est la norme du vecteur $\vec{u}(3\,;\,4)$ ?
- $7$
- $5$ [ok]
- $25$
- $12$
> $\|\vec{u}\| = \sqrt{3^2 + 4^2} = \sqrt{25} = 5$.
? [M] Quelles sont les coordonnées de $2\vec{u} + \vec{v}$ pour $\vec{u}(1\,;\,-2)$ et $\vec{v}(3\,;\,5)$ ?
- $(5\,;\,1)$ [ok]
- $(4\,;\,3)$
- $(5\,;\,-9)$
- $(2\,;\,-4)$
> $2\vec{u} = (2\,;\,-4)$, puis on ajoute $\vec{v}$ : $(2 + 3\,;\,-4 + 5) = (5\,;\,1)$.
? [M] Les vecteurs $\vec{u}(2\,;\,3)$ et $\vec{v}(4\,;\,6)$ sont-ils colinéaires ?
- Oui, car $2 \times 6 - 3 \times 4 = 0$ [ok]
- Non, car $2 \neq 4$
- Non, car $2 + 3 \neq 4 + 6$
- Oui, car ils ont la même norme
> $x y' - y x' = 2 \times 6 - 3 \times 4 = 12 - 12 = 0$ : les vecteurs sont colinéaires ($\vec{v} = 2\vec{u}$).
? [M] Quelles sont les coordonnées du milieu de $[AB]$ avec $A(2\,;\,1)$ et $B(8\,;\,5)$ ?
- $(10\,;\,6)$
- $(5\,;\,3)$ [ok]
- $(6\,;\,4)$
- $(3\,;\,2)$
> On fait la moyenne des abscisses et des ordonnées : $\left(\dfrac{2 + 8}{2}\,;\,\dfrac{1 + 5}{2}\right) = (5\,;\,3)$.
? [D] $A(1\,;\,1)$, $B(3\,;\,2)$, $C(7\,;\,4)$. Ces points sont-ils alignés ?
- Oui [ok]
- Non
- Seulement $A$ et $B$ le sont
- On ne peut pas savoir
> $\overrightarrow{AB}(2\,;\,1)$ et $\overrightarrow{AC}(6\,;\,3)$. Comme $2 \times 3 - 1 \times 6 = 0$, ils sont colinéaires : les points sont alignés.
? [D] $ABCD$ est un parallélogramme avec $A(0\,;\,0)$, $B(4\,;\,1)$, $C(5\,;\,4)$. Quelles sont les coordonnées de $D$ ?
- $(1\,;\,3)$ [ok]
- $(9\,;\,5)$
- $(3\,;\,1)$
- $(1\,;\,5)$
> Pour $ABCD$ parallélogramme : $\overrightarrow{AB} = \overrightarrow{DC}$. $\overrightarrow{AB}(4\,;\,1)$, donc $D = C - \overrightarrow{AB} = (5 - 4\,;\,4 - 1) = (1\,;\,3)$.

--- CHAPITRE: Statistiques descriptives | xp: 25
## Le vocabulaire

On étudie un **caractère** (une note, une taille, un âge) sur une **population**. Les valeurs observées forment une **série statistique**.

## Mesures de position

- La **moyenne** : $\bar{x} = \dfrac{\text{somme des valeurs}}{\text{effectif total}}$.
- La **médiane** : valeur qui partage la série ordonnée en deux groupes de même effectif.
- Le **mode** : la valeur la plus fréquente.

Pour la série $4, 7, 7, 9, 13$ : moyenne $\dfrac{4 + 7 + 7 + 9 + 13}{5} = 8$, médiane $7$ (valeur du milieu), mode $7$.

## Moyenne pondérée

Si la valeur $x_i$ a pour effectif $n_i$ :

$$\bar{x} = \frac{n_1 x_1 + n_2 x_2 + \dots + n_p x_p}{n_1 + n_2 + \dots + n_p}$$

Exemple : $10$ élèves ont eu $8$, $15$ élèves ont eu $12$. La moyenne est $\dfrac{10 \times 8 + 15 \times 12}{25} = \dfrac{260}{25} = 10{,}4$.

## Médiane et quartiles

Pour une série de $N$ valeurs rangées dans l'ordre croissant :

- si $N$ est impair, la médiane est la valeur de rang $\dfrac{N + 1}{2}$ ;
- si $N$ est pair, c'est la moyenne des valeurs de rang $\dfrac{N}{2}$ et $\dfrac{N}{2} + 1$.

Le **premier quartile** $Q_1$ et le **troisième quartile** $Q_3$ encadrent la moitié centrale des données. L'**écart interquartile** vaut $Q_3 - Q_1$.

> **À retenir :** la médiane est peu sensible aux valeurs extrêmes, contrairement à la moyenne.

--- QUIZ: Quiz : Statistiques descriptives | xp: 50
? [F] Quelle est la moyenne de la série $4, 7, 7, 9, 13$ ?
- $7$
- $8$ [ok]
- $9$
- $40$
> Somme : $4 + 7 + 7 + 9 + 13 = 40$. Effectif : $5$. Moyenne : $40 \div 5 = 8$.
? [F] Quel est le mode de la série $2, 3, 3, 5, 3, 8$ ?
- $2$
- $3$ [ok]
- $5$
- $8$
> Le mode est la valeur qui apparaît le plus souvent : $3$ apparaît trois fois.
? [F] Quelle est la médiane de $3, 5, 8, 10, 12$ ?
- $5$
- $8$ [ok]
- $7{,}6$
- $10$
> $N = 5$ est impair : la médiane est la $3$ᵉ valeur, soit $8$.
? [M] Quelle est la médiane de $2, 4, 6, 10$ ?
- $5$ [ok]
- $4$
- $6$
- $22$
> $N = 4$ est pair : on fait la moyenne de la $2$ᵉ et de la $3$ᵉ valeur : $\dfrac{4 + 6}{2} = 5$.
? [M] $10$ élèves ont eu $8$ et $15$ élèves ont eu $12$. Quelle est la moyenne de la classe ?
- $10$
- $10{,}4$ [ok]
- $11$
- $9{,}6$
> $\dfrac{10 \times 8 + 15 \times 12}{25} = \dfrac{80 + 180}{25} = \dfrac{260}{25} = 10{,}4$.
? [M] On ajoute une valeur très grande à une série. Quelle grandeur change le plus ?
- La médiane
- Le mode
- La moyenne [ok]
- Aucune
> La moyenne tient compte de toutes les valeurs, y compris extrêmes. La médiane y est peu sensible.
? [D] La moyenne de $4$ notes est $12$. On ajoute une $5$ᵉ note et la moyenne passe à $13$. Quelle est cette cinquième note ?
- $13$
- $14$
- $17$ [ok]
- $16$
> Somme des $4$ notes : $48$. Somme des $5$ notes : $13 \times 5 = 65$. La note ajoutée vaut $65 - 48 = 17$.
? [D] Dans une série rangée de $9$ valeurs, quelle est la position de la médiane ?
- La $4$ᵉ valeur
- La $5$ᵉ valeur [ok]
- La $6$ᵉ valeur
- La moyenne de la $4$ᵉ et de la $5$ᵉ
> $N = 9$ est impair : la médiane est la valeur de rang $\dfrac{9 + 1}{2} = 5$.
