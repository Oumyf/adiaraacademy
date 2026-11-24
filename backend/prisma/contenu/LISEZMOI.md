# Contenu pédagogique

Un fichier `.md` = un cours (une matière, une classe). Ajouter un fichier puis lancer `npm run db:contenu`
ajoute le cours sans toucher aux autres. `npm run contenu:verifier` contrôle les fichiers sans écrire en base.

Format :

    matiere: MATHEMATIQUES        (MATHEMATIQUES, PHYSIQUE, CHIMIE, SCIENCES_VIE_TERRE, INFORMATIQUE)
    niveau: COLLEGE               (COLLEGE, LYCEE, UNIVERSITE)
    classe: 6ème
    titre: Titre du cours
    description: Une phrase.
    premium: non                  (oui / non)

    --- CHAPITRE: Titre du chapitre | xp: 20
    Leçon en Markdown, formules en $...$ et $$...$$.

    --- QUIZ: Titre du quiz | xp: 50
    ? [F] Énoncé (F facile, M moyen, D difficile)
    - option fausse
    - bonne option [ok]
    - option fausse
    - option fausse
    > Explication affichée après la réponse.

Règles : 4 options par question, une seule `[ok]`, une explication, au moins 6 questions et 2 niveaux de difficulté
par quiz (pour que le quiz s'adapte au niveau de l'élève). Tout contenu doit être relu par un enseignant
avant d'être proposé aux élèves.
