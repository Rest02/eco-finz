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
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";

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
    <motion.div
      className="p-4 lg:p-10 space-y-8 min-h-full animate-fade-in"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-500 font-medium">
            <Target className="w-5 h-5" />
            <span className="text-sm tracking-widest uppercase">Planificación</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Month Selector integrated nicely */}
            <div className="flex items-center bg-zinc-100 rounded-full p-1 border border-zinc-200">
              <button
                onClick={() => handleMonthChange(-1)}
                className="p-2 hover:bg-white rounded-full text-zinc-600 transition-all shadow-sm hover:shadow"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 text-xs font-bold text-black uppercase tracking-widest min-w-[120px] text-center">
                {monthNames[selectedMonth - 1]} {selectedYear}
              </span>
              <button
                onClick={() => handleMonthChange(1)}
                className="p-2 hover:bg-white rounded-full text-zinc-600 transition-all shadow-sm hover:shadow"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            Presupuestos
          </h1>
        </div>

        {/* Stat Card */}
        <div className="group relative bg-white/20 border border-white/30 p-6 lg:p-8 rounded-2xl min-w-[280px] overflow-hidden transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px]"
          style={{ backdropFilter: 'blur(5px)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/50 text-emerald-600 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Total Presupuestado</p>
          </div>

          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-zinc-400 text-2xl font-bold">$</span>
            <span className="text-4xl font-bold text-black tracking-tight">
              {totalBudgeted.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
            </span>
          </div>

          <div className="mt-4 space-y-2 relative z-10">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
              <span className="text-zinc-500">Uso del Presupuesto</span>
              <span className={percentUsed > 90 ? "text-red-500" : percentUsed > 70 ? "text-amber-500" : "text-emerald-500"}>
                {percentUsed.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 rounded-full ${percentUsed > 90 ? "bg-red-500" : percentUsed > 70 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
          </div>

          {/* Subtle shine effect */}
          <div className="absolute top-0 right-0 p-12 bg-white/40 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

        {/* Budget List Section */}
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-6 order-2 xl:order-1">
          {isLoading ? (
            <div className="bg-white/20 border border-white/30 p-20 rounded-[2rem] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-zinc-500 font-medium animate-pulse">Cargando objetivos...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/20 border border-white/30 p-6 md:p-8 rounded-[2rem] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px]" style={{ backdropFilter: 'blur(5px)' }}>
              <BudgetList
                budgets={budgets}
                categories={categories}
                onBudgetEdit={handleEdit}
                onBudgetDeleted={handleDelete}
              />

              {budgets.length > 0 && (
                <div className="mt-8 p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-white border border-zinc-100 text-emerald-600 shadow-sm">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-black uppercase tracking-wider">¿Cómo funcionan los presupuestos?</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Establece límites mensuales por categoría para controlar tus gastos.
                      EcoFinz comparará automáticamente tus transacciones con estos límites para mostrarte tu nivel de ahorro.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Form Section */}
        <motion.div variants={itemVariants} className="xl:sticky xl:top-8 order-1 xl:order-2">
          <div className="bg-white/20 border border-white/30 p-8 rounded-[2rem] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px]" style={{ backdropFilter: 'blur(5px)' }}>
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
            <div className="mt-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1">Tip de Ahorro</p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Intenta que tu presupuesto de <b>Entretenimiento</b> no supere el 10% de tus ingresos totales.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
