"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCreateTransaction, useUpdateTransaction } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { useAccounts } from "../hooks/useAccounts";
import { useBudgets } from "../hooks/useBudgets";
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionType
} from "../types/finance";
import {
  Plus,
  Save,
  X,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Tag,
  Type,
  Wallet,
  PiggyBank,
  TrendingUp,
  Target,
  ArrowRightLeft
} from "lucide-react";

interface Props {
  accountId?: string;
  onTransactionCreated?: (newTransaction: Transaction) => void;
  onTransactionUpdated?: (updatedTransaction: Transaction) => void;
  initialData?: Transaction;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const TransactionForm: React.FC<Props> = ({
  accountId: propAccountId,
  onTransactionCreated,
  onTransactionUpdated,
  initialData,
  isEditMode = false,
  onCancel
}) => {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<TransactionType>("EGRESO");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(propAccountId || "");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [budgetId, setBudgetId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Derive month/year from date for budget fetching
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();
  const { data: budgets = [] } = useBudgets({ month, year });

  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();

  const isLoading = createTransactionMutation.isPending || updateTransactionMutation.isPending;
  const showAccountSelector = !propAccountId;

  // Filter budgets for selected category
  const availableBudgets = useMemo(() => {
    if (!categoryId) return [];
    return budgets.filter(b => b.categoryId === categoryId);
  }, [budgets, categoryId]);

  useEffect(() => {
    if (isEditMode && initialData) {
      setAmount(initialData.amount);
      setType(initialData.type);
      setDescription(initialData.description);
      setDate(initialData.date.split("T")[0]);
      setCategoryId(initialData.categoryId);
      setSelectedAccountId(initialData.accountId);
      setBudgetId(initialData.budgetId || "");
      // Note: handling destinationAccountId for edit is complex because we need to find the related transaction.
      // For now, we assume basic edit support without changing the link structure deeply, 
      // or we accept that 'destinationAccountId' might not be pre-filled unless we query it.
      // Given the complexity, simple edits might preserve existing links if untouched.
    } else {
      setAmount(0);
      setType("EGRESO");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategoryId("");
      // Don't reset selectedAccountId if passed via prop
      setDestinationAccountId("");
      setBudgetId("");
    }
  }, [isEditMode, initialData, propAccountId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!categoryId) {
      setError("Por favor, selecciona una categoría.");
      return;
    }

    const accountIdToUse = propAccountId || selectedAccountId;
    if (!accountIdToUse) {
      setError("Por favor, selecciona una cuenta origen.");
      return;
    }

    if (type === "AHORRO" && !destinationAccountId) {
      setError("Por favor, selecciona una cuenta destino para el ahorro.");
      return;
    }

    if (type === "AHORRO" && destinationAccountId === accountIdToUse) {
      setError("La cuenta destino no puede ser la misma que la origen.");
      return;
    }

    try {
      if (isEditMode && initialData) {
        const updateData: UpdateTransactionDto = {
          amount,
          type,
          description,
          date,
          accountId: accountIdToUse,
          categoryId,
          budgetId: budgetId || undefined,
          destinationAccountId: destinationAccountId || undefined,
        };
        const response = await updateTransactionMutation.mutateAsync({ id: initialData.id, data: updateData });
        if (onTransactionUpdated) onTransactionUpdated(response.data);
      } else {
        const newTransaction: CreateTransactionDto = {
          amount,
          type,
          description,
          date,
          accountId: accountIdToUse,
          categoryId,
          budgetId: budgetId || undefined,
          destinationAccountId: destinationAccountId || undefined,
        };
        const response = await createTransactionMutation.mutateAsync(newTransaction);
        if (onTransactionCreated) onTransactionCreated(response.data);

        // Reset form
        setAmount(0);
        setDescription("");
        setDestinationAccountId("");
        setBudgetId("");
      }
    } catch (err) {
      console.error("Failed to save transaction:", err);
      setError(`No se pudo ${isEditMode ? "actualizar" : "crear"} la transacción.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${isEditMode ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>
          {isEditMode ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
        <h2 className="text-xl font-semibold text-white">
          {isEditMode ? "Editar Movimiento" : "Nuevo Movimiento"}
        </h2>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 sm:grid-cols-4 p-1 bg-white/5 border border-white/10 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setType("INGRESO")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "INGRESO"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-neutral-500 hover:text-white hover:bg-white/5"
              }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            Ingreso
          </button>
          <button
            type="button"
            onClick={() => setType("EGRESO")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "EGRESO"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "text-neutral-500 hover:text-white hover:bg-white/5"
              }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            Egreso
          </button>
          <button
            type="button"
            onClick={() => setType("AHORRO")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "AHORRO"
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "text-neutral-500 hover:text-white hover:bg-white/5"
              }`}
          >
            <PiggyBank className="w-4 h-4" />
            Ahorro
          </button>
          <button
            type="button"
            onClick={() => setType("INVERSION")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "INVERSION"
              ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20"
              : "text-neutral-500 hover:text-white hover:bg-white/5"
              }`}
          >
            <TrendingUp className="w-4 h-4" />
            Inversión
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" /> Concepto
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej. Alquiler, Sueldo, Comida..."
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-inner"
          />
        </div>

        {/* Account Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {showAccountSelector && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400 ml-1 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> Cuenta Origen
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-neutral-900">Seleccionar cuenta</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id} className="bg-neutral-900">
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === 'AHORRO' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-medium text-blue-400 ml-1 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5" /> Cuenta Destino
              </label>
              <select
                value={destinationAccountId}
                onChange={(e) => setDestinationAccountId(e.target.value)}
                required={type === 'AHORRO'}
                className="w-full bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-neutral-900">Seleccionar destino</option>
                {accounts
                  .filter(acc => acc.id !== (propAccountId || selectedAccountId))
                  .map(acc => (
                    <option key={acc.id} value={acc.id} className="bg-neutral-900">
                      {acc.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-400 ml-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Categoría
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-neutral-900 text-neutral-500">¿Categoría?</option>
              {categories
                .filter(c => c.type === type)
                .map(c => (
                  <option key={c.id} value={c.id} className="bg-neutral-900">
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-400 ml-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Budget Selector */}
        {type === 'EGRESO' && categoryId && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-medium text-neutral-400 ml-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Presupuesto (Opcional)
            </label>
            <select
              value={budgetId}
              onChange={(e) => setBudgetId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-neutral-900">Sin presupuesto</option>
              {availableBudgets.map(b => (
                <option key={b.id} value={b.id} className="bg-neutral-900">
                  {b.name} (${b.amount})
                </option>
              ))}
            </select>
            {availableBudgets.length === 0 && (
              <p className="text-xs text-neutral-500 ml-1">No hay presupuestos para esta categoría.</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">Monto del Movimiento</label>
          <div className="relative group">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold transition-colors ${type === 'EGRESO' ? 'text-red-400'
              : type === 'INGRESO' ? 'text-emerald-400'
                : type === 'AHORRO' ? 'text-blue-400'
                  : 'text-violet-400'
              }`}>$</span>
            <input
              type="number"
              step="0.01"
              value={isNaN(amount) ? "" : amount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setAmount(isNaN(val) ? 0 : val);
              }}
              required
              className={`w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-2xl font-black text-white focus:outline-none focus:ring-2 transition-all ${type === 'EGRESO' ? 'focus:ring-red-500/50 focus:border-red-500/50'
                : type === 'INGRESO' ? 'focus:ring-emerald-500/50 focus:border-emerald-500/50'
                  : type === 'AHORRO' ? 'focus:ring-blue-500/50 focus:border-blue-500/50'
                    : 'focus:ring-violet-500/50 focus:border-violet-500/50'
                }`}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 backdrop-blur-md ${isLoading
              ? "bg-neutral-800/50 text-neutral-500 cursor-not-allowed"
              : isEditMode
                ? "bg-amber-500/80 hover:bg-amber-500 text-white border border-amber-400/20 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                : type === 'INGRESO'
                  ? "bg-emerald-500/80 hover:bg-emerald-500 text-white border border-emerald-400/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : type === 'AHORRO'
                    ? "bg-blue-500/80 hover:bg-blue-500 text-white border border-blue-400/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    : "bg-red-500/80 hover:bg-red-500 text-white border border-red-400/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : isEditMode ? (
              <>
                <Save className="w-5 h-5" />
                Actualizar
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Registrar
              </>
            )}
          </button>

          {isEditMode && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
