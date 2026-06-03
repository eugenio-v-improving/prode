-- AlterTable
ALTER TABLE "Country" ADD COLUMN "externalId" INTEGER;
CREATE UNIQUE INDEX "Country_externalId_key" ON "Country"("externalId");

-- AlterTable
ALTER TABLE "Match" ADD COLUMN "apiFixtureId" INTEGER;
CREATE UNIQUE INDEX "Match_apiFixtureId_key" ON "Match"("apiFixtureId");
