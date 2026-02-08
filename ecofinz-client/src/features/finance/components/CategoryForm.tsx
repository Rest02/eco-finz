"use client";

import React, { useState, useEffect } from "react";
import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  TransactionType,
  Category
} from "../types/finance";
import {
  Plus,
  Save,
  X,
  AlertCircle,
  Tag,
  ArrowUpCircle,
  ArrowDownCircle,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

interface Props {
  onCategoryCreated?: (newCategory: Category) => void;
  onCategoryUpdated?: (updatedCategory: Category) => void;
  initialData?: Category;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const CategoryForm: React.FC<Props> = ({
  onCategoryCreated,
  onCategoryUpdated,
  initialData,
  isEditMode = false,
  onCancel
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("EGRESO");
  const [error, setError] = useState<string | null>(null);

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const isSubmitting = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name);
      setType(initialData.type);
    } else {
      setName("");
      setType("EGRESO");
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      if (isEditMode && initialData) {
        const updateData: UpdateCategoryDto = { name, type };
        const response = await updateCategoryMutation.mutateAsync({ id: initialData.id, data: updateData });
        if (onCategoryUpdated) onCategoryUpdated(response.data);
      } else {
        const newCategory: CreateCategoryDto = { name, type };
        const response = await createCategoryMutation.mutateAsync(newCategory);
        if (onCategoryCreated) onCategoryCreated(response.data);
        setName("");
      }
    } catch (err) {
      console.error("Failed to save category:", err);
      setError(`No se pudo ${isEditMode ? "actualizar" : "crear"} la categoría.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${isEditMode ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
          {isEditMode ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
        <h2 className="text-xl font-bold text-black tracking-tight">
          {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
        </h2>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 sm:grid-cols-4 p-1.5 bg-zinc-100/50 border border-zinc-200 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setType("INGRESO")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "INGRESO"
              ? "bg-white text-emerald-600 shadow-sm border border-zinc-200 ring-1 ring-black/5"
              : "text-zinc-500 hover:text-zinc-900 hover:bg-white/50"
              }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            Ingreso
          </button>
          <button
            type="button"
            onClick={() => setType("EGRESO")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "EGRESO"
              ? "bg-white text-rose-600 shadow-sm border border-zinc-200 ring-1 ring-black/5"
              : "text-zinc-500 hover:text-zinc-900 hover:bg-white/50"
              }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            Egreso
          </button>
          <button
            type="button"
            onClick={() => setType("AHORRO")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "AHORRO"
              ? "bg-white text-blue-600 shadow-sm border border-zinc-200 ring-1 ring-black/5"
              : "text-zinc-500 hover:text-zinc-900 hover:bg-white/50"
              }`}
          >
            <PiggyBank className="w-4 h-4" />
            Ahorro
          </button>
          <button
            type="button"
            onClick={() => setType("INVERSION")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === "INVERSION"
              ? "bg-white text-violet-600 shadow-sm border border-zinc-200 ring-1 ring-black/5"
              : "text-zinc-500 hover:text-zinc-900 hover:bg-white/50"
              }`}
          >
            <TrendingUp className="w-4 h-4" />
            Inversión
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700 ml-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Nombre de la Categoría
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Alimentación, Salud, Sueldo..."
            required
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all shadow-sm"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 ${isSubmitting
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : isEditMode
                ? "bg-black text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10"
                : "bg-black text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10"
              }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : isEditMode ? (
              <>
                <Save className="w-5 h-5" />
                Actualizar
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Crear Categoría
              </>
            )}
          </button>

          {isEditMode && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-black transition-all font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
