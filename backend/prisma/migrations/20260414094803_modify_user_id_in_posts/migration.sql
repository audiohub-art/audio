/*
  Warnings:

  - You are about to drop the column `usersId` on the `posts` table. All the data in the column will be lost.
  - Added the required column `userId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_usersId_fkey";

-- DropIndex
DROP INDEX "posts_usersId_idx";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "usersId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "posts_userId_idx" ON "posts"("userId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
