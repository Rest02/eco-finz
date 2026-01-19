'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import React from "react";

// Este layout envuelve todas las páginas dentro de /finance
// y les aplica la lógica de protección de rutas.
export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
