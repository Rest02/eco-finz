"use client";

import React, { useState, useEffect } from "react";
import { useCreateBudget, useUpdateBudget } from "../hooks/useBudgets";
import { useCategories } from "../hooks/useCategories";
import { Budget, CreateBudgetDto, UpdateBudgetDto } from "../types/finance";
import {
  Plus,
  Save,
  X,
  Info,
  AlertCircle,
  Target,
  DollarSign,
  Tag,
  Calendar
} from "lucide-react";

interface Props {
  month: number;
  year: number;
  onBudgetCreated?: (newBudget: Budget) => void;
  onBudgetUpdated?: (updatedBudget: Budget) => void;
  initialBudget?: Budget;
  isEditMode?: boolean;
  onCancelEdit?: () => void;
}

const BudgetForm: React.FC<Props> = ({
  month,
  year,
  onBudgetCreated,
  onBudgetUpdated,
  initialBudget,
  isEditMode = false,
  onCancelEdit,
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: allCategories = [] } = useCategories();
  const categories = allCategories.filter(cat => cat.type === "EGRESO");

  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();

  const isLoading = createBudgetMutation.isPending || updateBudgetMutation.isPending;

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  useEffect(() => {
    if (initialBudget && isEditMode) {
      setName(initialBudget.name);
      setAmount(parseFloat(String(initialBudget.amount)));
      setCategoryId(initialBudget.categoryId);
    } else {
      setName("");
      setAmount(0);
      if (categories.length > 0) setCategoryId(categories[0].id);
    }
  }, [initialBudget, isEditMode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!categoryId) {
      setError("Debes seleccionar una categoría de egreso.");
      return;
    }

    try {
      if (isEditMode && initialBudget) {
        const updateData: UpdateBudgetDto = { name, amount, categoryId };
        const response = await updateBudgetMutation.mutateAsync({ id: initialBudget.id, data: updateData });
        if (onBudgetUpdated) onBudgetUpdated(response.data);
      } else {
        const newBudget: CreateBudgetDto = {
          name,
          amount,
          month,
          year,
          categoryId,
        };
        const response = await createBudgetMutation.mutateAsync(newBudget);
        if (onBudgetCreated) onBudgetCreated(response.data);
        setName("");
        setAmount(0);
      }
    } catch (err) {
      console.error("Failed to save budget:", err);
      setError("No se pudo guardar el presupuesto.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${isEditMode ? "bg-amber-500/10 text-amber-400" : "bg-indigo-500/10 text-indigo-400"}`}>
          {isEditMode ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? "Editar Presupuesto" : "Nuevo Presupuesto"}
          </h2>
          <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
            <Calendar className="w-3 h-3" />
            {`${month.toString().padStart(2, '0')} / ${year}`}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> Nombre del Presupuesto
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Comida del mes, Transporte, Gimnasio..."
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-inner"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Categoría Relacionada
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
          >
            {categories.length === 0 ? (
              <option value="" className="bg-neutral-900">No hay categorías de egreso</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-neutral-900">
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">Límite de Gasto</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-indigo-400">$</span>
            <input
              type="number"
              step="0.01"
              value={isNaN(amount) ? "" : amount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setAmount(isNaN(val) ? 0 : val);
              }}
              required
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || categories.length === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 backdrop-blur-md ${isLoading
                ? "bg-neutral-800/50 text-neutral-500 cursor-not-allowed"
                : isEditMode
                  ? "bg-amber-500/80 hover:bg-amber-500 text-white border border-amber-400/20 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : "bg-indigo-500/80 hover:bg-indigo-500 text-white border border-indigo-400/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
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
                Fijar Presupuesto
              </>
            )}
          </button>

          {isEditMode && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-6 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {categories.length === 0 && (
          <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Necesitas crear categorías de tipo <b>EGRESO</b> antes de poder configurar un presupuesto.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default BudgetForm;
