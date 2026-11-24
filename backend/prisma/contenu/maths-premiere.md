matiere: MATHEMATIQUES
niveau: LYCEE
classe: Première S
titre: Mathématiques Première S : dérivation, second degré et suites
description: Les trois chapitres piliers de la Première S : nombre dérivé et dérivées, équations du second degré, suites arithmétiques et géométriques.
premium: non

--- CHAPITRE: Dérivation | xp: 30
## Nombre dérivé et tangente

Le **nombre dérivé** de $f$ en $a$, noté $f'(a)$, est le coefficient directeur de la **tangente** à la courbe au point d'abscisse $a$ :

$$f'(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h}$$

L'**équation de la tangente** en $a$ est :

$$y = f'(a)(x - a) + f(a)$$

## Dérivées usuelles

| $f(x)$ | $f'(x)$ |
|---|---|
| $k$ (constante) | $0$ |
| $x$ | $1$ |
| $x^n$ | $n x^{n-1}$ |
| $\dfrac{1}{x}$ | $-\dfrac{1}{x^2}$ |
| $\sqrt{x}$ | $\dfrac{1}{2\sqrt{x}}$ |

## Opérations

$$(u + v)' = u' + v' \qquad (ku)' = ku' \qquad (uv)' = u'v + uv' \qquad \left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}$$

Exemple : $f(x) = (2x + 1)(x - 3)$ donne $f'(x) = 2(x - 3) + (2x + 1) \times 1 = 4x - 5$.

## Sens de variation

- si $f'(x) > 0$ sur un intervalle, $f$ est **croissante** ;
- si $f'(x) < 0$, $f$ est **décroissante** ;
- si $f'$ s'annule en changeant de signe, $f$ a un **extremum**.

Exemple : $f(x) = x^3 - 3x$ donne $f'(x) = 3x^2 - 3 = 3(x - 1)(x + 1)$. $f$ est croissante sur $]-\infty\,;\,-1]$, décroissante sur $[-1\,;\,1]$, croissante sur $[1\,;\,+\infty[$.

> **Méthode :** pour étudier une fonction, dérive, factorise $f'$, dresse le tableau de signes, puis le tableau de variations.

--- QUIZ: Quiz : Dérivation | xp: 50
? [F] Quelle est la dérivée de $f(x) = x^2$ ?
- $x$
- $2x$ [ok]
- $x^3$
- $2$
> $(x^n)' = n x^{n-1}$ avec $n = 2$ : $2x$.
? [F] Quelle est la dérivée de $f(x) = 5x + 3$ ?
- $5x$
- $3$
- $5$ [ok]
- $8$
> La dérivée de $5x$ est $5$ et celle de la constante $3$ est $0$.
? [F] Que représente le nombre dérivé $f'(a)$ ?
- L'ordonnée du point d'abscisse $a$
- Le coefficient directeur de la tangente en $a$ [ok]
- L'aire sous la courbe
- La valeur maximale de $f$
> Géométriquement, $f'(a)$ est la pente de la tangente à la courbe au point d'abscisse $a$.
? [M] Quelle est la dérivée de $f(x) = 3x^2 - 5x + 1$ ?
- $6x - 5$ [ok]
- $3x - 5$
- $6x + 1$
- $6x^2 - 5$
> $(3x^2)' = 6x$, $(-5x)' = -5$ et $(1)' = 0$.
? [M] Quelle est la dérivée de $f(x) = (2x + 1)(x - 3)$ ?
- $2x - 3$
- $4x - 5$ [ok]
- $4x + 5$
- $2$
> $(uv)' = u'v + uv'$ : $2(x - 3) + (2x + 1) = 4x - 5$. On peut aussi développer : $2x^2 - 5x - 3$, dérivée $4x - 5$.
? [M] Quelle est l'équation de la tangente à $f(x) = x^2$ au point d'abscisse $3$ ?
- $y = 6x - 9$ [ok]
- $y = 3x - 9$
- $y = 6x + 9$
- $y = 9x - 6$
> $f(3) = 9$ et $f'(3) = 6$. Donc $y = 6(x - 3) + 9 = 6x - 9$.
? [D] Sur quel intervalle $f(x) = x^3 - 3x$ est-elle décroissante ?
- $[0\,;\,3]$
- $[-1\,;\,1]$ [ok]
- $]-\infty\,;\,-1]$
- $[1\,;\,+\infty[$
> $f'(x) = 3x^2 - 3 = 3(x - 1)(x + 1)$ est négative entre $-1$ et $1$ : $f$ y est décroissante.
? [D] Quelle est la valeur du minimum local de $f(x) = x^3 - 3x$ ?
- $2$
- $0$
- $-2$ [ok]
- $-1$
> Le minimum local est atteint en $x = 1$ (où $f'$ passe de $-$ à $+$) : $f(1) = 1 - 3 = -2$.

--- CHAPITRE: Le second degré | xp: 30
## La forme générale

Un **trinôme du second degré** s'écrit $ax^2 + bx + c$ avec $a \neq 0$.

## Le discriminant

On calcule $\Delta = b^2 - 4ac$.

- Si $\Delta > 0$ : **deux solutions** $x_1 = \dfrac{-b - \sqrt{\Delta}}{2a}$ et $x_2 = \dfrac{-b + \sqrt{\Delta}}{2a}$.
- Si $\Delta = 0$ : **une solution double** $x_0 = -\dfrac{b}{2a}$.
- Si $\Delta < 0$ : **aucune solution réelle**.

Exemple : $x^2 - 5x + 6 = 0$ donne $\Delta = 25 - 24 = 1$, donc $x_1 = \dfrac{5 - 1}{2} = 2$ et $x_2 = \dfrac{5 + 1}{2} = 3$.

## Somme et produit des racines

Si les racines existent :

$$x_1 + x_2 = -\frac{b}{a} \qquad x_1 \times x_2 = \frac{c}{a}$$

## Signe du trinôme

- Si $\Delta > 0$ : le trinôme est du **signe de $a$ à l'extérieur des racines** et du signe contraire entre les racines.
- Si $\Delta \leq 0$ : il est toujours du signe de $a$ (sauf en la racine double).

Exemple : $x^2 - 5x + 6 < 0$ pour $x \in ]2\,;\,3[$.

## Forme canonique

$$ax^2 + bx + c = a\left[\left(x + \frac{b}{2a}\right)^2 - \frac{\Delta}{4a^2}\right]$$

Exemple : $x^2 - 4x + 7 = (x - 2)^2 + 3$. Le minimum est $3$, atteint en $x = 2$.

> **Réflexe :** avant d'utiliser $\Delta$, regarde s'il y a un facteur commun ou une identité remarquable : c'est souvent plus rapide.

--- QUIZ: Quiz : Le second degré | xp: 50
? [F] Quel est le discriminant de $x^2 - 5x + 6$ ?
- $-1$
- $1$ [ok]
- $11$
- $49$
> $\Delta = b^2 - 4ac = 25 - 24 = 1$.
? [F] Combien de solutions réelles a $x^2 + 2x + 5 = 0$ ?
- $0$ [ok]
- $1$
- $2$
- $4$
> $\Delta = 4 - 20 = -16 < 0$ : il n'y a pas de solution réelle.
? [F] Si $\Delta = 0$, combien l'équation a-t-elle de solutions ?
- Aucune
- Une (solution double) [ok]
- Deux
- Une infinité
> Pour $\Delta = 0$, la solution unique est $x_0 = -\dfrac{b}{2a}$.
? [M] Résous $x^2 - 5x + 6 = 0$.
- $x = 1$ ou $x = 6$
- $x = 2$ ou $x = 3$ [ok]
- $x = -2$ ou $x = -3$
- $x = 5$ ou $x = 6$
> $\Delta = 1$ donc $x = \dfrac{5 \pm 1}{2}$, soit $2$ et $3$. Vérification : somme $5$ et produit $6$.
? [M] Résous $2x^2 - 3x - 2 = 0$.
- $x = 2$ ou $x = -\dfrac{1}{2}$ [ok]
- $x = -2$ ou $x = \dfrac{1}{2}$
- $x = 1$ ou $x = -2$
- $x = 2$ ou $x = \dfrac{1}{2}$
> $\Delta = 9 + 16 = 25$ donc $x = \dfrac{3 \pm 5}{4}$, soit $2$ et $-\dfrac{1}{2}$.
? [M] Pour quel intervalle a-t-on $x^2 - 5x + 6 < 0$ ?
- $]-\infty\,;\,2[ \cup ]3\,;\,+\infty[$
- $]2\,;\,3[$ [ok]
- $]-3\,;\,-2[$
- $[2\,;\,3]$
> Le trinôme est du signe de $a = 1 > 0$ à l'extérieur des racines, donc négatif strictement entre $2$ et $3$.
? [D] Deux nombres ont pour somme $7$ et pour produit $10$. Quels sont-ils ?
- $1$ et $6$
- $2$ et $5$ [ok]
- $3$ et $4$
- $-2$ et $-5$
> Ils sont solutions de $x^2 - 7x + 10 = 0$ : $\Delta = 9$, donc $x = \dfrac{7 \pm 3}{2}$, soit $2$ et $5$.
? [D] Pour quelles valeurs de $m$ l'équation $x^2 + mx + 9 = 0$ admet-elle une racine double ?
- $m = 3$ ou $m = -3$
- $m = 6$ ou $m = -6$ [ok]
- $m = 9$
- $m = 0$
> Racine double si $\Delta = m^2 - 36 = 0$, donc $m = 6$ ou $m = -6$.

--- CHAPITRE: Les suites numériques | xp: 30
## Suites arithmétiques

Une suite $(u_n)$ est **arithmétique** de raison $r$ si l'on passe d'un terme au suivant en **ajoutant** toujours $r$ :

$$u_{n+1} = u_n + r \qquad u_n = u_0 + n r$$

Exemple : $u_0 = 3$ et $r = 4$ donnent $u_{10} = 3 + 40 = 43$.

**Somme des termes** de $u_0$ à $u_n$ :

$$S = (n + 1) \times \frac{u_0 + u_n}{2}$$

Cas célèbre : $1 + 2 + \dots + n = \dfrac{n(n + 1)}{2}$. Ainsi $1 + 2 + \dots + 10 = 55$.

## Suites géométriques

Une suite $(u_n)$ est **géométrique** de raison $q$ si l'on passe d'un terme au suivant en **multipliant** toujours par $q$ :

$$u_{n+1} = q \times u_n \qquad u_n = u_0 \times q^n$$

Exemple : $u_0 = 2$ et $q = 3$ donnent $u_4 = 2 \times 3^4 = 162$.

**Somme** (pour $q \neq 1$) :

$$u_0 + u_1 + \dots + u_n = u_0 \times \frac{1 - q^{n+1}}{1 - q}$$

## Applications

- **Épargne** : un capital de $10\,000$ F placé avec $5\ \%$ d'intérêts par an est multiplié par $1{,}05$ chaque année. C'est une suite géométrique de raison $1{,}05$.
- **Loyer** qui augmente de $2\,000$ F chaque année : suite arithmétique de raison $2\,000$.

> **Comment reconnaître le type :** si la différence $u_{n+1} - u_n$ est constante, la suite est arithmétique. Si le quotient $\dfrac{u_{n+1}}{u_n}$ est constant, elle est géométrique.

--- QUIZ: Quiz : Les suites numériques | xp: 50
? [F] La suite $u_{n+1} = u_n + 3$ est…
- géométrique de raison $3$
- arithmétique de raison $3$ [ok]
- arithmétique de raison $u_n$
- constante
> On ajoute toujours le même nombre $3$ : c'est une suite arithmétique de raison $3$.
? [F] Pour une suite arithmétique avec $u_0 = 3$ et $r = 4$, combien vaut $u_{10}$ ?
- $43$ [ok]
- $40$
- $34$
- $47$
> $u_{10} = u_0 + 10r = 3 + 40 = 43$.
? [F] Pour $u_0 = 2$ et $q = 3$, combien vaut $u_4$ ?
- $14$
- $54$
- $162$ [ok]
- $24$
> $u_4 = u_0 \times q^4 = 2 \times 81 = 162$.
? [M] Calcule $1 + 2 + 3 + \dots + 10$.
- $50$
- $55$ [ok]
- $100$
- $110$
> $\dfrac{n(n + 1)}{2} = \dfrac{10 \times 11}{2} = 55$.
? [M] Une suite arithmétique vérifie $u_3 = 11$ et $u_7 = 23$. Quelle est sa raison ?
- $2$
- $3$ [ok]
- $4$
- $12$
> $u_7 - u_3 = 4r = 12$, donc $r = 3$.
? [M] Un capital de $10\,000$ F augmente de $5\ \%$ par an. Combien vaut-il après $2$ ans ?
- $11\,000$ F
- $11\,025$ F [ok]
- $10\,500$ F
- $12\,000$ F
> Suite géométrique de raison $1{,}05$ : $10\,000 \times 1{,}05^2 = 11\,025$ F.
? [D] Quelle est la somme des $10$ premiers termes de $u_n = 3n + 2$ (de $u_0$ à $u_9$) ?
- $155$ [ok]
- $150$
- $310$
- $145$
> $u_0 = 2$ et $u_9 = 29$. $S = 10 \times \dfrac{2 + 29}{2} = 155$.
? [D] Calcule $1 + 2 + 4 + 8 + 16 + 32$.
- $31$
- $62$
- $63$ [ok]
- $64$
> Suite géométrique de raison $2$ avec $6$ termes : $1 \times \dfrac{2^6 - 1}{2 - 1} = 63$.
