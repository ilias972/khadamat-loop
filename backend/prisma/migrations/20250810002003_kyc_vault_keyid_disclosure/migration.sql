-- AlterTable
ALTER TABLE "KycVault" ADD COLUMN "keyId" TEXT;

-- CreateTable
CREATE TABLE "DisclosureRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "targetUserId" INTEGER NOT NULL,
    "justification" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedBy" INTEGER NOT NULL,
    "approvedBy" INTEGER,
    "approvedAt" DATETIME,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LegalHold" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "until" DATETIME NOT NULL,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LegalHold_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DisclosureRequest_status_createdAt_idx" ON "DisclosureRequest"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LegalHold_userId_key" ON "LegalHold"("userId");

-- CreateIndex
CREATE INDEX "KycVault_keyId_idx" ON "KycVault"("keyId");
