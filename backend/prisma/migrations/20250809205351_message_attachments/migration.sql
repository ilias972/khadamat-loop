-- AlterTable
ALTER TABLE "Message" ADD COLUMN "fileSize" INTEGER;
ALTER TABLE "Message" ADD COLUMN "fileType" TEXT;
ALTER TABLE "Message" ADD COLUMN "fileUrl" TEXT;

-- CreateIndex
CREATE INDEX "Message_receiverId_isRead_createdAt_idx" ON "Message"("receiverId", "isRead", "createdAt");
