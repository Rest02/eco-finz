"use client";

import React from "react";
import { Budget, Category } from "../types/finance";
import BudgetCard from "./BudgetCard";
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
          <div key={budget.id} className="relative group/wrapper">
            <BudgetCard budget={budget} />

            {/* Floating Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/wrapper:opacity-100 transition-opacity">
              <button
                onClick={() => onBudgetEdit(budget)}
                className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 transition-colors backdrop-blur-md border border-white/10"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onBudgetDeleted(budget.id)}
                className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors backdrop-blur-md border border-white/10"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetList;
