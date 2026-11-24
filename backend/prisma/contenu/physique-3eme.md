matiere: PHYSIQUE
niveau: COLLEGE
classe: 3ème
titre: Physique 3ème : loi d'Ohm, puissance électrique et lentilles
description: Résistances et loi d'Ohm, puissance et énergie électriques, lentilles convergentes (BFEM).
premium: non

--- CHAPITRE: Résistance et loi d'Ohm | xp: 25
## La loi d'Ohm

Pour un conducteur ohmique de résistance $R$ :

$$U = R \times I$$

avec $U$ en volts (V), $I$ en ampères (A) et $R$ en **ohms** ($\Omega$). La caractéristique $U = f(I)$ d'un conducteur ohmique est une **droite passant par l'origine**.

Trois formes à connaître : $U = RI$, $I = \dfrac{U}{R}$, $R = \dfrac{U}{I}$.

## Association de résistances

- **En série** : $R = R_1 + R_2$ (la résistance équivalente augmente).
- **En dérivation** : $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$ (la résistance équivalente est plus petite que chacune).

## Méthode

1. Repérer la grandeur cherchée et les deux autres.
2. Convertir : mA en A, k$\Omega$ en $\Omega$.
3. Appliquer $U = RI$ puis vérifier l'unité.

--- QUIZ: Quiz : loi d'Ohm | xp: 50
? [F] Quelle est la loi d'Ohm pour un conducteur ohmique ?
- $U = R + I$
- $U = R \times I$ [ok]
- $U = \dfrac{I}{R}$
- $R = U \times I$
> La loi d'Ohm s'écrit $U = R \times I$.
? [F] Quelle est l'unité de la résistance électrique ?
- Le volt
- L'ampère
- L'ohm [ok]
- Le watt
> La résistance se mesure en ohms (symbole $\Omega$).
? [F] Que représente la caractéristique $U = f(I)$ d'un conducteur ohmique ?
- Une parabole
- Une droite passant par l'origine [ok]
- Une droite horizontale
- Un cercle
> $U$ est proportionnelle à $I$ : la courbe est une droite passant par l'origine, de pente $R$.
? [M] Une résistance de $100$ $\Omega$ est traversée par $0{,}05$ A. Quelle est la tension à ses bornes ?
- $2$ V
- $5$ V [ok]
- $50$ V
- $500$ V
> $U = R I = 100 \times 0{,}05 = 5$ V.
? [M] Aux bornes d'un conducteur ohmique, $U = 12$ V et $I = 0{,}4$ A. Quelle est sa résistance ?
- $4{,}8$ $\Omega$
- $30$ $\Omega$ [ok]
- $0{,}033$ $\Omega$
- $12{,}4$ $\Omega$
> $R = \dfrac{U}{I} = \dfrac{12}{0{,}4} = 30$ $\Omega$.
? [M] On associe en série deux résistances de $40$ $\Omega$ et $60$ $\Omega$. Quelle est la résistance équivalente ?
- $24$ $\Omega$
- $50$ $\Omega$
- $100$ $\Omega$ [ok]
- $2\,400$ $\Omega$
> En série : $R = R_1 + R_2 = 40 + 60 = 100$ $\Omega$.
? [D] On associe en dérivation deux résistances de $30$ $\Omega$ et $60$ $\Omega$. Quelle est la résistance équivalente ?
- $90$ $\Omega$
- $45$ $\Omega$
- $20$ $\Omega$ [ok]
- $1\,800$ $\Omega$
> $\dfrac{1}{R} = \dfrac{1}{30} + \dfrac{1}{60} = \dfrac{3}{60} = \dfrac{1}{20}$, donc $R = 20$ $\Omega$.
? [D] Deux résistances de $100$ $\Omega$ et $200$ $\Omega$ sont en série avec une pile de $9$ V. Quelle est la tension aux bornes de la résistance de $100$ $\Omega$ ?
- $3$ V [ok]
- $4{,}5$ V
- $6$ V
- $9$ V
> $R = 300$ $\Omega$, $I = \dfrac{9}{300} = 0{,}03$ A, puis $U_1 = 100 \times 0{,}03 = 3$ V.

--- CHAPITRE: Puissance et énergie électriques | xp: 25
## La puissance

La puissance électrique reçue par un appareil est :

$$P = U \times I$$

$P$ en **watts** (W), $U$ en volts, $I$ en ampères. Une valeur indiquée sur un appareil, par exemple « $230$ V ; $60$ W », est sa **tension nominale** et sa **puissance nominale**.

## L'énergie

$$E = P \times t$$

- $P$ en W et $t$ en secondes donnent $E$ en **joules** (J).
- $P$ en kW et $t$ en heures donnent $E$ en **kilowattheures** (kWh), l'unité utilisée sur la facture d'électricité.

$$1\ \text{kWh} = 3{,}6 \times 10^6\ \text{J}$$

## Exemple

Un radiateur de $2$ kW fonctionne $3$ h : $E = 2 \times 3 = 6$ kWh. Si le kWh coûte $100$ FCFA, le coût est $600$ FCFA.

> **Attention :** vérifie toujours que $P$ et $t$ sont dans des unités compatibles avant de multiplier.

--- QUIZ: Quiz : puissance et énergie | xp: 50
? [F] Quelle est l'unité de la puissance ?
- Le joule
- Le watt [ok]
- Le volt
- L'ohm
> La puissance se mesure en watts (W).
? [F] Quelle formule donne la puissance électrique reçue par un appareil ?
- $P = U + I$
- $P = U \times I$ [ok]
- $P = \dfrac{U}{I}$
- $P = U \times I \times t$
> $P = U \times I$ : tension en volts fois intensité en ampères.
? [F] Le kilowattheure (kWh) est une unité de :
- Puissance
- Tension
- Énergie [ok]
- Intensité
> $E = P \times t$ : un kWh est l'énergie consommée par un appareil de $1$ kW en $1$ heure.
? [M] Une lampe de $100$ W reste allumée $5$ h. Quelle énergie consomme-t-elle ?
- $0{,}5$ kWh [ok]
- $5$ kWh
- $20$ kWh
- $500$ kWh
> $P = 0{,}1$ kW, $E = 0{,}1 \times 5 = 0{,}5$ kWh.
? [M] Un appareil sous $230$ V est traversé par $2$ A. Quelle est sa puissance ?
- $115$ W
- $232$ W
- $460$ W [ok]
- $4\,600$ W
> $P = U I = 230 \times 2 = 460$ W.
? [M] Un fer à repasser de $1\,000$ W fonctionne $30$ minutes. Quelle énergie consomme-t-il ?
- $0{,}5$ kWh [ok]
- $30$ kWh
- $1$ kWh
- $0{,}03$ kWh
> $P = 1$ kW, $t = 0{,}5$ h, donc $E = 1 \times 0{,}5 = 0{,}5$ kWh.
? [D] Un radiateur de $2$ kW fonctionne $3$ h. Le kWh est facturé $100$ FCFA. Quel est le coût ?
- $200$ FCFA
- $300$ FCFA
- $600$ FCFA [ok]
- $6\,000$ FCFA
> $E = 2 \times 3 = 6$ kWh, donc $6 \times 100 = 600$ FCFA.
? [D] Une lampe de $60$ W fonctionne $10$ h. Quelle énergie consomme-t-elle en joules ?
- $600$ J
- $36\,000$ J
- $2\,160\,000$ J [ok]
- $216\,000$ J
> $t = 10 \times 3\,600 = 36\,000$ s, donc $E = 60 \times 36\,000 = 2\,160\,000$ J.

--- CHAPITRE: Les lentilles convergentes | xp: 25
## Description

Une lentille **convergente** est plus **épaisse au centre** que sur les bords. Elle fait converger un faisceau de rayons parallèles à l'axe optique vers un point, le **foyer image** $F'$.

- Le **centre optique** $O$ est le centre de la lentille.
- La **distance focale** $f = OF'$ se mesure en mètres.
- La **vergence** : $C = \dfrac{1}{f}$, en **dioptries** ($\delta$), avec $f$ en mètres.

## Trois rayons particuliers

1. Un rayon **parallèle à l'axe optique** ressort en passant par le foyer image $F'$.
2. Un rayon **passant par le centre optique** n'est pas dévié.
3. Un rayon passant par le foyer objet $F$ ressort parallèle à l'axe optique.

## Images selon la position de l'objet

| Position de l'objet | Image |
|---|---|
| Au-delà de $2f$ | réelle, renversée, plus petite |
| Entre $f$ et $2f$ | réelle, renversée, plus grande |
| Entre la lentille et $F$ | virtuelle, droite, plus grande (loupe) |

Une image **réelle** peut être recueillie sur un écran ; une image **virtuelle** ne le peut pas.

--- QUIZ: Quiz : lentilles convergentes | xp: 50
? [F] Comment reconnaît-on une lentille convergente ?
- Elle est plus fine au centre
- Elle est plus épaisse au centre [ok]
- Elle est plate
- Elle est colorée
> Une lentille convergente a des bords plus minces que son centre.
? [F] Que devient un rayon qui passe par le centre optique d'une lentille ?
- Il est dévié vers le foyer
- Il n'est pas dévié [ok]
- Il est absorbé
- Il fait demi-tour
> Un rayon passant par le centre optique traverse la lentille sans changer de direction.
? [F] Quelle est l'unité de la vergence ?
- Le mètre
- La dioptrie [ok]
- Le watt
- Le newton
> La vergence $C = 1/f$ se mesure en dioptries ($\delta$).
? [M] La distance focale d'une lentille est $f = 0{,}25$ m. Quelle est sa vergence ?
- $0{,}25$ $\delta$
- $2{,}5$ $\delta$
- $4$ $\delta$ [ok]
- $25$ $\delta$
> $C = \dfrac{1}{f} = \dfrac{1}{0{,}25} = 4$ $\delta$.
? [M] La vergence d'une lentille est $5$ $\delta$. Quelle est sa distance focale ?
- $5$ cm
- $20$ cm [ok]
- $50$ cm
- $2$ cm
> $f = \dfrac{1}{C} = \dfrac{1}{5} = 0{,}2$ m $= 20$ cm.
? [M] On place un objet entre une lentille convergente et son foyer objet. L'image est :
- Réelle et renversée
- Virtuelle, droite et plus grande [ok]
- Réelle et plus petite
- Inexistante
> C'est le cas de la loupe : l'image est virtuelle, droite et agrandie.
? [D] Une lentille a une distance focale de $10$ cm. Un objet est placé à $30$ cm de la lentille. Comment est l'image ?
- Virtuelle et droite
- Réelle, renversée et plus petite [ok]
- Réelle, renversée et plus grande
- Virtuelle et plus grande
> $30$ cm est supérieur à $2f = 20$ cm : l'image est réelle, renversée et plus petite que l'objet.
? [D] Un rayon parallèle à l'axe optique traverse une lentille convergente. Par où ressort-il ?
- Par le centre optique
- Par le foyer image [ok]
- Parallèle à l'axe
- Par le foyer objet
> Les rayons parallèles à l'axe optique convergent au foyer image $F'$.
