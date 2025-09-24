/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `location` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."location" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;
