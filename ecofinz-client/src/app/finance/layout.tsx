"use client";

import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import React from "react";
import { Sidebar } from "@/features/finance/components/layout/Sidebar";
import { MobileNavbar } from "@/features/finance/components/layout/MobileNavbar";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-zinc-50 text-zinc-900 overflow-hidden">
        {/* Navegación Izquierda (Desktop) */}
        <Sidebar />

        {/* Contenido Principal */}
        <main className="flex-1 flex overflow-hidden relative">
          {/* Área de Contenido Central */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 lg:pb-0">
            {children}
          </div>

          {/* Navegación Inferior (Mobile) */}
          <MobileNavbar />
        </main>
      </div>
    </ProtectedRoute>
  );
}
