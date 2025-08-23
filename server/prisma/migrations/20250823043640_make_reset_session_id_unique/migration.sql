/*
  Warnings:

  - A unique constraint covering the columns `[resetSessionId]` on the table `PasswordResetSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetSession_resetSessionId_key" ON "public"."PasswordResetSession"("resetSessionId");
