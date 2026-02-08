"use client";

import React, { useState } from "react";
import { useMonthlySummary } from "@/features/finance/hooks/useBudgets";
import { useTransactions } from "@/features/finance/hooks/useTransactions";
import { MonthSelector } from "@/features/finance/components/dashboard/MonthSelector";
import { BudgetStatusWidget } from "@/features/finance/components/dashboard/BudgetStatusWidget";
import { ExpenseDistributionWidget } from "@/features/finance/components/dashboard/ExpenseDistributionWidget";
import { CashFlowWidget } from "@/features/finance/components/dashboard/CashFlowWidget";
import { QuickTransactionsWidget } from "@/features/finance/components/dashboard/QuickTransactionsWidget";

export default function FinanceDashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Derived state for API hooks
  const selectedYear = currentDate.getFullYear();
  const selectedMonth = currentDate.getMonth() + 1; // 1-indexed for API

  // Fetching real data
  const { data: summary, isLoading: summaryLoading } = useMonthlySummary(selectedYear, selectedMonth);
  const { data: transactionsResponse, isLoading: transactionsLoading } = useTransactions({
    limit: 5 // Get last 5 transactions for the widget
  } as any);

  const transactions = (transactionsResponse as any)?.data || [];
  const isLoading = summaryLoading || transactionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  // Transform Summary Data for Widgets
  const totalBudget = summary?.categorySummaries?.reduce((acc: number, cat: any) => acc + (cat.budgeted || 0), 0) || 0;
  const totalSpent = summary?.categorySummaries?.reduce((acc: number, cat: any) => acc + (cat.spent || 0), 0) || 0;

  const expenseDistributionData = summary?.categorySummaries
    ?.filter((cat: any) => cat.spent > 0)
    .sort((a: any, b: any) => b.spent - a.spent)
    .slice(0, 5)
    .map((cat: any) => ({
      name: cat.categoryName,
      value: cat.spent
    })) || [];

  return (
    <div className="min-h-screen bg-white p-6 lg:p-10 pb-24">

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-1">
            Panel de Control
          </h1>
          <p className="text-zinc-500">
            Resumen de tu actividad financiera de este mes.
          </p>
        </div>
        <MonthSelector
          currentDate={currentDate}
          onMonthChange={setCurrentDate}
        />
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Column 1: Primary Control (Traffic Light & Cash Flow) */}
        <div className="space-y-6">
          {/* Hero Widget: Budget Status */}
          <div className="h-[220px]">
            <BudgetStatusWidget
              totalBudget={totalBudget}
              totalSpent={totalSpent}
            />
          </div>

          {/* Cash Flow */}
          <div className="h-[280px]">
            <CashFlowWidget
              income={summary?.totalIncome || 0}
              expense={summary?.totalExpenses || 0}
            />
          </div>
        </div>

        {/* Column 2: Analysis (Distribution & Transactions) */}
        <div className="space-y-6">
          {/* Expense Distribution */}
          <div className="h-[280px]">
            <ExpenseDistributionWidget data={expenseDistributionData} />
          </div>

          {/* Recent Transactions */}
          <div className="h-[220px]">
            <QuickTransactionsWidget transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
