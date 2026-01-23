"use client";

import React from "react";
import { Budget, Category } from "../types/finance";
import {
  Target,
  Pencil,
  Trash2,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Trophy
} from "lucide-react";

interface Props {
  budgets: Budget[];
  categories: Category[];
  onBudgetDeleted: (budgetId: string) => void;
  onBudgetEdit: (budget: Budget) => void;
}

const BudgetList: React.FC<Props> = ({ budgets, categories, onBudgetDeleted, onBudgetEdit }) => {
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Categoría desconocida";
  };

  if (budgets.length === 0) {
    return (
      <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
        <Trophy className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
        <p className="text-neutral-500 text-lg">No hay presupuestos configurados para este mes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-white/90">Objetivos Mensuales</h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400">
          {budgets.length} {budgets.length === 1 ? 'objetivo' : 'objetivos'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget) => (
          <div
            key={budget.id}
            className="group relative glass-card glass-card-hover rounded-3xl p-6 transition-all duration-300 overflow-hidden"
          >
            {/* Options Icon */}
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => onBudgetEdit(budget)}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-amber-400 transition-all"
                title="Editar objetivo"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onBudgetDeleted(budget.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all"
                title="Eliminar objetivo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Icon Box */}
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 stroke-[1.5]" />
            </div>

            {/* Info */}
            <div>
              <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-wider text-sm mb-1">
                {budget.name}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-4">
                <AlertCircle className="w-3 h-3" />
                {getCategoryName(budget.categoryId)}
              </div>
            </div>

            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-tighter mb-1 font-bold">Límite Establecido</p>
                <div className="text-2xl font-bold text-white tracking-tight">
                  <span className="text-emerald-500 mr-1">$</span>
                  {parseFloat(String(budget.amount)).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-indigo-500/5 text-indigo-400/60 text-[10px] font-bold uppercase tracking-tighter border border-indigo-500/10">
                <TrendingUp className="w-3 h-3" />
                ACTIVO
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-500 blur-[40px] rounded-full transition-colors opacity-20 group-hover:opacity-40" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetList;
