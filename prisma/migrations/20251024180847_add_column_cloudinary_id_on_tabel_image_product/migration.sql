/*
  Warnings:

  - Added the required column `cloudinaryId` to the `ImageProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImageProduct" ADD COLUMN     "cloudinaryId" TEXT NOT NULL;
