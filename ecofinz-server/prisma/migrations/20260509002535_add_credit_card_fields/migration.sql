-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "closingDay" INTEGER,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "creditLimit" DECIMAL(10,2),
ADD COLUMN     "dueDay" INTEGER,
ADD COLUMN     "lastDigits" TEXT;
