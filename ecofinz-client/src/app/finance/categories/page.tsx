"use client";

import React, { useState } from "react";
import CategoryList from "@/features/finance/components/CategoryList";
import CategoryForm from "@/features/finance/components/CategoryForm";
import { useCategories, useDeleteCategory } from "@/features/finance/hooks/useCategories";
import { Category } from "@/features/finance/types/finance";
import {
  LayoutGrid,
  Tag,
  Search,
  PlusCircle,
  Info,
  PieChart,
  ChevronDown
} from "lucide-react";

export default function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const deleteCategoryMutation = useDeleteCategory();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleDelete = async (categoryId: string) => {
    await deleteCategoryMutation.mutateAsync(categoryId);
    if (editingCategory?.id === categoryId) setEditingCategory(null);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const incomeCount = categories.filter(c => c.type === 'INGRESO').length;
  const expenseCount = categories.filter(c => c.type === 'EGRESO').length;

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2.5rem] backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <Tag className="w-5 h-5" />
            <span className="text-sm tracking-widest uppercase">Organización</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 tracking-tight">
            Categorías
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 min-w-[200px] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Stats Summary Widget */}
        <div className="flex items-center gap-4">
          <div className="glass-card p-4 rounded-3xl border border-white/5 min-w-[140px]">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Ingresos</p>
            <div className="text-2xl font-black text-emerald-400 tracking-tighter">
              {incomeCount}
            </div>
          </div>
          <div className="glass-card p-4 rounded-3xl border border-white/5 min-w-[140px]">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Egresos</p>
            <div className="text-2xl font-black text-red-400 tracking-tighter">
              {expenseCount}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

        {/* List Section */}
        <div className="xl:col-span-2 space-y-6 order-2 xl:order-1">
          {categoriesLoading ? (
            <div className="glass-card p-20 rounded-[2rem] border border-white/5 bg-white/[0.02] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-neutral-500 font-medium animate-pulse">Cargando categorías...</p>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <CategoryList
                categories={filteredCategories}
                onCategoryEdit={handleEdit}
                onCategoryDeleted={handleDelete}
              />

              {categories.length > 0 && (
                <div className="mt-12 p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Acerca de las categorías</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Las categorías te permiten clasificar tus movimientos para obtener reportes detallados.
                      Puedes crear tantas como necesites, pero te recomendamos mantenerlas simples y claras.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Sidebar Section */}
        <div className="xl:sticky xl:top-8 order-1 xl:order-2">
          <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.03] shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 text-neutral-400">
              <PlusCircle className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Gestión</span>
            </div>

            <CategoryForm
              isEditMode={!!editingCategory}
              initialData={editingCategory || undefined}
              onCancel={handleCancelEdit}
              onCategoryUpdated={() => setEditingCategory(null)}
              onCategoryCreated={() => { }}
            />
          </div>

          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-white/5">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black mb-1">Estructura</p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Una buena categorización es la base de una salud financiera sólida. <b>¡Organiza tus gastos inteligentemente!</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
