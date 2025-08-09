-- CreateTable
CREATE TABLE "SmsMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "bookingId" INTEGER,
    "type" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "provider" TEXT,
    "providerMessageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SmsMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "idx_sms_user_date" ON "SmsMessage"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_sms_once_per_event" ON "SmsMessage"("userId", "bookingId", "type");
