-- CreateEnum
CREATE TYPE "StatutCommission" AS ENUM ('A_PAYER', 'PAYEE');

-- AlterTable
ALTER TABLE "utilisateurs" ADD COLUMN     "codePromoUtiliseId" TEXT;

-- CreateTable
CREATE TABLE "codes_promo" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "proprietaireId" TEXT NOT NULL,
    "reductionPct" INTEGER NOT NULL DEFAULT 20,
    "commissionPct" INTEGER NOT NULL DEFAULT 20,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "codes_promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commissions" (
    "id" TEXT NOT NULL,
    "codePromoId" TEXT NOT NULL,
    "abonnementId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "montantBase" INTEGER NOT NULL,
    "montant" INTEGER NOT NULL,
    "referenceTransaction" TEXT,
    "statut" "StatutCommission" NOT NULL DEFAULT 'A_PAYER',
    "payeeLe" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "codes_promo_code_key" ON "codes_promo"("code");

-- CreateIndex
CREATE UNIQUE INDEX "codes_promo_proprietaireId_key" ON "codes_promo"("proprietaireId");

-- CreateIndex
CREATE UNIQUE INDEX "commissions_abonnementId_key" ON "commissions"("abonnementId");

-- AddForeignKey
ALTER TABLE "utilisateurs" ADD CONSTRAINT "utilisateurs_codePromoUtiliseId_fkey" FOREIGN KEY ("codePromoUtiliseId") REFERENCES "codes_promo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codes_promo" ADD CONSTRAINT "codes_promo_proprietaireId_fkey" FOREIGN KEY ("proprietaireId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_codePromoId_fkey" FOREIGN KEY ("codePromoId") REFERENCES "codes_promo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
