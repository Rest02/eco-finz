-- CreateTable
CREATE TABLE "monthly_projection_week_adjustments" (
    "id" TEXT NOT NULL,
    "projectionId" TEXT NOT NULL,
    "sourceWeekIndex" INTEGER NOT NULL,
    "targetWeekIndex" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_projection_week_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monthly_projection_week_adjustments_projectionId_sourceWeek_key" ON "monthly_projection_week_adjustments"("projectionId", "sourceWeekIndex", "targetWeekIndex");

-- AddForeignKey
ALTER TABLE "monthly_projection_week_adjustments" ADD CONSTRAINT "monthly_projection_week_adjustments_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "monthly_projections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "monthly_projection_excluded_transactions_projectionId_transa_ke" RENAME TO "monthly_projection_excluded_transactions_projectionId_trans_key";
