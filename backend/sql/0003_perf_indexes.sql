-- Add performance indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_provider_lat_lng ON "Provider" (lat, lng);
CREATE INDEX IF NOT EXISTS idx_booking_provider_day_status ON "Booking" ("providerId", "scheduledDay", status);
CREATE INDEX IF NOT EXISTS idx_booking_client_created ON "Booking" ("clientId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_message_conv_created ON "Message" ("conversationId", "createdAt");
