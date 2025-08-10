CREATE TABLE "PasswordResetToken" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "userId" INTEGER NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" DATETIME NOT NULL,
  "usedAt" DATETIME,
  "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "PasswordResetToken"("userId", "expiresAt");
