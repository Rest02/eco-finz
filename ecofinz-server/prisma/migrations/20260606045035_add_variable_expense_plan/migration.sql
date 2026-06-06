-- AlterTable
ALTER TABLE "monthly_projections" ADD COLUMN     "spendingDays" TEXT,
ADD COLUMN     "spendingPlanPattern" TEXT DEFAULT 'business_days',
ADD COLUMN     "variableExpensesAccountId" TEXT;

-- AddForeignKey
ALTER TABLE "monthly_projections" ADD CONSTRAINT "monthly_projections_variableExpensesAccountId_fkey" FOREIGN KEY ("variableExpensesAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
