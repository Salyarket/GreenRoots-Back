/*
  Warnings:

  - You are about to drop the column `updated_at` on the `location` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."location" DROP COLUMN "updated_at",
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL;
