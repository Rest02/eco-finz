"use client";

import React, { useState } from "react";
import CategoryList from "@/features/finance/components/CategoryList";
import CategoryForm from "@/features/finance/components/CategoryForm";
import { useCategories, useDeleteCategory } from "@/features/finance/hooks/useCategories";
import { Category } from "@/features/finance/types/finance";
import {
  Tag,
  Search,
  PlusCircle,
  Info,
  ArrowUpRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";

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
    <motion.div
      className="p-4 lg:p-10 space-y-8 min-h-full animate-fade-in"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-500 font-bold">
              <Tag className="w-5 h-5" />
              <span className="text-xs tracking-widest uppercase">Organización</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              Categorías
            </h1>
            <p className="text-zinc-500 text-sm font-medium tracking-wide">
              Gestiona tus tipos de ingresos y gastos
            </p>
          </div>

          <div className="relative group max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 w-full transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Stats Summary Widget (Redesigned to match Account Page) */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="group relative bg-white border border-zinc-200 p-6 rounded-2xl min-w-[180px] overflow-hidden transition-all duration-300 hover:shadow-md">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 relative z-10">Ingresos</p>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-3xl font-bold text-black tracking-tight">
                {incomeCount}
              </span>
              <span className="text-xs font-bold text-zinc-400 uppercase">Tipos</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] mt-3 font-bold tracking-widest uppercase relative z-10">
              <TrendingUp className="w-3 h-3" />
              Activos
            </div>
            <div className="absolute top-0 right-0 p-12 bg-emerald-50 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          <div className="group relative bg-white border border-zinc-200 p-6 rounded-2xl min-w-[180px] overflow-hidden transition-all duration-300 hover:shadow-md">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 relative z-10">Egresos</p>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-3xl font-bold text-black tracking-tight">
                {expenseCount}
              </span>
              <span className="text-xs font-bold text-zinc-400 uppercase">Tipos</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-600 text-[10px] mt-3 font-bold tracking-widest uppercase relative z-10">
              <TrendingDown className="w-3 h-3" />
              Activos
            </div>
            <div className="absolute top-0 right-0 p-12 bg-rose-50 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

        {/* List Section */}
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-6 order-2 xl:order-1">
          {categoriesLoading ? (
            <div className="p-20 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-zinc-400 font-medium animate-pulse">Cargando categorías...</p>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-[2rem] shadow-sm">
              <CategoryList
                categories={filteredCategories}
                onCategoryEdit={handleEdit}
                onCategoryDeleted={handleDelete}
              />

              {categories.length > 0 && (
                <div className="mt-8 p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-400 shadow-sm">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-black uppercase tracking-wider">Acerca de las categorías</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Las categorías te permiten clasificar tus movimientos para obtener reportes detallados.
                      Puedes crear tantas como necesites, pero te recomendamos mantenerlas simples y claras.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Form Sidebar Section */}
        <motion.div variants={itemVariants} className="xl:sticky xl:top-8 order-1 xl:order-2">
          <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-lg shadow-zinc-200/50">
            <div className="flex items-center gap-3 mb-6 text-zinc-400">
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

          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-transparent border border-emerald-100/50">
            <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-black mb-1">Estructura</p>
            <p className="text-xs text-emerald-800/60 leading-relaxed">
              Una buena categorización es la base de una salud financiera sólida. <b>¡Organiza tus gastos inteligentemente!</b>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
