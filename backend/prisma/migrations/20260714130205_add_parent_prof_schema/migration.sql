-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PARENT';

-- CreateTable
CREATE TABLE "liens_parent_enfant" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "enfantId" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "liens_parent_enfant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profils_professeurs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "matieres" "Matiere"[],
    "tarifHeure" INTEGER,
    "ville" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "verifie" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profils_professeurs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "liens_parent_enfant_parentId_enfantId_key" ON "liens_parent_enfant"("parentId", "enfantId");

-- CreateIndex
CREATE UNIQUE INDEX "profils_professeurs_userId_key" ON "profils_professeurs"("userId");

-- AddForeignKey
ALTER TABLE "liens_parent_enfant" ADD CONSTRAINT "liens_parent_enfant_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liens_parent_enfant" ADD CONSTRAINT "liens_parent_enfant_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profils_professeurs" ADD CONSTRAINT "profils_professeurs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
