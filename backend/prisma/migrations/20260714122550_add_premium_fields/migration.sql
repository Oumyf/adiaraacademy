-- AlterTable
ALTER TABLE "cours" ADD COLUMN     "premium" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "utilisateurs" ADD COLUMN     "estPremium" BOOLEAN NOT NULL DEFAULT false;
