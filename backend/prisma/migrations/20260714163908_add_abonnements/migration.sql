-- CreateEnum
CREATE TYPE "StatutAbonnement" AS ENUM ('EN_ATTENTE', 'ACTIF', 'EXPIRE', 'ANNULE');

-- CreateEnum
CREATE TYPE "MethodePaiement" AS ENUM ('ORANGE_MONEY', 'WAVE');

-- CreateTable
CREATE TABLE "abonnements" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "statut" "StatutAbonnement" NOT NULL DEFAULT 'EN_ATTENTE',
    "montant" INTEGER NOT NULL DEFAULT 2900,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "methodePaiement" "MethodePaiement" NOT NULL,
    "referenceTransaction" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "abonnements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "abonnements_referenceTransaction_key" ON "abonnements"("referenceTransaction");

-- AddForeignKey
ALTER TABLE "abonnements" ADD CONSTRAINT "abonnements_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
