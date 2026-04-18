/*
  Warnings:

  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[audioId]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `audioId` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "postStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "audioStatus" AS ENUM ('PENDING', 'ATTACHED', 'DELETED');

-- AlterTable
ALTER TABLE "posts" DROP CONSTRAINT "posts_pkey",
ADD COLUMN     "audioId" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "postStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "posts_id_seq";

-- CreateTable
CREATE TABLE "audios" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION,
    "status" "audioStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "audios_key_key" ON "audios"("key");

-- CreateIndex
CREATE INDEX "audios_status_idx" ON "audios"("status");

-- CreateIndex
CREATE UNIQUE INDEX "posts_audioId_key" ON "posts"("audioId");

-- CreateIndex
CREATE INDEX "posts_usersId_idx" ON "posts"("usersId");

-- CreateIndex
CREATE INDEX "posts_status_idx" ON "posts"("status");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_audioId_fkey" FOREIGN KEY ("audioId") REFERENCES "audios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
