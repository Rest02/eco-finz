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
      <div className="text-center py-20 bg-zinc-50 border border-dashed border-zinc-200 rounded-[2.5rem]">
        <Trophy className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <p className="text-zinc-500 text-lg font-medium">No hay presupuestos configurados para este mes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-black group-hover:text-emerald-600 transition-colors">Objetivos Mensuales</h2>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500">
          {budgets.length} {budgets.length === 1 ? 'objetivo' : 'objetivos'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget) => (
          <div key={budget.id} className="relative group/wrapper">
            <BudgetCard budget={budget} />

            {/* Floating Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/wrapper:opacity-100 transition-opacity translate-y-2 group-hover/wrapper:translate-y-0 duration-300">
              <button
                onClick={() => onBudgetEdit(budget)}
                className="p-2.5 rounded-xl bg-white text-zinc-400 hover:text-amber-500 hover:bg-amber-50 shadow-sm border border-zinc-100 transition-all hover:scale-105"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onBudgetDeleted(budget.id)}
                className="p-2.5 rounded-xl bg-white text-zinc-400 hover:text-red-500 hover:bg-red-50 shadow-sm border border-zinc-100 transition-all hover:scale-105"
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
