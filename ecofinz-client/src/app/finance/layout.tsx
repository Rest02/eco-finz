import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import React from "react";
import { Sidebar } from "@/features/finance/components/layout/Sidebar";
import { RightPanel } from "@/features/finance/components/layout/RightPanel";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

          {/* Panel de Detalles Derecho (Se muestra en el Dashboard o globalmente según se prefiera) */}
          {/* Por ahora lo mantenemos global para el módulo de finanzas como en el diseño */}
          <RightPanel />
        </main>
      </div>
    </ProtectedRoute>
  );
}
