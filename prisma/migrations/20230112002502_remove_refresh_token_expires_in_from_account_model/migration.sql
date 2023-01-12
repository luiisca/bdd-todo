/*
  Warnings:

  - You are about to drop the column `refresh_token_expires_in` on the `Account` table. All the data in the column will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Account` DROP COLUMN `refresh_token_expires_in`;

-- AlterTable
ALTER TABLE `User` MODIFY `email` VARCHAR(191) NOT NULL;
