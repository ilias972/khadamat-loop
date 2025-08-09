-- CreateIndex
CREATE INDEX "idx_booking_provider_status_day" ON "Booking"("providerId", "status", "scheduledDay");

-- RedefineIndex
DROP INDEX "Message_receiverId_isRead_createdAt_idx";
CREATE INDEX "idx_msg_rx_read_date" ON "Message"("receiverId", "isRead", "createdAt");

-- RedefineIndex
DROP INDEX "Subscription_userId_status_idx";
CREATE INDEX "idx_sub_user_status" ON "Subscription"("userId", "status");
