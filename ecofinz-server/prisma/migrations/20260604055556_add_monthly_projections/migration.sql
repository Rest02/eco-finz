-- CreateEnum
CREATE TYPE "ProjectionStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'DELETED');

-- CreateTable
CREATE TABLE "monthly_projections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "status" "ProjectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "payDay" INTEGER NOT NULL,
    "totalSelectedIncome" DECIMAL(12,2) NOT NULL,
    "totalFixedExpenses" DECIMAL(12,2) NOT NULL,
    "totalCardPayments" DECIMAL(12,2) NOT NULL,
    "realAvailableMoney" DECIMAL(12,2) NOT NULL,
    "savingsPercentage" DECIMAL(5,2) NOT NULL,
    "variableExpensesPercentage" DECIMAL(5,2) NOT NULL,
    "projectedSavings" DECIMAL(12,2) NOT NULL,
    "projectedVariableExpenses" DECIMAL(12,2) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_projections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_projection_incomes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "projectionId" TEXT NOT NULL,

    CONSTRAINT "monthly_projection_incomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_projection_fixed_expenses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "projectionId" TEXT NOT NULL,

    CONSTRAINT "monthly_projection_fixed_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_projection_card_payments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "projectionId" TEXT NOT NULL,

    CONSTRAINT "monthly_projection_card_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "monthly_projections" ADD CONSTRAINT "monthly_projections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_projection_incomes" ADD CONSTRAINT "monthly_projection_incomes_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "monthly_projections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_projection_fixed_expenses" ADD CONSTRAINT "monthly_projection_fixed_expenses_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "monthly_projections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_projection_card_payments" ADD CONSTRAINT "monthly_projection_card_payments_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "monthly_projections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
