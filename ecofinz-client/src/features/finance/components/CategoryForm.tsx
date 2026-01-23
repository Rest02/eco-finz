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
  Type,
  ArrowUpCircle,
  ArrowDownCircle,
  LayoutGrid
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
        <div className={`p-2 rounded-lg ${isEditMode ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>
          {isEditMode ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
        <h2 className="text-xl font-semibold text-white">
          {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
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
            <LayoutGrid className="w-3.5 h-3.5" /> Nombre de la Categoría
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Alimentación, Salud, Sueldo..."
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-inner"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 backdrop-blur-md ${isSubmitting
                ? "bg-neutral-800/50 text-neutral-500 cursor-not-allowed"
                : isEditMode
                  ? "bg-amber-500/80 hover:bg-amber-500 text-white border border-amber-400/20 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : "bg-emerald-500/80 hover:bg-emerald-500 text-white border border-emerald-400/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
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

export default CategoryForm;
