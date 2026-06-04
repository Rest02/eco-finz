"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface CardPaymentInputProps {
  payments: { name: string; amount: number }[];
  onChange: (payments: { name: string; amount: number }[]) => void;
}

export function CardPaymentInput({ payments, onChange }: CardPaymentInputProps) {
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const handleAdd = () => {
    if (!newName || !newAmount) return;
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) return;

    onChange([...payments, { name: newName, amount }]);
    setNewName("");
    setNewAmount("");
  };

  const handleRemove = (idx: number) => {
    onChange(payments.filter((_, i) => i !== idx));
  };

  const totalPayments = payments.reduce((s, i) => s + i.amount, 0);
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nombre tarjeta"
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
          onClick={handleAdd}
          disabled={!newName || !newAmount}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {payments.length > 0 && (
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {payments.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200"
            >
              <span className="flex-1 text-sm font-medium text-zinc-700">{p.name}</span>
              <span className="text-sm font-bold text-zinc-900">{formatCurrency(p.amount)}</span>
              <button
                onClick={() => handleRemove(idx)}
                className="p-1 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-blue-50">
        <span className="text-sm font-bold text-blue-700">Total pagos tarjetas</span>
        <span className="text-sm font-bold text-blue-700">{formatCurrency(totalPayments)}</span>
      </div>
    </div>
  );
}
