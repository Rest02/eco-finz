"use client";

import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import React from "react";
import { Sidebar } from "@/features/finance/components/layout/Sidebar";
import { RightPanel } from "@/features/finance/components/layout/RightPanel";
import { useAccounts } from "@/features/finance/hooks/useAccounts";
import { useTransactions } from "@/features/finance/hooks/useTransactions";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);

  const { data: accounts = [] } = useAccounts();
  const { data: transactionsResponse } = useTransactions({ limit: 5 } as any);
  const transactions = (transactionsResponse as any)?.data || [];

  // Determine if we should show the right panel based on pathname
  const shouldShowRightPanel = pathname === "/finance/accounts" || pathname.startsWith("/finance/accounts/");

  useEffect(() => {
    setIsRightPanelVisible(shouldShowRightPanel);
  }, [pathname, shouldShowRightPanel]);

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-dark-bg text-neutral-300 overflow-hidden">
        {/* Navegación Izquierda */}
        <Sidebar />

        {/* Contenido Principal */}
        <main className="flex-1 flex overflow-hidden relative">
          {/* Área de Contenido Central */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>

          {/* Panel de Detalles Derecho (Conditional) */}
          {isRightPanelVisible && (
            <div className={`transition-all duration-300 ease-in-out relative ${isRightPanelCollapsed ? "w-0" : "w-full lg:w-96"}`}>
              {!isRightPanelCollapsed && (
                <RightPanel accounts={accounts} transactions={transactions} />
              )}

              {/* Toggle Button - Border between content and panel */}
              <button
                onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
                className={`absolute bottom-6 -left-6 z-50 p-2 rounded-lg bg-dark-sidebar border border-white/10 text-neutral-500 hover:text-emerald-400 transition-all backdrop-blur-md shadow-xl ${isRightPanelCollapsed ? "translate-x-0" : ""}`}
                title={isRightPanelCollapsed ? "Mostrar panel" : "Ocultar panel"}
              >
                {isRightPanelCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
              </button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
