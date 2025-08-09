-- CreateTable
CREATE TABLE "Verification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "documentType" TEXT,
    "docNumberHash" TEXT,
    "docNumberLast4" TEXT,
    "verifiedAt" DATETIME,
    "data" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserPII" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "legalName" TEXT,
    "dateOfBirth" DATETIME,
    "currentAddress" TEXT,
    "addressCity" TEXT,
    "addressRegion" TEXT,
    "addressPostal" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserPII_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KycVault" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "encDoc" BLOB,
    "encDocTag" BLOB,
    "encDocNonce" BLOB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "KycVault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Verification_userId_status_idx" ON "Verification"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "UserPII_userId_key" ON "UserPII"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KycVault_userId_key" ON "KycVault"("userId");
CREATE UNIQUE INDEX "Verification_externalId_key" ON "Verification"("externalId");
