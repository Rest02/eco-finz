"use client";

import React, { useState } from "react";
import { useFixedExpenses, useCreateFixedExpense } from "../../hooks/useFixedExpenses";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface FixedExpenseSelectorProps {
  selectedExpenses: { name: string; amount: number }[];
  onChange: (expenses: { name: string; amount: number }[]) => void;
}

export function FixedExpenseSelector({ selectedExpenses, onChange }: FixedExpenseSelectorProps) {
  const { data: existingExpenses = [], isLoading } = useFixedExpenses();
  const createExpense = useCreateFixedExpense();

  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const selectedSet = new Set(selectedExpenses.map(i => `${i.name}|${i.amount}`));

  const handleToggle = (name: string, amount: number) => {
    const key = `${name}|${amount}`;
    if (selectedSet.has(key)) {
      onChange(selectedExpenses.filter(i => `${i.name}|${i.amount}` !== key));
    } else {
      onChange([...selectedExpenses, { name, amount }]);
    }
  };

  const handleCreateFixed = () => {
    if (!newName || !newAmount) return;
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) return;

    createExpense.mutate(
      { name: newName, amount },
      {
        onSuccess: () => {
          onChange([...selectedExpenses, { name: newName, amount }]);
          setNewName("");
          setNewAmount("");
        },
      }
    );
  };

  const totalSelected = selectedExpenses.reduce((s, i) => s + i.amount, 0);
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nombre del gasto"
          className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        <input
          type="number"
          value={newAmount}
          onChange={e => setNewAmount(e.target.value)}
          placeholder="Monto"
          className="w-32 px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        <button
          onClick={handleCreateFixed}
          disabled={!newName || !newAmount}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-400 py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando gastos fijos...
        </div>
      ) : (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {selectedExpenses.map((exp, idx) => (
            <div
              key={`sel-${idx}`}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200"
            >
              <span className="flex-1 text-sm font-medium text-zinc-700">{exp.name}</span>
              <span className="text-sm font-bold text-zinc-900">{formatCurrency(exp.amount)}</span>
              <button
                onClick={() => onChange(selectedExpenses.filter((_, i) => i !== idx))}
                className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {existingExpenses.filter(e => !selectedSet.has(`${e.name}|${e.amount}`)).map(exp => (
            <label
              key={exp.id}
              className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-zinc-50 border border-transparent transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedSet.has(`${exp.name}|${exp.amount}`)}
                onChange={() => handleToggle(exp.name, Number(exp.amount))}
                className="w-4 h-4 rounded border-zinc-300 text-rose-500 focus:ring-rose-500"
              />
              <span className="flex-1 text-sm font-medium text-zinc-700">{exp.name}</span>
              <span className="text-sm font-bold text-zinc-900">{formatCurrency(exp.amount)}</span>
            </label>
          ))}
          {existingExpenses.length === 0 && selectedExpenses.length === 0 && (
            <p className="text-sm text-zinc-400 py-2">No hay gastos fijos registrados. Crea uno arriba.</p>
          )}
        </div>
      )}

      <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-rose-50">
        <span className="text-sm font-bold text-rose-700">Total gastos fijos</span>
        <span className="text-sm font-bold text-rose-700">{formatCurrency(totalSelected)}</span>
      </div>
    </div>
  );
}
