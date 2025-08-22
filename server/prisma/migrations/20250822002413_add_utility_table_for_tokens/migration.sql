-- CreateTable
CREATE TABLE "public"."TokenUtil" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "requestIP" TEXT,
    "requestUA" TEXT,

    CONSTRAINT "TokenUtil_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TokenUtil" ADD CONSTRAINT "TokenUtil_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
