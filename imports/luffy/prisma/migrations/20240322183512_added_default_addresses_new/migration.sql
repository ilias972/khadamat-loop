/*
  Warnings:

  - The `defaultBillingAddress` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `defaultShippingAddress` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "defaultBillingAddress",
ADD COLUMN     "defaultBillingAddress" INTEGER,
DROP COLUMN "defaultShippingAddress",
ADD COLUMN     "defaultShippingAddress" INTEGER;
