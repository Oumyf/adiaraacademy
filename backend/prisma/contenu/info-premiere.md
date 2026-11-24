matiere: INFORMATIQUE
niveau: LYCEE
classe: Première
titre: Informatique Première : recherche, tris, complexité et réseaux
description: Algorithmes classiques de recherche et de tri, notion de complexité, fonctionnement d'un réseau et du protocole IP.
premium: oui

--- CHAPITRE: Recherche et complexité | xp: 35
## Recherche séquentielle

On parcourt la liste élément par élément jusqu'à trouver la valeur. Dans le pire cas, il faut examiner les $n$ éléments : le coût est proportionnel à $n$, on dit de **complexité linéaire**, notée $O(n)$.

## Recherche dichotomique

Elle exige une liste **triée**. On compare la valeur cherchée à l'élément du milieu, puis on ne conserve que la moitié concernée.

```python
def dichotomie(t, x):
    g, d = 0, len(t) - 1
    while g <= d:
        m = (g + d) // 2
        if t[m] == x:
            return m
        elif t[m] < x:
            g = m + 1
        else:
            d = m - 1
    return -1
```

À chaque étape, la taille est divisée par $2$ : la complexité est **logarithmique**, $O(\log_2 n)$. Pour $n = 1\,000\,000$, une vingtaine d'étapes suffisent.

## Ordres de grandeur

$O(1)$ < $O(\log n)$ < $O(n)$ < $O(n \log n)$ < $O(n^2)$. La complexité permet de comparer des algorithmes indépendamment de la machine.

--- QUIZ: Quiz : recherche et complexité | xp: 70
? [F] Quelle condition la recherche dichotomique exige-t-elle ?
- La liste doit être triée [ok]
- La liste doit être vide
- La liste doit contenir des entiers pairs
- Aucune
> Sans tri, la comparaison au milieu n'a pas de sens.
? [F] Quelle est la complexité d'une recherche séquentielle ?
- $O(1)$
- $O(n)$ [ok]
- $O(\log n)$
- $O(n^2)$
> Au pire on parcourt les $n$ éléments.
? [F] Quelle est la complexité de la recherche dichotomique ?
- $O(n)$
- $O(\log n)$ [ok]
- $O(n^2)$
- $O(1)$
> La taille est divisée par $2$ à chaque étape.
? [M] Dans la liste triée `[2, 5, 8, 11, 14, 17, 20]`, que renvoie la dichotomie pour x = 11 ?
- $2$
- $3$ [ok]
- $4$
- $-1$
> L'indice du milieu est $(0 + 6) // 2 = 3$ et $t[3] = 11$.
? [M] Que renvoie `dichotomie` si la valeur est absente ?
- $0$
- $-1$ [ok]
- None toujours
- L'indice du milieu
> La fonction renvoie $-1$ en fin de boucle.
? [M] Entre $O(n)$ et $O(n^2)$, quel algorithme est le plus rapide pour de grandes données ?
- $O(n^2)$
- $O(n)$ [ok]
- Aucun
- Identique
> Une croissance linéaire reste inférieure à une croissance quadratique.
? [D] On multiplie par $2$ la taille de la liste. Que se passe-t-il pour un algorithme en $O(n^2)$ ?
- Le coût double
- Le coût est multiplié par $4$ [ok]
- Le coût ne change pas
- Le coût est multiplié par $8$
> $(2n)^2 = 4n^2$.
? [D] Environ combien d'étapes au pire pour dichotomie sur $1\,024$ éléments ?
- $1\,024$
- $512$
- $10$ à $11$ [ok]
- $100$
> $2^{10} = 1\,024$, donc environ $10$ divisions.

--- CHAPITRE: Les algorithmes de tri | xp: 35
## Tri par sélection

On cherche le minimum de la partie non triée et on l'échange avec le premier élément de cette partie. Le nombre de comparaisons est $\dfrac{n(n-1)}{2}$ : complexité $O(n^2)$.

```python
def tri_selection(t):
    n = len(t)
    for i in range(n - 1):
        m = i
        for j in range(i + 1, n):
            if t[j] < t[m]:
                m = j
        t[i], t[m] = t[m], t[i]
```

## Tri par insertion

On insère chaque élément à sa bonne place dans la partie déjà triée. Complexité $O(n^2)$ dans le pire cas, mais proche de $O(n)$ si la liste est presque triée.

## Invariant de boucle

Un **invariant** est une propriété vraie avant et après chaque tour de boucle. Pour le tri par sélection, après $i$ tours, les $i$ premiers éléments sont les plus petits, dans l'ordre.

## Tri Python

La fonction `sorted` utilise un algorithme beaucoup plus efficace en $O(n \log n)$.

--- QUIZ: Quiz : algorithmes de tri | xp: 70
? [F] Quelle est la complexité du tri par sélection ?
- $O(n)$
- $O(n^2)$ [ok]
- $O(\log n)$
- $O(1)$
> Deux boucles imbriquées.
? [F] Que fait le tri par sélection à chaque étape ?
- Il cherche le minimum de la partie non triée et le place en tête [ok]
- Il mélange la liste
- Il supprime un élément
- Il double la liste
> Le minimum est échangé avec le premier élément non trié.
? [F] Qu'est-ce qu'un invariant de boucle ?
- Une propriété vraie avant et après chaque tour [ok]
- Une variable constante
- Une boucle sans fin
- Un commentaire
> Il sert à prouver la correction de l'algorithme.
? [M] Combien de comparaisons le tri par sélection effectue-t-il sur $10$ éléments ?
- $10$
- $45$ [ok]
- $90$
- $100$
> $\dfrac{10 \times 9}{2} = 45$.
? [M] Pour une liste déjà presque triée, quel tri est proche de $O(n)$ ?
- Le tri par insertion [ok]
- Le tri par sélection
- Aucun
- La dichotomie
> L'insertion fait peu de décalages.
? [M] Après un tour du tri par sélection sur `[7, 3, 9, 1]`, quelle est la liste ?
- `[1, 3, 9, 7]` [ok]
- `[3, 7, 9, 1]`
- `[1, 7, 9, 3]`
- `[7, 3, 1, 9]`
> Le minimum $1$ est échangé avec $7$.
? [D] Pourquoi `sorted` est-il préférable aux tris $O(n^2)$ pour de grandes listes ?
- Il est en $O(n \log n)$ [ok]
- Il est en $O(1)$
- Il ne trie pas
- Il utilise moins de mémoire toujours
> $n \log n$ croît bien plus lentement que $n^2$.
? [D] Pour $n = 1\,000$, quel ordre de grandeur de comparaisons pour un tri en $n^2$ ?
- $1\,000$
- $10\,000$
- $1\,000\,000$ [ok]
- $10^9$
> $1\,000^2 = 10^6$.

--- CHAPITRE: Réseaux et protocoles | xp: 35
## Principe

Un **réseau** relie des machines pour échanger des données. Les informations sont découpées en **paquets**, acheminés indépendamment par des **routeurs**.

## Adresse IP

Une **adresse IPv4** est codée sur $32$ bits, écrite en $4$ octets : par exemple `192.168.1.10`. Un **masque de sous-réseau** distingue la partie réseau de la partie machine.

## Les protocoles

- **IP** : adressage et acheminement des paquets.
- **TCP** : transport **fiable** (accusés de réception, retransmission).
- **UDP** : transport rapide, sans garantie de livraison (vidéo en direct).
- **DNS** : traduit un nom de domaine en adresse IP.
- **HTTP/HTTPS** : transfert des pages Web (ports $80$ et $443$).

## Modèle en couches

Chaque couche (application, transport, réseau, liaison) rend un service à la couche supérieure : on peut changer l'une sans modifier les autres.

--- QUIZ: Quiz : réseaux | xp: 70
? [F] Sur combien de bits est codée une adresse IPv4 ?
- $16$
- $32$ [ok]
- $64$
- $128$
> Quatre octets, soit $32$ bits.
? [F] Quel protocole traduit un nom de domaine en adresse IP ?
- DNS [ok]
- HTTP
- TCP
- UDP
> Le DNS fait la correspondance.
? [F] Qu'est-ce qu'un routeur ?
- Un appareil qui achemine les paquets entre réseaux [ok]
- Un écran
- Un clavier
- Un navigateur
> Il oriente les paquets.
? [M] Quel protocole garantit la livraison des données ?
- TCP [ok]
- UDP
- DNS
- ARP
> Accusés de réception et retransmission.
? [M] Sur quel port HTTPS écoute-t-il par défaut ?
- $22$
- $80$
- $443$ [ok]
- $8080$
> HTTPS utilise le port $443$.
? [M] Parmi ces adresses, laquelle est une adresse IPv4 valide ?
- `192.168.1.10` [ok]
- `192.168.1.300`
- `192.168.1`
- `abc.def.1.1`
> Chaque octet est compris entre $0$ et $255$.
? [D] Pourquoi UDP est-il utilisé pour la vidéo en direct ?
- Il est rapide, sans retransmission [ok]
- Il est plus sûr
- Il chiffre les données
- Il est obligatoire
> Une image perdue vaut mieux qu'un retard.
? [D] Combien d'adresses distinctes IPv4 offre-t-il au maximum ?
- $2^{16}$
- $2^{32}$ [ok]
- $2^{64}$
- $10^6$
> $32$ bits : $2^{32}$ adresses.
