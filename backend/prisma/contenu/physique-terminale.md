matiere: PHYSIQUE
niveau: LYCEE
classe: Terminale S
titre: Physique Terminale S : lois de Newton, dipôle RC et radioactivité
description: Deuxième loi de Newton et mouvement d'un projectile, charge et décharge d'un condensateur, décroissance radioactive.
premium: oui

--- CHAPITRE: Deuxième loi de Newton et projectile | xp: 35
## Énoncé

Dans un référentiel galiléen, la somme des forces extérieures appliquées à un système de masse $m$ est égale au produit de sa masse par l'accélération de son centre d'inertie :

$$\sum \vec F_{ext} = m \vec a$$

$F$ en newtons, $m$ en kg, $a$ en m/s².

## Chute libre

Si le poids est la seule force, $m \vec g = m \vec a$ donc $\vec a = \vec g$ : l'accélération ne dépend pas de la masse. Pour une chute verticale sans vitesse initiale :

$$v = g t \qquad z = \frac{1}{2} g t^2$$

## Projectile lancé avec une vitesse $\vec v_0$ inclinée de $\alpha$

On choisit l'axe $Ox$ horizontal et $Oy$ vertical vers le haut, avec l'origine au point de lancement. Seul le poids agit : $\vec a = (0\ ;\ -g)$.

$$v_x = v_0 \cos \alpha \qquad v_y = -g t + v_0 \sin \alpha$$

$$x = (v_0 \cos \alpha)\, t \qquad y = -\frac{1}{2} g t^2 + (v_0 \sin \alpha)\, t$$

- Selon $Ox$ : mouvement **rectiligne uniforme**.
- Selon $Oy$ : mouvement **uniformément varié**.
- La trajectoire est une **parabole**.

Sommet : $v_y = 0$ à $t_S = \dfrac{v_0 \sin \alpha}{g}$, d'où la flèche $h = \dfrac{(v_0 \sin \alpha)^2}{2 g}$.

Portée (retour à la hauteur de départ) : $x_P = \dfrac{v_0^2 \sin 2\alpha}{g}$.

--- QUIZ: Quiz : deuxième loi de Newton | xp: 70
? [F] Quelle est l'écriture de la deuxième loi de Newton ?
- $\sum \vec F = m \vec v$
- $\sum \vec F = m \vec a$ [ok]
- $\sum \vec F = \dfrac{\vec a}{m}$
- $\sum \vec F = \vec 0$ toujours
> La somme des forces extérieures vaut la masse fois l'accélération du centre d'inertie.
? [F] Quelle est l'accélération d'un objet en chute libre sans frottements ?
- $0$
- Elle dépend de sa masse
- $\vec g$ [ok]
- Elle augmente avec le temps
> Le poids est la seule force : $\vec a = \vec g$, indépendamment de la masse.
? [F] Quelle est la trajectoire d'un projectile lancé obliquement, sans frottements ?
- Une droite
- Une parabole [ok]
- Un cercle
- Une spirale
> Mouvement uniforme selon $Ox$ et uniformément varié selon $Oy$ : trajectoire parabolique.
? [M] Une force résultante de $20$ N agit sur un solide de $4$ kg. Quelle est son accélération ?
- $0{,}2$ m/s²
- $5$ m/s² [ok]
- $80$ m/s²
- $24$ m/s²
> $a = \dfrac{F}{m} = \dfrac{20}{4} = 5$ m/s².
? [M] Un objet est lâché sans vitesse initiale ($g = 10$ m/s², sans frottements). Quelle est sa vitesse après $2$ s ?
- $5$ m/s
- $10$ m/s
- $20$ m/s [ok]
- $40$ m/s
> $v = g t = 10 \times 2 = 20$ m/s.
? [M] Pour un projectile sans frottements, la composante horizontale de la vitesse :
- Augmente
- Diminue
- Reste constante [ok]
- S'annule au sommet
> Aucune force horizontale : $a_x = 0$, donc $v_x = v_0 \cos \alpha$ est constante.
? [D] Un projectile est lancé à $v_0 = 20$ m/s avec un angle de $30°$ ($g = 10$ m/s²). Quelle est approximativement sa portée ?
- $20$ m
- $34{,}6$ m [ok]
- $40$ m
- $17{,}3$ m
> $x_P = \dfrac{v_0^2 \sin 2\alpha}{g} = \dfrac{400 \times \sin 60°}{10} = 40 \times 0{,}866 \approx 34{,}6$ m.
? [D] Même lancer ($v_0 = 20$ m/s, $\alpha = 30°$, $g = 10$ m/s²). Quelle est la hauteur maximale atteinte ?
- $5$ m [ok]
- $10$ m
- $20$ m
- $2{,}5$ m
> $v_0 \sin \alpha = 10$ m/s, donc $h = \dfrac{10^2}{2 \times 10} = 5$ m.

--- CHAPITRE: Le dipôle RC | xp: 35
## Le condensateur

Un condensateur de capacité $C$ (en **farads**, F) emmagasine une charge $q = C u_C$. Le courant qui le traverse est :

$$i = \frac{dq}{dt} = C \frac{du_C}{dt}$$

La tension $u_C$ aux bornes d'un condensateur est **continue** : elle ne peut pas varier brusquement.

## Constante de temps

Pour un circuit $RC$ en série :

$$\tau = R C$$

$\tau$ en secondes ($R$ en $\Omega$, $C$ en F).

## Charge sous un échelon de tension $E$

$$u_C(t) = E \left(1 - e^{-t/\tau}\right)$$

À $t = \tau$, $u_C \approx 0{,}63\,E$. Après $5\tau$, le condensateur est chargé à plus de $99\,\%$.

## Décharge

$$u_C(t) = E\, e^{-t/\tau}$$

À $t = \tau$, $u_C \approx 0{,}37\,E$.

## Énergie emmagasinée

$$E_C = \frac{1}{2} C u_C^2$$

--- QUIZ: Quiz : le dipôle RC | xp: 70
? [F] Quelle est l'expression de la constante de temps d'un circuit $RC$ ?
- $\tau = R + C$
- $\tau = \dfrac{R}{C}$
- $\tau = R C$ [ok]
- $\tau = \dfrac{1}{RC}$
> $\tau = R \times C$.
? [F] Quelle est l'unité de la constante de temps ?
- Le farad
- La seconde [ok]
- L'ohm
- Le volt
> $\tau = RC$ s'exprime en secondes.
? [F] Que peut-on dire de la tension aux bornes d'un condensateur ?
- Elle varie instantanément
- Elle est continue [ok]
- Elle est toujours nulle
- Elle est toujours égale à $E$
> La tension $u_C$ ne peut pas subir de discontinuité (sinon le courant serait infini).
? [M] Un circuit $RC$ a $R = 10$ k$\Omega$ et $C = 100$ $\mu$F. Quelle est la constante de temps ?
- $1$ s [ok]
- $10$ s
- $0{,}1$ s
- $1\,000$ s
> $\tau = 10 \times 10^3 \times 100 \times 10^{-6} = 1$ s.
? [M] Un condensateur se charge sous $E = 10$ V. Quelle est la tension à $t = \tau$ ?
- $3{,}7$ V
- $5$ V
- $6{,}3$ V [ok]
- $10$ V
> $u_C(\tau) = E(1 - e^{-1}) \approx 0{,}63 \times 10 = 6{,}3$ V.
? [M] Un condensateur chargé à $E = 10$ V se décharge dans une résistance. Quelle est la tension à $t = \tau$ ?
- $3{,}7$ V [ok]
- $6{,}3$ V
- $0$ V
- $5$ V
> $u_C(\tau) = E\, e^{-1} \approx 0{,}37 \times 10 = 3{,}7$ V.
? [D] La constante de temps vaut $\tau = 2$ ms. Quelle durée faut-il pour considérer la charge terminée ($5\tau$) ?
- $2$ ms
- $5$ ms
- $10$ ms [ok]
- $0{,}4$ ms
> $5\tau = 5 \times 2 = 10$ ms.
? [D] Un condensateur de $100$ $\mu$F est chargé sous $10$ V. Quelle énergie emmagasine-t-il ?
- $5$ mJ [ok]
- $10$ mJ
- $50$ mJ
- $0{,}5$ mJ
> $E_C = \dfrac{1}{2} C U^2 = 0{,}5 \times 100 \times 10^{-6} \times 100 = 5 \times 10^{-3}$ J $= 5$ mJ.

--- CHAPITRE: La radioactivité | xp: 35
## Décroissance radioactive

Un noyau radioactif instable se désintègre de façon **aléatoire**. Le nombre moyen de noyaux restants suit la loi :

$$N(t) = N_0\, e^{-\lambda t}$$

$\lambda$ est la **constante radioactive** (en s⁻¹).

## Demi-vie

La **demi-vie** $t_{1/2}$ est la durée au bout de laquelle la moitié des noyaux présents s'est désintégrée :

$$t_{1/2} = \frac{\ln 2}{\lambda}$$

Après $n$ demi-vies, il reste $N_0 / 2^n$ noyaux.

## Activité

L'activité est le nombre de désintégrations par seconde, en **becquerels** (Bq) :

$$A = \lambda N$$

Elle décroît comme $N$ : $A(t) = A_0\, e^{-\lambda t}$.

## Types de désintégration

- **$\alpha$** : émission d'un noyau d'hélium ${}^4_2\text{He}$.
- **$\beta^-$** : émission d'un électron.
- **$\beta^+$** : émission d'un positon.
- Les lois de conservation (nombre de masse $A$ et nombre de charge $Z$) permettent d'écrire l'équation de la réaction.

--- QUIZ: Quiz : la radioactivité | xp: 70
? [F] Que représente la demi-vie d'un échantillon radioactif ?
- La durée de désintégration totale
- La durée au bout de laquelle la moitié des noyaux a disparu [ok]
- La moitié de la durée de vie du plus vieux noyau
- La durée pour une désintégration
> $t_{1/2}$ est la durée après laquelle $N = N_0 / 2$.
? [F] Quelle est l'unité de l'activité d'une source radioactive ?
- Le joule
- Le becquerel [ok]
- Le farad
- Le newton
> L'activité se mesure en becquerels : une désintégration par seconde.
? [F] Quelle fraction des noyaux initiaux reste-t-il après une demi-vie ?
- Le quart
- La moitié [ok]
- Aucun
- Les trois quarts
> Par définition, la moitié des noyaux s'est désintégrée.
? [M] Quelle fraction des noyaux initiaux reste-t-il après $3$ demi-vies ?
- $\dfrac{1}{3}$
- $\dfrac{1}{6}$
- $\dfrac{1}{8}$ [ok]
- $\dfrac{1}{9}$
> $\dfrac{1}{2^3} = \dfrac{1}{8}$.
? [M] La demi-vie d'un noyau est de $5$ ans. Quelle fraction reste-t-il au bout de $15$ ans ?
- $\dfrac{1}{3}$
- $\dfrac{1}{8}$ [ok]
- $\dfrac{1}{15}$
- $\dfrac{1}{4}$
> $15 = 3 \times 5$ : trois demi-vies, donc $\dfrac{1}{8}$.
? [M] Une constante radioactive vaut $\lambda = 0{,}1$ an⁻¹. Quelle est approximativement la demi-vie ?
- $0{,}1$ an
- $6{,}9$ ans [ok]
- $10$ ans
- $0{,}69$ an
> $t_{1/2} = \dfrac{\ln 2}{\lambda} = \dfrac{0{,}693}{0{,}1} \approx 6{,}9$ ans.
? [D] Un échantillon contient $800$ noyaux radioactifs de demi-vie $2$ h. Combien en reste-t-il au bout de $6$ h ?
- $400$
- $200$
- $100$ [ok]
- $50$
> $6$ h $= 3$ demi-vies : $800 / 2^3 = 100$.
? [D] Un échantillon contient $N = 5 \times 10^6$ noyaux avec $\lambda = 2 \times 10^{-3}$ s⁻¹. Quelle est son activité ?
- $10^4$ Bq [ok]
- $10^3$ Bq
- $10^{10}$ Bq
- $2{,}5 \times 10^9$ Bq
> $A = \lambda N = 2 \times 10^{-3} \times 5 \times 10^6 = 10^4$ Bq.
