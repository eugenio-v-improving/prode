-- CreateEnum
CREATE TYPE "ProdeStage" AS ENUM ('GROUPS', 'FINALS');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('GROUP_A', 'GROUP_B', 'GROUP_C', 'GROUP_D', 'GROUP_E', 'GROUP_F', 'GROUP_G', 'GROUP_H', 'FINALS_8_1', 'FINALS_8_2', 'FINALS_8_3', 'FINALS_8_4', 'FINALS_8_5', 'FINALS_8_6', 'FINALS_8_7', 'FINALS_8_8', 'FINALS_4_1', 'FINALS_4_2', 'FINALS_4_3', 'FINALS_4_4', 'FINALS_2_1', 'FINALS_2_2', 'FINALS', 'THIRD_PLACE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prode" (
    "id" TEXT NOT NULL,
    "stage" "ProdeStage" NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "groupSubmissionsEnd" TIMESTAMP(3) NOT NULL,
    "finalsSubmissionsEnd" TIMESTAMP(3) NOT NULL,
    "prodeEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "stage" "Stage" NOT NULL,
    "goalsLeft" INTEGER,
    "goalsRight" INTEGER,
    "filled" BOOLEAN NOT NULL DEFAULT false,
    "countryLeftId" TEXT,
    "countryRightId" TEXT,
    "prodeId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdeRoom" (
    "id" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "prodeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "public" BOOLEAN NOT NULL,
    "pointsWinner" INTEGER NOT NULL DEFAULT 1,
    "pointsGoals" INTEGER NOT NULL DEFAULT 3,
    "pointsPenal" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "ProdeRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProde" (
    "id" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "prodeRoomId" TEXT NOT NULL,
    "prodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserProde_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdeUserGroupMatch" (
    "id" TEXT NOT NULL,
    "goalsLeft" INTEGER NOT NULL,
    "goalsRight" INTEGER NOT NULL,
    "userProdeId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "ProdeUserGroupMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdeUserFinalsMatch" (
    "id" TEXT NOT NULL,
    "goalsLeft" INTEGER NOT NULL,
    "goalsRight" INTEGER NOT NULL,
    "countryLeftId" TEXT NOT NULL,
    "countryRightId" TEXT NOT NULL,
    "userProdeId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "ProdeUserFinalsMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserProde_userId_prodeId_key" ON "UserProde"("userId", "prodeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProdeUserGroupMatch_userProdeId_matchId_key" ON "ProdeUserGroupMatch"("userProdeId", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "ProdeUserFinalsMatch_userProdeId_matchId_key" ON "ProdeUserFinalsMatch"("userProdeId", "matchId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_countryLeftId_fkey" FOREIGN KEY ("countryLeftId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_countryRightId_fkey" FOREIGN KEY ("countryRightId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_prodeId_fkey" FOREIGN KEY ("prodeId") REFERENCES "Prode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdeRoom" ADD CONSTRAINT "ProdeRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdeRoom" ADD CONSTRAINT "ProdeRoom_prodeId_fkey" FOREIGN KEY ("prodeId") REFERENCES "Prode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProde" ADD CONSTRAINT "UserProde_prodeRoomId_fkey" FOREIGN KEY ("prodeRoomId") REFERENCES "ProdeRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProde" ADD CONSTRAINT "UserProde_prodeId_fkey" FOREIGN KEY ("prodeId") REFERENCES "Prode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProde" ADD CONSTRAINT "UserProde_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdeUserGroupMatch" ADD CONSTRAINT "ProdeUserGroupMatch_userProdeId_fkey" FOREIGN KEY ("userProdeId") REFERENCES "UserProde"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdeUserGroupMatch" ADD CONSTRAINT "ProdeUserGroupMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdeUserFinalsMatch" ADD CONSTRAINT "ProdeUserFinalsMatch_countryLeftId_fkey" FOREIGN KEY ("countryLeftId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdeUserFinalsMatch" ADD CONSTRAINT "ProdeUserFinalsMatch_countryRightId_fkey" FOREIGN KEY ("countryRightId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdeUserFinalsMatch" ADD CONSTRAINT "ProdeUserFinalsMatch_userProdeId_fkey" FOREIGN KEY ("userProdeId") REFERENCES "UserProde"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdeUserFinalsMatch" ADD CONSTRAINT "ProdeUserFinalsMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
