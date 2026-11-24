matiere: MATHEMATIQUES
niveau: LYCEE
classe: Terminale S
titre: Mathématiques Terminale S : limites, logarithme et intégrales
description: Limites et continuité, fonction logarithme népérien et calcul intégral : les chapitres clés pour réussir le BAC scientifique.
premium: non

--- CHAPITRE: Limites et continuité | xp: 35
## Limites en l'infini

Les limites de référence à connaître :

$$\lim_{x \to +\infty} x^n = +\infty \qquad \lim_{x \to +\infty} \frac{1}{x} = 0 \qquad \lim_{x \to 0^+} \frac{1}{x} = +\infty \qquad \lim_{x \to 0^-} \frac{1}{x} = -\infty$$

Pour un polynôme ou une fraction rationnelle en $\pm\infty$, **seul le terme de plus haut degré compte**.

$$\lim_{x \to +\infty} \frac{3x + 1}{x + 2} = \lim_{x \to +\infty} \frac{3x}{x} = 3 \qquad \lim_{x \to +\infty} \frac{x^2 + x}{2x^2 - 1} = \frac{1}{2}$$

## Formes indéterminées

Les formes « $\infty - \infty$ », « $\dfrac{\infty}{\infty}$ », « $0 \times \infty$ » et « $\dfrac{0}{0}$ » ne permettent pas de conclure directement : il faut **transformer** l'expression (factoriser, simplifier, multiplier par la quantité conjuguée).

Exemple : $\lim_{x \to 1} \dfrac{x^2 - 1}{x - 1} = \lim_{x \to 1} (x + 1) = 2$.

## Asymptotes

- Si $\lim_{x \to \pm\infty} f(x) = \ell$, la droite $y = \ell$ est **asymptote horizontale**.
- Si $\lim_{x \to a} f(x) = \pm\infty$, la droite $x = a$ est **asymptote verticale**.

Exemple : $f(x) = \dfrac{2x + 1}{x - 3}$ admet l'asymptote verticale $x = 3$ et l'asymptote horizontale $y = 2$.

## Continuité et théorème des valeurs intermédiaires

Une fonction est **continue** sur un intervalle si on peut tracer sa courbe sans lever le crayon.

**Théorème des valeurs intermédiaires :** si $f$ est continue et **strictement monotone** sur $[a\,;\,b]$, alors pour tout $k$ compris entre $f(a)$ et $f(b)$, l'équation $f(x) = k$ admet **une unique solution** dans $[a\,;\,b]$.

> **Utilisation typique :** montrer qu'une équation $f(x) = 0$ admet une solution unique, en vérifiant que $f(a)$ et $f(b)$ sont de signes contraires.

--- QUIZ: Quiz : Limites et continuité | xp: 50
? [F] Quelle est la limite de $\dfrac{1}{x}$ quand $x \to +\infty$ ?
- $+\infty$
- $1$
- $0$ [ok]
- $-\infty$
> Plus $x$ est grand, plus $\dfrac{1}{x}$ est proche de $0$.
? [F] Quelle est la limite de $2x^2 + 3$ quand $x \to +\infty$ ?
- $3$
- $0$
- $2$
- $+\infty$ [ok]
> Le terme dominant $2x^2$ tend vers $+\infty$.
? [F] Quelle est la limite de $\dfrac{1}{x}$ quand $x \to 0^+$ ?
- $0$
- $+\infty$ [ok]
- $-\infty$
- $1$
> Pour $x$ positif très proche de $0$, $\dfrac{1}{x}$ devient très grand : $+\infty$.
? [M] Calcule $\lim_{x \to +\infty} \dfrac{3x + 1}{x + 2}$.
- $0$
- $1$
- $3$ [ok]
- $+\infty$
> On garde les termes dominants : $\dfrac{3x}{x} = 3$.
? [M] Calcule $\lim_{x \to 1} \dfrac{x^2 - 1}{x - 1}$.
- $0$
- $2$ [ok]
- $+\infty$
- $1$
> Forme $\dfrac{0}{0}$ : on factorise $x^2 - 1 = (x - 1)(x + 1)$ et on simplifie, il reste $x + 1 \to 2$.
? [M] Quelles sont les asymptotes de $f(x) = \dfrac{2x + 1}{x - 3}$ ?
- $x = 2$ et $y = 3$
- $x = 3$ et $y = 2$ [ok]
- $x = -3$ et $y = 2$
- Aucune
> Le dénominateur s'annule en $3$ (asymptote verticale $x = 3$) et $\dfrac{2x}{x} = 2$ en l'infini (asymptote horizontale $y = 2$).
? [D] Calcule $\lim_{x \to +\infty} \left(\sqrt{x^2 + 1} - x\right)$.
- $+\infty$
- $1$
- $0$ [ok]
- $-\infty$
> Forme $\infty - \infty$. On multiplie par la quantité conjuguée : $\dfrac{(x^2 + 1) - x^2}{\sqrt{x^2 + 1} + x} = \dfrac{1}{\sqrt{x^2 + 1} + x} \to 0$.
? [D] $f$ est continue et strictement croissante sur $[0\,;\,2]$, avec $f(0) = -1$ et $f(2) = 3$. Que peut-on dire de $f(x) = 0$ ?
- Elle n'a pas de solution
- Elle a exactement une solution dans $[0\,;\,2]$ [ok]
- Elle a au moins deux solutions
- On ne peut rien dire
> Comme $0 \in [-1\,;\,3]$ et que $f$ est continue et strictement monotone, le théorème des valeurs intermédiaires assure une unique solution.

--- CHAPITRE: La fonction logarithme népérien | xp: 35
## Définition

La fonction $\ln$ est définie sur $]0\,;\,+\infty[$. C'est la **réciproque** de la fonction exponentielle :

$$\ln x = y \iff x = e^y \qquad \text{avec } x > 0$$

Valeurs à connaître : $\ln 1 = 0$ et $\ln e = 1$.

## Propriétés algébriques

Pour $a > 0$ et $b > 0$ :

$$\ln(ab) = \ln a + \ln b \qquad \ln\left(\frac{a}{b}\right) = \ln a - \ln b \qquad \ln(a^n) = n \ln a$$

Exemple : $\ln 8 = \ln(2^3) = 3 \ln 2$.

## Dérivée et variations

$$(\ln x)' = \frac{1}{x} \qquad (\ln u)' = \frac{u'}{u}$$

$\ln$ est donc **strictement croissante** sur $]0\,;\,+\infty[$. Conséquences :

- $\ln x > 0 \iff x > 1$ ;
- $\ln x < 0 \iff 0 < x < 1$ ;
- $\ln a < \ln b \iff a < b$.

Exemple : pour $f(x) = \ln(2x + 1)$, on a $f'(x) = \dfrac{2}{2x + 1}$.

## Limites

$$\lim_{x \to +\infty} \ln x = +\infty \qquad \lim_{x \to 0^+} \ln x = -\infty \qquad \lim_{x \to +\infty} \frac{\ln x}{x} = 0$$

## Résoudre des équations

Il faut **toujours** commencer par l'ensemble de définition.

Exemple : $\ln x + \ln(x - 2) = \ln 3$. On doit avoir $x > 2$. L'équation devient $\ln[x(x - 2)] = \ln 3$, donc $x^2 - 2x - 3 = 0$, soit $x = 3$ ou $x = -1$. Seule $x = 3$ convient car $-1 < 2$.

> **Piège :** ne jamais oublier de vérifier que les solutions trouvées appartiennent à l'ensemble de définition.

--- QUIZ: Quiz : La fonction logarithme népérien | xp: 50
? [F] Combien vaut $\ln 1$ ?
- $1$
- $0$ [ok]
- $e$
- Elle n'existe pas
> Comme $e^0 = 1$, on a $\ln 1 = 0$.
? [F] Quelle est la dérivée de $\ln x$ ?
- $\ln x$
- $x$
- $\dfrac{1}{x}$ [ok]
- $e^x$
> $(\ln x)' = \dfrac{1}{x}$ pour $x > 0$.
? [F] Pour $x > 0$, quelle égalité est vraie ?
- $\ln(a + b) = \ln a + \ln b$
- $\ln(ab) = \ln a + \ln b$ [ok]
- $\ln(ab) = \ln a \times \ln b$
- $\ln(a - b) = \ln a - \ln b$
> Le logarithme transforme un **produit** en **somme** : $\ln(ab) = \ln a + \ln b$.
? [M] Exprime $\ln 8$ en fonction de $\ln 2$.
- $2\ln 2$
- $3\ln 2$ [ok]
- $8\ln 2$
- $\ln 2 + 8$
> $8 = 2^3$, donc $\ln 8 = 3\ln 2$.
? [M] Résous $\ln x = 2$.
- $x = 2$
- $x = e^2$ [ok]
- $x = 2e$
- $x = \ln 2$
> $\ln x = 2 \iff x = e^2$ (avec $x > 0$).
? [M] Quelle est la dérivée de $f(x) = \ln(2x + 1)$ ?
- $\dfrac{1}{2x + 1}$
- $\dfrac{2}{2x + 1}$ [ok]
- $2\ln(2x + 1)$
- $\dfrac{2x}{2x + 1}$
> $(\ln u)' = \dfrac{u'}{u}$ avec $u = 2x + 1$ et $u' = 2$.
? [D] Résous $\ln x + \ln(x - 2) = \ln 3$.
- $x = 3$ [ok]
- $x = -1$
- $x = 3$ ou $x = -1$
- $x = 1$
> Il faut $x > 2$. Alors $x(x - 2) = 3$ donne $x^2 - 2x - 3 = 0$, soit $x = 3$ ou $x = -1$. Seule $x = 3$ est dans l'ensemble de définition.
? [D] Résous l'inéquation $\ln(x - 1) < 0$.
- $x < 2$
- $1 < x < 2$ [ok]
- $x > 2$
- $0 < x < 1$
> Il faut $x - 1 > 0$. Et $\ln(x - 1) < 0 \iff x - 1 < 1$, donc $1 < x < 2$.

--- CHAPITRE: Le calcul intégral | xp: 35
## Primitives

Une **primitive** de $f$ sur un intervalle $I$ est une fonction $F$ dérivable telle que $F' = f$. Toutes les primitives de $f$ diffèrent d'une constante : $F(x) + C$.

| $f(x)$ | Une primitive $F(x)$ |
|---|---|
| $k$ | $kx$ |
| $x^n$ ($n \neq -1$) | $\dfrac{x^{n+1}}{n+1}$ |
| $\dfrac{1}{x}$ | $\ln x$ |
| $e^x$ | $e^x$ |
| $\cos x$ | $\sin x$ |
| $\sin x$ | $-\cos x$ |

Exemple : une primitive de $2x + 3$ est $x^2 + 3x$.

## L'intégrale

Si $F$ est une primitive de $f$ sur $[a\,;\,b]$ :

$$\int_a^b f(x)\,dx = F(b) - F(a) = \Big[F(x)\Big]_a^b$$

Exemples :

$$\int_0^2 x\,dx = \left[\frac{x^2}{2}\right]_0^2 = 2 \qquad \int_1^e \frac{1}{x}\,dx = \Big[\ln x\Big]_1^e = 1$$

## Interprétation : l'aire

Si $f$ est continue et **positive** sur $[a\,;\,b]$, $\displaystyle\int_a^b f(x)\,dx$ est l'**aire** (en unités d'aire) du domaine compris entre la courbe, l'axe des abscisses et les droites $x = a$ et $x = b$.

## Propriétés

- **Linéarité** : $\int (f + g) = \int f + \int g$ et $\int kf = k \int f$.
- **Relation de Chasles** : $\int_a^c f = \int_a^b f + \int_b^c f$.
- **Valeur moyenne** de $f$ sur $[a\,;\,b]$ : $\dfrac{1}{b - a}\displaystyle\int_a^b f(x)\,dx$.

> **Astuce :** pour vérifier une primitive, dérive-la. Tu dois retrouver la fonction de départ.

--- QUIZ: Quiz : Le calcul intégral | xp: 50
? [F] Quelle est une primitive de $f(x) = 2x$ ?
- $2$
- $x^2$ [ok]
- $2x^2$
- $x$
> La dérivée de $x^2$ est $2x$.
? [F] Quelle est une primitive de $e^x$ ?
- $e^x$ [ok]
- $x e^x$
- $e^{x+1}$
- $\ln x$
> La dérivée de $e^x$ est $e^x$ : c'est sa propre primitive.
? [F] Calcule $\displaystyle\int_0^2 x\,dx$.
- $1$
- $2$ [ok]
- $4$
- $0$
> $\left[\dfrac{x^2}{2}\right]_0^2 = \dfrac{4}{2} - 0 = 2$.
? [M] Calcule $\displaystyle\int_1^e \dfrac{1}{x}\,dx$.
- $e - 1$
- $0$
- $1$ [ok]
- $e$
> $[\ln x]_1^e = \ln e - \ln 1 = 1 - 0 = 1$.
? [M] Calcule $\displaystyle\int_0^1 e^x\,dx$.
- $e$
- $e - 1$ [ok]
- $1$
- $e + 1$
> $[e^x]_0^1 = e^1 - e^0 = e - 1$.
? [M] Calcule $\displaystyle\int_0^{\pi} \sin x\,dx$.
- $0$
- $1$
- $2$ [ok]
- $-2$
> $[-\cos x]_0^{\pi} = -\cos \pi + \cos 0 = 1 + 1 = 2$.
? [D] Calcule $\displaystyle\int_0^2 (3x^2 - 2x)\,dx$.
- $4$ [ok]
- $8$
- $12$
- $2$
> Une primitive est $x^3 - x^2$. On obtient $(8 - 4) - 0 = 4$.
? [D] Quelle est la valeur moyenne de $f(x) = x^2$ sur $[0\,;\,3]$ ?
- $3$ [ok]
- $9$
- $\dfrac{9}{2}$
- $1$
> $\dfrac{1}{3 - 0}\int_0^3 x^2\,dx = \dfrac{1}{3} \times \left[\dfrac{x^3}{3}\right]_0^3 = \dfrac{1}{3} \times 9 = 3$.
