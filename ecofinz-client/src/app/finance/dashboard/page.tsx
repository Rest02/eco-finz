"use client";

import React, { useState } from "react";
import { DashboardHeader } from "@/features/finance/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/features/finance/components/dashboard/StatsGrid";
import { BalanceChart } from "@/features/finance/components/dashboard/BalanceChart";
import { TransactionHistoryList } from "@/features/finance/components/dashboard/TransactionHistoryList";
import { useAccounts } from "@/features/finance/hooks/useAccounts";
import { useMonthlySummary } from "@/features/finance/hooks/useBudgets";
import { useTransactions } from "@/features/finance/hooks/useTransactions";

export default function FinanceDashboardPage() {
  const currentDate = new Date();
  const [selectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth] = useState(currentDate.getMonth() + 1);

  // Fetching real data
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: summary, isLoading: summaryLoading } = useMonthlySummary(selectedYear, selectedMonth);
  const { data: transactionsResponse, isLoading: transactionsLoading } = useTransactions({
    limit: 10 // Get last 10 transactions
  } as any);

  const transactions = (transactionsResponse as any)?.data || [];

  const isLoading = accountsLoading || summaryLoading || transactionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header: Título, Búsqueda y Perfil */}
      <DashboardHeader />

      {/* Grid de Estadísticas Superiores */}
      <StatsGrid accounts={accounts} summary={summary} />

      {/* Sección de Gráfico de Balance */}
      <BalanceChart summary={summary} />

      {/* Historial de Transacciones */}
      <TransactionHistoryList transactions={transactions} />
    </div>
  );
}

