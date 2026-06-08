"use client";

import React, { useState } from "react";
import { useAccounts } from "../../hooks/useAccounts";
import { useTransactions } from "../../hooks/useTransactions";
import { Loader2, Search } from "lucide-react";

interface IncomeSelectorProps {
  selectedIncomes: { name: string; amount: number }[];
  onChange: (incomes: { name: string; amount: number }[]) => void;
}

export function IncomeSelector({ selectedIncomes, onChange }: IncomeSelectorProps) {
  const { data: accounts = [] } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [queryEnabled, setQueryEnabled] = useState(false);

  const incomeAccounts = accounts.filter(a => a.type === "BANCO" || a.type === "BILLETERA_DIGITAL");

  const { data: transactionsData, isLoading } = useTransactions(
    selectedAccountId && startDate && endDate
      ? {
          accountId: selectedAccountId,
          type: "INGRESO" as const,
          startDate,
          endDate,
          limit: 100,
          page: 1,
        }
      : undefined
  );

  const transactions = queryEnabled ? (transactionsData?.data || []) : [];
  const selectedSet = new Set(selectedIncomes.map(i => `${i.name}|${i.amount}`));

  const handleToggle = (name: string, amount: number) => {
    const key = `${name}|${amount}`;
    if (selectedSet.has(key)) {
      onChange(selectedIncomes.filter(i => `${i.name}|${i.amount}` !== key));
    } else {
      onChange([...selectedIncomes, { name, amount }]);
    }
  };

  const handleSearch = () => {
    if (selectedAccountId && startDate && endDate) {
      setQueryEnabled(true);
    }
  };

  const totalSelected = selectedIncomes.reduce((s, i) => s + i.amount, 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <select
          value={selectedAccountId}
          onChange={e => { setSelectedAccountId(e.target.value); setQueryEnabled(false); }}
          className="col-span-1 px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="">Seleccionar cuenta</option>
          {incomeAccounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        <button
          onClick={handleSearch}
          disabled={!selectedAccountId || !startDate || !endDate}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      </div>

      {isLoading && queryEnabled && (
        <div className="flex items-center gap-2 text-sm text-zinc-400 py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando ingresos...
        </div>
      )}

      {!isLoading && transactions.length > 0 && (
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {transactions.map(tx => {
            const key = `${tx.description}|${tx.amount}`;
            const checked = selectedSet.has(key);
            return (
              <label
                key={tx.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                  checked ? "bg-emerald-50 border border-emerald-200" : "hover:bg-zinc-50 border border-transparent"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggle(tx.description, Number(tx.amount))}
                  className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="flex-1 text-sm font-medium text-zinc-700">{tx.description}</span>
                <span className="text-sm font-bold text-zinc-900">{formatCurrency(tx.amount)}</span>
              </label>
            );
          })}
        </div>
      )}

      {!isLoading && queryEnabled && transactions.length === 0 && (
        <p className="text-sm text-zinc-400 py-2">No se encontraron ingresos en el período seleccionado.</p>
      )}

      <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-emerald-50">
        <span className="text-sm font-bold text-emerald-700">Total ingresos seleccionados</span>
        <span className="text-sm font-bold text-emerald-700">{formatCurrency(totalSelected)}</span>
      </div>
    </div>
  );
}
