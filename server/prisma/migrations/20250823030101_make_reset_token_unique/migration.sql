/*
  Warnings:

  - A unique constraint covering the columns `[tokenHash]` on the table `TokenUtil` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TokenUtil_tokenHash_key" ON "public"."TokenUtil"("tokenHash");
