import React from "react";
import { DashboardHeader } from "@/features/finance/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/features/finance/components/dashboard/StatsGrid";
import { BalanceChart } from "@/features/finance/components/dashboard/BalanceChart";
import { TransactionHistoryList } from "@/features/finance/components/dashboard/TransactionHistoryList";

export default function FinanceDashboardPage() {
  return (
    <div className="p-6 lg:p-10">
      {/* Header: Título, Búsqueda y Perfil */}
      <DashboardHeader />

      {/* Grid de Estadísticas Superiores */}
      <StatsGrid />

      {/* Sección de Gráfico de Balance */}
      <BalanceChart />

      {/* Historial de Transacciones */}
      <TransactionHistoryList />
    </div>
  );
}

