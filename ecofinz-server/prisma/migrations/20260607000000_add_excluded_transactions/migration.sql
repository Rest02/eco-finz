-- CreateTable
CREATE TABLE "monthly_projection_excluded_transactions" (
    "id" TEXT NOT NULL,
    "projectionId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "monthly_projection_excluded_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monthly_projection_excluded_transactions_projectionId_transa_key" ON "monthly_projection_excluded_transactions"("projectionId", "transactionId");

-- AddForeignKey
ALTER TABLE "monthly_projection_excluded_transactions" ADD CONSTRAINT "monthly_projection_excluded_transactions_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "monthly_projections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
