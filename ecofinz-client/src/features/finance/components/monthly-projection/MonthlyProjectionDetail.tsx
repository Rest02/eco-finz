"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { useMonthlyProjection, useDeleteMonthlyProjection, useDuplicateMonthlyProjection } from "../../hooks/useMonthlyProjections";
import { useAccounts } from "../../hooks/useAccounts";
import { CalendarRange, Edit, Copy, Trash2, ArrowLeft, Loader2, Wallet, CreditCard, Calculator, PiggyBank } from "lucide-react";
import { VariableExpensePlan } from "./VariableExpensePlan";
import toast from "react-hot-toast";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface MonthlyProjectionDetailProps {
  id: string;
}

export function MonthlyProjectionDetail({ id }: MonthlyProjectionDetailProps) {
  const router = useRouter();
  const { data: projection, isLoading } = useMonthlyProjection(id);
  const { data: accounts = [] } = useAccounts();
  const deleteProjection = useDeleteMonthlyProjection();
  const duplicateProjection = useDuplicateMonthlyProjection();

  const savingsAccounts = useMemo(() => accounts.filter(a => a.isSavingsAccount), [accounts]);
  const currentSavingsBalance = useMemo(
    () => savingsAccounts.reduce((s, a) => s + Number(a.balance), 0),
    [savingsAccounts]
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  const formatPeriod = (period: string) => {
    const [y, m] = period.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${y}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!projection) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500 font-medium">Proyección no encontrada.</p>
      </div>
    );
  }

  const statusLabel = projection.status === "ACTIVE" ? "Activa" : projection.status === "ARCHIVED" ? "Archivada" : "Eliminada";
  const statusColor = projection.status === "ACTIVE" ? "text-emerald-600 bg-emerald-50" : projection.status === "ARCHIVED" ? "text-zinc-600 bg-zinc-100" : "text-red-600 bg-red-50";

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar esta proyección?")) {
      deleteProjection.mutate(id, {
        onSuccess: () => {
          toast.success("Proyección eliminada");
          router.push("/finance/projection/monthly");
        },
        onError: () => toast.error("Error al eliminar"),
      });
    }
  };

  const handleDuplicate = () => {
    duplicateProjection.mutate(id, {
      onSuccess: () => {
        toast.success("Proyección duplicada");
        router.push("/finance/projection/monthly");
      },
      onError: () => toast.error("Error al duplicar"),
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <button
          onClick={() => router.push("/finance/projection/monthly")}
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-black transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al historial
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
              <CalendarRange className="w-6 h-6" />
              {projection.name}
            </h1>
            <p className="text-sm text-zinc-500 font-medium mt-0.5">
              {formatPeriod(projection.period)} · Día de pago: {projection.payDay}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${statusColor}`}>
              {statusLabel}
            </span>
            <button
              onClick={() => router.push(`/finance/projection/monthly/${id}/edit`)}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDuplicate}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
              title="Duplicar"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos */}
        <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
          <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Ingresos
          </h3>
          <div className="space-y-2">
            {projection.incomeSnapshot.map((inc, i) => (
              <div key={i} className="flex justify-between py-1.5 px-3 rounded-xl bg-zinc-50">
                <span className="text-sm text-zinc-700">{inc.name}</span>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(inc.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 mt-2">
              <span className="text-sm font-bold text-emerald-700">Total ingresos</span>
              <span className="text-sm font-bold text-emerald-700">{formatCurrency(projection.totalSelectedIncome)}</span>
            </div>
          </div>
        </motion.div>

        {/* Gastos Fijos */}
        <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
          <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Gastos Fijos
          </h3>
          <div className="space-y-2">
            {projection.fixedExpenseSnapshot.map((exp, i) => (
              <div key={i} className="flex justify-between py-1.5 px-3 rounded-xl bg-zinc-50">
                <span className="text-sm text-zinc-700">{exp.name}</span>
                <span className="text-sm font-bold text-rose-600">{formatCurrency(exp.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 mt-2">
              <span className="text-sm font-bold text-rose-700">Total gastos</span>
              <span className="text-sm font-bold text-rose-700">{formatCurrency(projection.totalFixedExpenses)}</span>
            </div>
          </div>
        </motion.div>

        {/* Pagos Tarjetas */}
        <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
          <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pagos de Tarjetas
          </h3>
          <div className="space-y-2">
            {projection.cardPaymentSnapshot.length === 0 ? (
              <p className="text-sm text-zinc-400">Sin pagos de tarjetas registrados.</p>
            ) : (
              projection.cardPaymentSnapshot.map((p, i) => (
                <div key={i} className="flex justify-between py-1.5 px-3 rounded-xl bg-zinc-50">
                  <span className="text-sm text-zinc-700">{p.name}</span>
                  <span className="text-sm font-bold text-blue-600">{formatCurrency(p.amount)}</span>
                </div>
              ))
            )}
            {projection.cardPaymentSnapshot.length > 0 && (
              <div className="flex justify-between py-2 px-3 rounded-xl bg-blue-50 border border-blue-200 mt-2">
                <span className="text-sm font-bold text-blue-700">Total tarjetas</span>
                <span className="text-sm font-bold text-blue-700">{formatCurrency(projection.totalCardPayments)}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Distribución */}
        <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
          <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Distribución
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between py-2 px-3 rounded-xl bg-zinc-100 border border-zinc-200">
              <span className="text-xs font-bold text-zinc-700">Dinero disponible real</span>
              <span className="text-sm font-bold text-zinc-900">{formatCurrency(projection.realAvailableMoney)}</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-xl bg-emerald-50">
              <span className="text-xs font-medium text-emerald-600">Ahorro ({Number(projection.savingsPercentage).toFixed(2)}%)</span>
              <span className="text-sm font-bold text-emerald-600">{formatCurrency(projection.projectedSavings)}</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-xl bg-amber-50">
              <span className="text-xs font-medium text-amber-600">Gastos variables ({Number(projection.variableExpensesPercentage).toFixed(2)}%)</span>
              <span className="text-sm font-bold text-amber-600">{formatCurrency(projection.projectedVariableExpenses)}</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-xl bg-zinc-100 border border-zinc-200">
              <span className="text-xs font-bold text-zinc-700">Saldo restante</span>
              <span className="text-sm font-bold text-emerald-600">
                {formatCurrency(Math.max(0, projection.realAvailableMoney - projection.projectedSavings - projection.projectedVariableExpenses))}
              </span>
            </div>
          </div>

          {/* Savings Integration */}
          {currentSavingsBalance > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold text-zinc-500 mb-3 flex items-center gap-1">
                <PiggyBank className="w-3 h-3" />
                Ahorro Acumulado
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2 px-3 rounded-xl bg-violet-50">
                  <span className="text-xs font-medium text-violet-600">Proyectado este mes</span>
                  <span className="text-sm font-bold text-violet-600">{formatCurrency(projection.projectedSavings)}</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded-xl bg-violet-50">
                  <span className="text-xs font-medium text-violet-600">+ Saldo actual cuentas ahorro</span>
                  <span className="text-sm font-bold text-violet-600">{formatCurrency(currentSavingsBalance)}</span>
                </div>
                <div className="flex justify-between py-2 px-3 rounded-xl bg-violet-100 border border-violet-300">
                  <span className="text-xs font-bold text-violet-800">Total ahorro acumulado</span>
                  <span className="text-sm font-bold text-violet-800">
                    {formatCurrency(currentSavingsBalance + Number(projection.projectedSavings))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <VariableExpensePlan projection={projection} accounts={accounts} />
    </motion.div>
  );
}
