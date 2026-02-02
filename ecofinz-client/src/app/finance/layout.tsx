"use client";

import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import React from "react";
import { Sidebar } from "@/features/finance/components/layout/Sidebar";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-zinc-50 text-zinc-900 overflow-hidden">
        {/* Navegación Izquierda */}
        <Sidebar />

        {/* Contenido Principal */}
        <main className="flex-1 flex overflow-hidden relative">
          {/* Área de Contenido Central */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
