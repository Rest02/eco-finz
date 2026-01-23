"use client";

import React, { useState } from "react";
import BudgetList from "@/features/finance/components/BudgetList";
import BudgetForm from "@/features/finance/components/BudgetForm";
import { useBudgets, useMonthlySummary, useDeleteBudget } from "@/features/finance/hooks/useBudgets";
import { useCategories } from "@/features/finance/hooks/useCategories";
import { Budget } from "@/features/finance/types/finance";
import {
  LayoutDashboard,
  Calendar,
  ArrowUpRight,
  Target,
  ChevronDown,
  Search,
  PieChart,
  Info,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function BudgetsPage() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets({
    month: selectedMonth,
    year: selectedYear
  });
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: summary, isLoading: summaryLoading } = useMonthlySummary(selectedYear, selectedMonth);
  const deleteBudgetMutation = useDeleteBudget();

  const isLoading = budgetsLoading || categoriesLoading || summaryLoading;

  const handleDelete = async (budgetId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este presupuesto?")) {
      await deleteBudgetMutation.mutateAsync(budgetId);
      if (editingBudget?.id === budgetId) setEditingBudget(null);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
  };

  const handleMonthChange = (offset: number) => {
    let newMonth = selectedMonth + offset;
    let newYear = selectedYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const totalBudgeted = budgets.reduce((acc, b) => acc + Number(b.amount), 0);
  const totalSpent = summary?.totalExpenses || 0;
  const percentUsed = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2.5rem] backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-medium">
            <Target className="w-5 h-5" />
            <span className="text-sm tracking-widest uppercase">Planificación</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 tracking-tight">
            Presupuestos
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
              <button
                onClick={() => handleMonthChange(-1)}
                className="p-2 hover:bg-white/10 rounded-full text-neutral-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 text-xs font-bold text-white uppercase tracking-widest min-w-[120px] text-center">
                {monthNames[selectedMonth - 1]} {selectedYear}
              </span>
              <button
                onClick={() => handleMonthChange(1)}
                className="p-2 hover:bg-white/10 rounded-full text-neutral-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="group relative glass-card glass-card-hover p-8 rounded-3xl min-w-[280px] overflow-hidden transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PieChart className="w-6 h-6 stroke-[1.5]" />
          </div>

          <p className="text-xs font-semibold text-indigo-400/60 uppercase tracking-widest mb-1">Total Presupuestado</p>

          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-indigo-400 text-2xl font-bold">$</span>
            <span className="text-4xl font-black text-white tracking-tighter">
              {totalBudgeted.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
              <span className="text-neutral-500">Uso del Presupuesto</span>
              <span className={percentUsed > 90 ? "text-red-400" : percentUsed > 70 ? "text-amber-400" : "text-emerald-400"}>
                {percentUsed.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 rounded-full ${percentUsed > 90 ? "bg-red-500" : percentUsed > 70 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500 blur-[50px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

        {/* Budget List Section */}
        <div className="xl:col-span-2 space-y-6 order-2 xl:order-1">
          {isLoading ? (
            <div className="glass-card p-20 rounded-[2rem] border border-white/5 bg-white/[0.02] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-neutral-500 font-medium animate-pulse">Cargando objetivos...</p>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <BudgetList
                budgets={budgets}
                categories={categories}
                onBudgetEdit={handleEdit}
                onBudgetDeleted={handleDelete}
              />

              {budgets.length > 0 && (
                <div className="mt-12 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">¿Cómo funcionan los presupuestos?</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Establece límites mensuales por categoría para controlar tus gastos.
                      EcoFinz comparará automáticamente tus transacciones con estos límites para mostrarte tu nivel de ahorro.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="xl:sticky xl:top-8 order-1 xl:order-2">
          <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.03] shadow-2xl backdrop-blur-xl">
            <BudgetForm
              month={selectedMonth}
              year={selectedYear}
              isEditMode={!!editingBudget}
              initialBudget={editingBudget || undefined}
              onCancelEdit={handleCancelEdit}
              onBudgetUpdated={() => setEditingBudget(null)}
            />
          </div>

          {!editingBudget && (
            <div className="mt-4 p-5 rounded-2xl bg-indigo-500/5 border border-white/5">
              <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black mb-1">Tip de Ahorro</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Intenta que tu presupuesto de <b>Entretenimiento</b> no supere el 10% de tus ingresos totales.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
