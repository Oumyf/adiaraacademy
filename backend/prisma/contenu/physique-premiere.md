matiere: PHYSIQUE
niveau: LYCEE
classe: Première S
titre: Physique Première S : travail, dipôles actifs et énergie mécanique
description: Travail d'une force et énergie cinétique, générateurs et loi des mailles, chute libre et conservation de l'énergie mécanique.
premium: oui

--- CHAPITRE: Travail d'une force et énergie cinétique | xp: 30
## Le travail d'une force constante

Pour une force constante $\vec F$ dont le point d'application se déplace de $A$ à $B$ :

$$W_{AB}(\vec F) = \vec F \cdot \overrightarrow{AB} = F \times AB \times \cos \alpha$$

$\alpha$ est l'angle entre la force et le déplacement. Le travail s'exprime en **joules** (J).

- $\alpha < 90°$ : travail **moteur** ($W > 0$).
- $\alpha = 90°$ : travail **nul** (force perpendiculaire au déplacement).
- $\alpha > 90°$ : travail **résistant** ($W < 0$).

## Travail du poids

$$W_{AB}(\vec P) = m g (z_A - z_B)$$

Positif à la descente, négatif à la montée, indépendant du chemin suivi.

## Énergie cinétique

$$E_c = \frac{1}{2} m v^2$$

$m$ en kg, $v$ en m/s, $E_c$ en J.

## Théorème de l'énergie cinétique

Entre $A$ et $B$ :

$$\Delta E_c = E_c(B) - E_c(A) = \sum W_{AB}(\vec F_{ext})$$

--- QUIZ: Quiz : travail et énergie cinétique | xp: 60
? [F] Quelle est l'unité du travail d'une force ?
- Le newton
- Le joule [ok]
- Le watt
- Le pascal
> Le travail est une énergie : il s'exprime en joules.
? [F] Quelle est l'expression de l'énergie cinétique ?
- $m g h$
- $\dfrac{1}{2} m v^2$ [ok]
- $m v$
- $\dfrac{1}{2} m v$
> $E_c = \dfrac{1}{2} m v^2$.
? [F] Quel est le travail d'une force perpendiculaire au déplacement ?
- Positif
- Négatif
- Nul [ok]
- Infini
> $\cos 90° = 0$ : le travail est nul.
? [M] Quelle est l'énergie cinétique d'une voiture de $1\,000$ kg roulant à $20$ m/s ?
- $10\,000$ J
- $20\,000$ J
- $200\,000$ J [ok]
- $400\,000$ J
> $E_c = \dfrac{1}{2} \times 1\,000 \times 20^2 = 200\,000$ J.
? [M] Une force de $50$ N, de même direction et même sens que le déplacement, déplace son point d'application de $10$ m. Quel est son travail ?
- $5$ J
- $60$ J
- $500$ J [ok]
- $0$ J
> $W = F \times d \times \cos 0° = 50 \times 10 = 500$ J.
? [M] Une force de $100$ N fait un angle de $60°$ avec le déplacement de $5$ m. Quel est son travail ?
- $500$ J
- $250$ J [ok]
- $433$ J
- $50$ J
> $W = 100 \times 5 \times \cos 60° = 500 \times 0{,}5 = 250$ J.
? [D] Un solide de $2$ kg part du repos. Le travail total des forces est $100$ J. Quelle est sa vitesse finale ?
- $5$ m/s
- $10$ m/s [ok]
- $50$ m/s
- $100$ m/s
> $\Delta E_c = 100 = \dfrac{1}{2} \times 2 \times v^2$, donc $v^2 = 100$ et $v = 10$ m/s.
? [D] Un objet de $2$ kg descend de $5$ m ($g = 10$ N/kg). Quel est le travail du poids ?
- $-100$ J
- $10$ J
- $100$ J [ok]
- $50$ J
> $W = m g (z_A - z_B) = 2 \times 10 \times 5 = 100$ J : positif à la descente.

--- CHAPITRE: Dipôles actifs : générateur et loi des mailles | xp: 30
## Le générateur

Un générateur réel est modélisé par une **force électromotrice** $E$ en série avec une **résistance interne** $r$ :

$$U_{PN} = E - r I$$

$U_{PN}$ est la tension à ses bornes, $I$ l'intensité qu'il débite.

- À vide ($I = 0$) : $U = E$.
- En court-circuit ($U = 0$) : $I_{cc} = \dfrac{E}{r}$.

## Le récepteur

$$U = E' + r' I$$

$E'$ est la force contre-électromotrice (moteur, électrolyseur).

## Lois de Kirchhoff

- **Loi des nœuds** : la somme des intensités qui arrivent à un nœud est égale à la somme de celles qui en repartent.
- **Loi des mailles** : dans une maille, la somme algébrique des tensions est nulle.

## Circuit simple

Générateur $(E, r)$ et résistor $R$ en série :

$$I = \frac{E}{R + r}$$

--- QUIZ: Quiz : dipôles actifs | xp: 60
? [F] Quelle est la caractéristique d'un générateur de f.é.m. $E$ et de résistance interne $r$ ?
- $U = E + r I$
- $U = E - r I$ [ok]
- $U = \dfrac{E}{r I}$
- $U = r I - E$
> Un générateur réel vérifie $U = E - r I$.
? [F] Quelle tension mesure-t-on aux bornes d'un générateur qui ne débite aucun courant ?
- $0$
- $E$ [ok]
- $r$
- $E / r$
> À vide, $I = 0$ donc $U = E$.
? [F] Que dit la loi des nœuds ?
- La somme des tensions d'une maille est nulle
- La somme des intensités qui arrivent à un nœud égale celle des intensités qui en repartent [ok]
- La tension est proportionnelle à l'intensité
- L'intensité est la même partout
> C'est la conservation de la charge électrique au niveau d'un nœud.
? [M] Un générateur de $E = 12$ V et $r = 2$ $\Omega$ débite $1$ A. Quelle est la tension à ses bornes ?
- $10$ V [ok]
- $14$ V
- $12$ V
- $24$ V
> $U = E - r I = 12 - 2 \times 1 = 10$ V.
? [M] Un générateur a $E = 6$ V et $r = 2$ $\Omega$. Quelle est l'intensité de court-circuit ?
- $12$ A
- $3$ A [ok]
- $8$ A
- $0{,}33$ A
> $I_{cc} = \dfrac{E}{r} = \dfrac{6}{2} = 3$ A.
? [M] Une pile de f.é.m. $4{,}5$ V débite $0{,}5$ A sous $4{,}4$ V. Quelle est sa résistance interne ?
- $0{,}2$ $\Omega$ [ok]
- $0{,}1$ $\Omega$
- $2$ $\Omega$
- $8{,}8$ $\Omega$
> $r = \dfrac{E - U}{I} = \dfrac{4{,}5 - 4{,}4}{0{,}5} = 0{,}2$ $\Omega$.
? [D] Un générateur ($E = 12$ V, $r = 1$ $\Omega$) alimente un résistor $R = 5$ $\Omega$. Quelle est l'intensité du courant ?
- $2$ A [ok]
- $2{,}4$ A
- $12$ A
- $1{,}2$ A
> $I = \dfrac{E}{R + r} = \dfrac{12}{5 + 1} = 2$ A.
? [D] Dans le même circuit ($E = 12$ V, $r = 1$ $\Omega$, $R = 5$ $\Omega$, $I = 2$ A), quelle est la tension aux bornes du générateur ?
- $12$ V
- $10$ V [ok]
- $2$ V
- $14$ V
> $U = E - r I = 12 - 1 \times 2 = 10$ V, ce qui vaut aussi $R I = 5 \times 2 = 10$ V.

--- CHAPITRE: Énergie mécanique et chute libre | xp: 30
## Énergie potentielle de pesanteur

$$E_p = m g z$$

$z$ est l'altitude au-dessus d'une référence choisie ($E_p = 0$ à $z = 0$). $E_p$ s'exprime en joules.

## Énergie mécanique

$$E_m = E_c + E_p$$

Si les forces non conservatives (frottements) sont **négligeables**, l'énergie mécanique est **conservée** :

$$E_m = \text{constante}$$

Au cours d'une chute, $E_p$ diminue et $E_c$ augmente de la même quantité.

## Vitesse d'un objet lâché sans vitesse initiale

D'une hauteur $h$ :

$$\frac{1}{2} m v^2 = m g h \implies v = \sqrt{2 g h}$$

## Lancer vers le haut

Avec une vitesse initiale $v_0$ verticale, la hauteur maximale (où $v = 0$) vaut :

$$h_{max} = \frac{v_0^2}{2 g}$$

> **Attention :** $E_m$ n'est conservée que si les frottements sont négligeables. Sinon, une partie de l'énergie est transférée sous forme de chaleur.

--- QUIZ: Quiz : énergie mécanique | xp: 60
? [F] Quelle est l'expression de l'énergie potentielle de pesanteur ?
- $\dfrac{1}{2} m v^2$
- $m g z$ [ok]
- $m v$
- $\dfrac{m}{g z}$
> $E_p = m g z$.
? [F] À quelle condition l'énergie mécanique est-elle conservée ?
- Si la masse est faible
- Si les frottements sont négligeables [ok]
- Si la vitesse est constante
- Toujours
> Seules des forces conservatives (comme le poids) travaillent : $E_m$ est constante.
? [F] Pendant la chute d'un objet sans frottements, que se passe-t-il ?
- $E_c$ diminue et $E_p$ augmente
- $E_c$ augmente et $E_p$ diminue [ok]
- $E_c$ et $E_p$ augmentent
- $E_m$ augmente
> L'énergie potentielle se transforme en énergie cinétique.
? [M] Quelle est l'énergie potentielle d'un objet de $2$ kg à $10$ m d'altitude ($g = 10$ N/kg) ?
- $20$ J
- $100$ J
- $200$ J [ok]
- $2\,000$ J
> $E_p = m g z = 2 \times 10 \times 10 = 200$ J.
? [M] Un objet est lâché sans vitesse initiale de $5$ m ($g = 10$ N/kg, sans frottements). Quelle est sa vitesse au sol ?
- $5$ m/s
- $10$ m/s [ok]
- $50$ m/s
- $7{,}07$ m/s
> $v = \sqrt{2 g h} = \sqrt{2 \times 10 \times 5} = \sqrt{100} = 10$ m/s.
? [M] Un objet de $0{,}5$ kg est à $4$ m du sol ($g = 10$ N/kg). Quelle est son énergie potentielle ?
- $2$ J
- $20$ J [ok]
- $200$ J
- $0{,}2$ J
> $E_p = 0{,}5 \times 10 \times 4 = 20$ J.
? [D] Une balle est lancée verticalement à $20$ m/s ($g = 10$ N/kg, sans frottements). Quelle hauteur maximale atteint-elle ?
- $10$ m
- $20$ m [ok]
- $40$ m
- $200$ m
> $h_{max} = \dfrac{v_0^2}{2 g} = \dfrac{400}{20} = 20$ m.
? [D] Un objet de $1$ kg est à $3$ m d'altitude et possède une vitesse de $4$ m/s ($g = 10$ N/kg). Quelle est son énergie mécanique ?
- $30$ J
- $38$ J [ok]
- $8$ J
- $42$ J
> $E_p = 1 \times 10 \times 3 = 30$ J ; $E_c = \dfrac{1}{2} \times 1 \times 16 = 8$ J ; $E_m = 38$ J.
