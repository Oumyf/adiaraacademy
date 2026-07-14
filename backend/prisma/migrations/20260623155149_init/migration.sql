-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ELEVE', 'PROFESSEUR', 'ADMIN');

-- CreateEnum
CREATE TYPE "NiveauScolaire" AS ENUM ('COLLEGE', 'LYCEE', 'UNIVERSITE');

-- CreateEnum
CREATE TYPE "Matiere" AS ENUM ('MATHEMATIQUES', 'PHYSIQUE', 'CHIMIE', 'SCIENCES_VIE_TERRE', 'INFORMATIQUE');

-- CreateEnum
CREATE TYPE "StatutProgression" AS ENUM ('NON_COMMENCE', 'EN_COURS', 'TERMINE');

-- CreateEnum
CREATE TYPE "TypeQuiz" AS ENUM ('QCM', 'REPONSE_LIBRE', 'VRAI_FAUX');

-- CreateEnum
CREATE TYPE "Difficulte" AS ENUM ('FACILE', 'MOYEN', 'DIFFICILE');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ELEVE',
    "niveau" "NiveauScolaire" NOT NULL,
    "classe" TEXT,
    "ecole" TEXT,
    "xpTotal" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "derniereActivite" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cours" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "matiere" "Matiere" NOT NULL,
    "niveau" "NiveauScolaire" NOT NULL,
    "classe" TEXT,
    "imageUrl" TEXT,
    "publie" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,
    "auteurId" TEXT NOT NULL,

    CONSTRAINT "cours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapitres" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "xpObtenu" INTEGER NOT NULL DEFAULT 10,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,
    "coursId" TEXT NOT NULL,

    CONSTRAINT "chapitres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "type" "TypeQuiz" NOT NULL DEFAULT 'QCM',
    "dureMin" INTEGER,
    "xpMax" INTEGER NOT NULL DEFAULT 50,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,
    "chapitreId" TEXT NOT NULL,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "enonce" TEXT NOT NULL,
    "options" JSONB,
    "reponseCorrecte" TEXT NOT NULL,
    "explication" TEXT,
    "difficulte" "Difficulte" NOT NULL DEFAULT 'MOYEN',
    "ordre" INTEGER NOT NULL,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progressions" (
    "id" TEXT NOT NULL,
    "statut" "StatutProgression" NOT NULL DEFAULT 'NON_COMMENCE',
    "score" INTEGER,
    "xpGagne" INTEGER NOT NULL DEFAULT 0,
    "tentatives" INTEGER NOT NULL DEFAULT 0,
    "termineLeAt" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "chapitreId" TEXT NOT NULL,

    CONSTRAINT "progressions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tentatives" (
    "id" TEXT NOT NULL,
    "reponses" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "xpGagne" INTEGER NOT NULL DEFAULT 0,
    "dureeSec" INTEGER,
    "commenceLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "termineLeAt" TIMESTAMP(3),
    "utilisateurId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "tentatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "condition" JSONB NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges_utilisateurs" (
    "id" TEXT NOT NULL,
    "obtenuLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateurId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,

    CONSTRAINT "badges_utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "chapitres_coursId_ordre_key" ON "chapitres"("coursId", "ordre");

-- CreateIndex
CREATE UNIQUE INDEX "questions_quizId_ordre_key" ON "questions"("quizId", "ordre");

-- CreateIndex
CREATE UNIQUE INDEX "progressions_utilisateurId_chapitreId_key" ON "progressions"("utilisateurId", "chapitreId");

-- CreateIndex
CREATE UNIQUE INDEX "badges_nom_key" ON "badges"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "badges_utilisateurs_utilisateurId_badgeId_key" ON "badges_utilisateurs"("utilisateurId", "badgeId");

-- AddForeignKey
ALTER TABLE "cours" ADD CONSTRAINT "cours_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapitres" ADD CONSTRAINT "chapitres_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "cours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_chapitreId_fkey" FOREIGN KEY ("chapitreId") REFERENCES "chapitres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progressions" ADD CONSTRAINT "progressions_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progressions" ADD CONSTRAINT "progressions_chapitreId_fkey" FOREIGN KEY ("chapitreId") REFERENCES "chapitres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tentatives" ADD CONSTRAINT "tentatives_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tentatives" ADD CONSTRAINT "tentatives_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges_utilisateurs" ADD CONSTRAINT "badges_utilisateurs_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges_utilisateurs" ADD CONSTRAINT "badges_utilisateurs_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
