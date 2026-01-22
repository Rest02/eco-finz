"use client";

import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import React from "react";
import { Sidebar } from "@/features/finance/components/layout/Sidebar";
import { RightPanel } from "@/features/finance/components/layout/RightPanel";
import { useAccounts } from "@/features/finance/hooks/useAccounts";
import { useTransactions } from "@/features/finance/hooks/useTransactions";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: accounts = [] } = useAccounts();
  const { data: transactionsResponse } = useTransactions({ limit: 5 } as any);
  const transactions = (transactionsResponse as any)?.data || [];

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-dark-bg text-neutral-300 overflow-hidden">
        {/* Navegación Izquierda */}
        <Sidebar />

        {/* Contenido Principal y Panel Derecho */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Área de Contenido Central */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>

          {/* Panel de Detalles Derecho */}
          <RightPanel accounts={accounts} transactions={transactions} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
