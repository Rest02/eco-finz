"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCreateTransaction, useUpdateTransaction } from "../hooks/useTransactions";
import { useCreateProjection } from "../hooks/useProjections";
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
  isCreditCard?: boolean;
  onTransactionCreated?: (newTransaction: Transaction) => void;
  onTransactionUpdated?: (updatedTransaction: Transaction) => void;
  initialData?: Transaction;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const TransactionForm: React.FC<Props> = ({
  accountId: propAccountId,
  isCreditCard = false,
  onTransactionCreated,
  onTransactionUpdated,
  initialData,
  isEditMode = false,
  onCancel
}) => {
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<TransactionType>("EGRESO");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(propAccountId || "");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [budgetId, setBudgetId] = useState("");
  const PRESET_INSTALLMENTS = [1, 3, 6, 12, 18, 24] as const;
  const [installments, setInstallments] = useState<number>(1);
  const [isCustomInstallments, setIsCustomInstallments] = useState(false);
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
  const createProjectionMutation = useCreateProjection();

  const isLoading = createTransactionMutation.isPending || updateTransactionMutation.isPending || createProjectionMutation.isPending;
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
      
      // Parse and remove installment suffix for editing
      if (initialData.description.includes(" | cuotas: ")) {
        const parts = initialData.description.split(" | cuotas: ");
        setDescription(parts[0].trim());
        const count = parseInt(parts[1]);
        if (!isNaN(count)) {
          setInstallments(count);
          if (!(PRESET_INSTALLMENTS as readonly number[]).includes(count)) {
            setIsCustomInstallments(true);
          }
        }
      } else {
        setDescription(initialData.description);
        setInstallments(1);
      }

      setDate(initialData.date.split("T")[0]);
      setCategoryId(initialData.categoryId);
      setSelectedAccountId(initialData.accountId);
      setBudgetId(initialData.budgetId || "");
    } else {
      setAmount("");
      setType("EGRESO");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategoryId("");
      // Don't reset selectedAccountId if passed via prop
      setDestinationAccountId("");
      setBudgetId("");
    }
  }, [isEditMode, initialData, propAccountId]);

  useEffect(() => {
    if (isCreditCard) {
      setType("EGRESO");
    }
  }, [isCreditCard]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!amount || Number(amount) <= 0) {
      setError("Por favor, ingresa un monto válido mayor a 0.");
      return;
    }

    if (!categoryId) {
      setError("Por favor, selecciona una categoría.");
      return;
    }

    const accountIdToUse = propAccountId || selectedAccountId;
    if (!accountIdToUse) {
      setError("Por favor, selecciona una cuenta origen.");
      return;
    }

    if (type === "AHORRO" && destinationAccountId && destinationAccountId === accountIdToUse) {
      setError("La cuenta destino no puede ser la misma que la origen.");
      return;
    }

    if (isCreditCard && installments < 1) {
      setError("El número de cuotas debe ser al menos 1.");
      return;
    }

    try {
      if (isEditMode && initialData) {
        let finalDescription = description;
        
        // Re-append installment count if valid credit card context
        if (isCreditCard && installments > 1) {
          finalDescription = `${description} | cuotas: ${installments}`;
        }

        const updateData: UpdateTransactionDto = {
          amount: Number(amount),
          type,
          description: finalDescription,
          date,
          accountId: accountIdToUse,
          categoryId,
          budgetId: budgetId || undefined,
          destinationAccountId: destinationAccountId || undefined,
        };
        const response = await updateTransactionMutation.mutateAsync({ id: initialData.id, data: updateData });
        if (onTransactionUpdated) onTransactionUpdated(response.data);
      } else {
        if (isCreditCard && installments > 1) {
          const selectedDate = new Date(date);
          // IMPORTANT: Date strings "YYYY-MM-DD" parsed with `new Date(string)` are UTC midnight.
          // We should make sure to get the day component in local time, or adjust correctly.
          // To make it simple and consistent with the rest of the code, we use the actual numeric components of the string.
          const [y, m, d] = date.split("-").map(Number);
          
          let effectiveMonth = m; // 1-12
          let effectiveYear = y;
          
          // Fetch the account details to get its closing day
          const selectedAccount = accounts.find(acc => acc.id === accountIdToUse);
          const cardClosingDay = Number(selectedAccount?.closingDay || 15);

          // If day of transaction is greater than closing day, shift to the next cycle
          if (d > cardClosingDay) {
            effectiveMonth += 1;
            if (effectiveMonth > 12) {
              effectiveMonth = 1;
              effectiveYear += 1;
            }
          }

          await createProjectionMutation.mutateAsync({
            description,
            amount: Number(amount),
            installments,
            startMonth: effectiveMonth,
            startYear: effectiveYear,
            accountId: accountIdToUse,
            categoryId,
            isSimulation: false, // This is a REAL movement in installments!
          });

          const newTransaction: CreateTransactionDto = {
            amount: Number(amount),
            type,
            description: `${description} | cuotas: ${installments}`,
            date,
            accountId: accountIdToUse,
            categoryId,
            budgetId: budgetId || undefined,
            destinationAccountId: destinationAccountId || undefined,
          };
          const response = await createTransactionMutation.mutateAsync(newTransaction);
          if (onTransactionCreated) onTransactionCreated(response.data);
        } else {
          const newTransaction: CreateTransactionDto = {
            amount: Number(amount),
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
        }

        // Reset form
        setAmount("");
        setDescription("");
        setDestinationAccountId("");
        setBudgetId("");
        setInstallments(1);
      }
    } catch (err) {
      console.error("Failed to save transaction:", err);
      setError(`No se pudo ${isEditMode ? "actualizar" : "crear"} la transacción.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${isEditMode ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
          {isEditMode ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
        <h2 className="text-xl font-semibold text-black">
          {isEditMode 
            ? (isCreditCard ? "Editar Movimiento - Egreso" : "Editar Movimiento") 
            : (isCreditCard ? "Nuevo Movimiento - Egreso" : "Nuevo Movimiento")
          }
        </h2>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle */}
        {!isCreditCard && (
          <div className="grid grid-cols-2 p-1 bg-zinc-100 border border-zinc-200 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setType("INGRESO")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "INGRESO"
                ? "bg-white text-emerald-600 shadow-sm border border-black/5"
                : "text-zinc-500 hover:text-black hover:bg-black/5"
                }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              Ingreso
            </button>
            <button
              type="button"
              onClick={() => setType("EGRESO")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "EGRESO"
                ? "bg-white text-red-600 shadow-sm border border-black/5"
                : "text-zinc-500 hover:text-black hover:bg-black/5"
                }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              Egreso
            </button>
            <button
              type="button"
              onClick={() => setType("AHORRO")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "AHORRO"
                ? "bg-white text-blue-600 shadow-sm border border-black/5"
                : "text-zinc-500 hover:text-black hover:bg-black/5"
                }`}
            >
              <PiggyBank className="w-4 h-4" />
              Ahorro
            </button>
            <button
              type="button"
              onClick={() => setType("INVERSION")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "INVERSION"
                ? "bg-white text-violet-600 shadow-sm border border-black/5"
                : "text-zinc-500 hover:text-black hover:bg-black/5"
                }`}
            >
              <TrendingUp className="w-4 h-4" />
              Inversión
            </button>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 ml-1 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" /> Concepto
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej. Alquiler, Sueldo, Comida..."
            required
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base md:text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>

        {/* Account Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {showAccountSelector && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-500 ml-1 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> Cuenta Origen
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                required
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base md:text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="text-zinc-400">Seleccionar cuenta</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === 'AHORRO' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-medium text-blue-500 ml-1 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5" /> Cuenta Destino <span className="text-[10px] text-blue-300 font-normal">(Opcional)</span>
              </label>
              <select
                value={destinationAccountId}
                onChange={(e) => setDestinationAccountId(e.target.value)}
                className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-base md:text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="text-zinc-400">Seleccionar destino</option>
                {accounts
                  .filter(acc => acc.id !== (propAccountId || selectedAccountId))
                  .map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500 ml-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Categoría
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base md:text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="text-zinc-400">¿Categoría?</option>
              {categories
                .filter(c => c.type === type)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500 ml-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full max-w-full min-w-0 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base md:text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Budget Selector */}
        {type === 'EGRESO' && categoryId && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-medium text-zinc-500 ml-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Presupuesto (Opcional)
            </label>
            <select
              value={budgetId}
              onChange={(e) => setBudgetId(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base md:text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">Sin presupuesto</option>
              {availableBudgets.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} (${b.amount})
                </option>
              ))}
            </select>
            {availableBudgets.length === 0 && (
              <p className="text-xs text-zinc-400 ml-1">No hay presupuestos para esta categoría.</p>
            )}
          </div>
        )}

        {isCreditCard && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-medium text-zinc-500 ml-1 flex items-center gap-1.5">
              Plan de Cuotas
            </label>
            {isCustomInstallments ? (
              <div className="space-y-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value) || 1)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base md:text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => { setIsCustomInstallments(false); setInstallments(1); }}
                  className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  ← Volver a valores fijos
                </button>
              </div>
            ) : (
              <select
                value={installments}
                onChange={(e) => {
                  if (e.target.value === "other") {
                    setIsCustomInstallments(true);
                  } else {
                    setInstallments(parseInt(e.target.value));
                  }
                }}
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base md:text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="1">1 pago / Sin cuotas</option>
                <option value="3">3 cuotas</option>
                <option value="6">6 cuotas</option>
                <option value="12">12 cuotas</option>
                <option value="18">18 cuotas</option>
                <option value="24">24 cuotas</option>
                <option value="other" className="border-t border-zinc-200">Otra cantidad...</option>
              </select>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 ml-1">Monto del Movimiento</label>
          <div className="relative group">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold transition-colors ${type === 'EGRESO' ? 'text-red-500'
              : type === 'INGRESO' ? 'text-emerald-500'
                : type === 'AHORRO' ? 'text-blue-500'
                  : 'text-violet-500'
              }`}>$</span>
            <input
              type="number"
              step="0.01"
              value={amount === 0 ? "" : amount}
              onChange={(e) => {
                const val = e.target.value;
                setAmount(val === "" ? "" : parseFloat(val));
              }}
              required
              className={`w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-4 text-2xl font-black text-black focus:outline-none focus:ring-2 transition-all shadow-sm ${type === 'EGRESO' ? 'focus:ring-red-500/20 focus:border-red-500'
                : type === 'INGRESO' ? 'focus:ring-emerald-500/20 focus:border-emerald-500'
                  : type === 'AHORRO' ? 'focus:ring-blue-500/20 focus:border-blue-500'
                    : 'focus:ring-violet-500/20 focus:border-violet-500'
                }`}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-lg hover:shadow-xl ${isLoading
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
              : isEditMode
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                : type === 'INGRESO'
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                  : type === 'AHORRO'
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"
                    : "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
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
              className="px-6 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-black hover:bg-zinc-50 transition-all font-medium"
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
