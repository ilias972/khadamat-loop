CREATE TABLE IF NOT EXISTS "WebhookEvent" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "provider" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'RECEIVED',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" DATETIME,
  CONSTRAINT "uq_webhook_provider_event" UNIQUE("provider","eventId")
);

CREATE INDEX IF NOT EXISTS "idx_webhook_created" ON "WebhookEvent"("createdAt");
