"use client";

import React, { useState, useEffect } from "react";
import { useCreateTransaction, useUpdateTransaction } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { useAccounts } from "../hooks/useAccounts";
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
  Info,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Tag,
  Type,
  Wallet
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
  const [error, setError] = useState<string | null>(null);

  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();

  const isLoading = createTransactionMutation.isPending || updateTransactionMutation.isPending;
  const showAccountSelector = !propAccountId;

  useEffect(() => {
    if (isEditMode && initialData) {
      setAmount(initialData.amount);
      setType(initialData.type);
      setDescription(initialData.description);
      setDate(initialData.date.split("T")[0]);
      setCategoryId(initialData.categoryId);
      setSelectedAccountId(initialData.accountId);
    } else {
      setAmount(0);
      setType("EGRESO");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategoryId("");
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!categoryId) {
      setError("Por favor, selecciona una categoría.");
      return;
    }

    const accountIdToUse = propAccountId || selectedAccountId;
    if (!accountIdToUse) {
      setError("Por favor, selecciona una cuenta.");
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
        };
        const response = await createTransactionMutation.mutateAsync(newTransaction);
        if (onTransactionCreated) onTransactionCreated(response.data);
        setAmount(0);
        setDescription("");
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
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setType("EGRESO")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "EGRESO"
                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                : "text-neutral-500 hover:text-white hover:bg-white/5"
              }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            Egreso
          </button>
          <button
            type="button"
            onClick={() => setType("INGRESO")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "INGRESO"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "text-neutral-500 hover:text-white hover:bg-white/5"
              }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            Ingreso
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

        {showAccountSelector && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-400 ml-1 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" /> Cuenta
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
              {categories.map(c => (
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">Monto del Movimiento</label>
          <div className="relative group">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold transition-colors ${type === 'EGRESO' ? 'text-red-400' : 'text-emerald-400'
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
              className={`w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-2xl font-black text-white focus:outline-none focus:ring-2 transition-all ${type === 'EGRESO' ? 'focus:ring-red-500/50 focus:border-red-500/50' : 'focus:ring-emerald-500/50 focus:border-emerald-500/50'
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
