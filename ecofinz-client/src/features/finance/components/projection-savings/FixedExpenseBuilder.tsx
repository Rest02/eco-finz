"use client";

import React, { useState } from "react";
import { Plus, Trash2, Power, PowerOff, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { FixedExpense } from "../../services/fixedExpenseService";

interface FixedExpenseBuilderProps {
  expenses: FixedExpense[];
  totalFixedExpenses: number;
  onAdd: (name: string, amount: number) => void;
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export function FixedExpenseBuilder({
  expenses,
  totalFixedExpenses,
  onAdd,
  onToggle,
  onDelete,
}: FixedExpenseBuilderProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    const trimmedName = name.trim();
    const parsedAmount = Number(amount);
    if (!trimmedName || !parsedAmount || parsedAmount <= 0) return;
    onAdd(trimmedName, parsedAmount);
    setName("");
    setAmount("");
  };

  const activeExpenses = expenses.filter((e) => e.isActive);
  const inactiveExpenses = expenses.filter((e) => !e.isActive);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del gasto"
          className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto"
          min={1}
          className="w-28 px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5 max-h-56 overflow-y-auto">
        {activeExpenses.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-100"
          >
            <span className="text-sm font-medium text-zinc-800">{exp.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-700">
                ${exp.amount.toLocaleString("es-CL")}
              </span>
              <button
                onClick={() => onToggle(exp.id, false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
              >
                <Power className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(exp.id)}
                className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {inactiveExpenses.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-600">
              Gastos pausados ({inactiveExpenses.length})
            </summary>
            <div className="mt-1.5 space-y-1.5">
              {inactiveExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50/50 border border-zinc-100 opacity-60"
                >
                  <span className="text-sm font-medium text-zinc-500 line-through">
                    {exp.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-400">
                      ${exp.amount.toLocaleString("es-CL")}
                    </span>
                    <button
                      onClick={() => onToggle(exp.id, true)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
                    >
                      <PowerOff className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(exp.id)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}

        {expenses.length === 0 && (
          <p className="text-xs text-zinc-400 text-center py-4 font-medium">
            Agrega tus gastos fijos mensuales
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center pt-3 border-t border-zinc-100">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
          Total Gastos Fijos
        </span>
        <span className="text-base font-black text-zinc-900">
          ${totalFixedExpenses.toLocaleString("es-CL")}
        </span>
      </div>
    </div>
  );
}
