-- CreateTable
CREATE TABLE "public"."request_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "request_logs_userId_createdAt_idx" ON "public"."request_logs"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."request_logs" ADD CONSTRAINT "request_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_logs" ADD CONSTRAINT "request_logs_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "public"."api_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
