"use client";

import React, { useState, useMemo } from "react";
import { Category, Transaction } from "../types/finance";
import { useTransactions } from "../hooks/useTransactions";
import {
  Pencil,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronDown,
  ChevronUp,
  History,
  Tag
} from "lucide-react";

interface Props {
  categories: Category[];
  onCategoryDeleted: (categoryId: string) => void;
  onCategoryEdit: (category: Category) => void;
}

const CategoryList: React.FC<Props> = ({ categories, onCategoryDeleted, onCategoryEdit }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const { data: transactionsData } = useTransactions();
  const allTransactions = transactionsData?.data || [];

  const transactionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      counts[cat.id] = allTransactions.filter((t: Transaction) => t.categoryId === cat.id).length;
    });
    return counts;
  }, [categories, allTransactions]);

  const categoryTransactions = useMemo(() => {
    if (!expandedCategory) return [];
    return allTransactions.filter((t: Transaction) => t.categoryId === expandedCategory);
  }, [expandedCategory, allTransactions]);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleDelete = (categoryId: string) => {
    const count = transactionCounts[categoryId] || 0;
    if (count > 0) {
      if (!window.confirm(
        `Esta categoría tiene ${count} transacciones asociadas. Si la eliminas, las transacciones quedarán huérfanas.\n\n¿Deseas continuar?`
      )) return;
    } else {
      if (!window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return;
    }
    onCategoryDeleted(categoryId);
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-50 border border-zinc-200 rounded-3xl">
        <Tag className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <p className="text-zinc-500 text-lg">No has creado categorías todavía.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-black tracking-tight">Mis Categorías</h2>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500">
          {categories.length} total
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const count = transactionCounts[category.id] || 0;
          const isExpanded = expandedCategory === category.id;

          return (
            <div
              key={category.id}
              className={`group relative bg-white border transition-all duration-300 overflow-hidden rounded-2xl
                ${isExpanded ? "border-emerald-500 shadow-md ring-1 ring-emerald-500/10" : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm"}
              `}
            >
              {/* Options */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <button
                  onClick={() => onCategoryEdit(category)}
                  className="p-1.5 rounded-lg hover:bg-amber-50 text-zinc-400 hover:text-amber-600 transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                {/* Icon & Label */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${category.type === 'INGRESO'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                    }`}>
                    {category.type === 'INGRESO' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                  </div>

                  <div className="flex-1 min-w-0 pr-12">
                    <h3 className="font-bold text-black text-sm truncate">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${category.type === 'INGRESO' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                        {category.type === 'INGRESO' ? 'Entrada' : 'Salida'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats & Expand */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 mt-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <History className="w-3.5 h-3.5" />
                    {count} {count === 1 ? 'Movimiento' : 'Movimientos'}
                  </div>

                  {count > 0 && (
                    <button
                      onClick={() => toggleExpand(category.id)}
                      className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-zinc-50 hover:bg-zinc-100 text-zinc-500 border border-zinc-200 text-[10px] font-bold uppercase tracking-wide transition-colors"
                    >
                      {isExpanded ? 'Ocultar' : 'Ver'}
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-zinc-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Actividad Reciente
                    </div>
                    <div className="space-y-1.5">
                      {categoryTransactions.slice(0, 5).map(tx => (
                        <div key={tx.id} className="flex justify-between items-center bg-zinc-50/50 p-2 rounded-lg border border-zinc-100">
                          <span className="text-xs text-zinc-700 truncate pr-4">{tx.description}</span>
                          <span className={`text-xs font-bold shrink-0 ${category.type === 'INGRESO' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ${tx.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    {count > 5 && (
                      <p className="text-[10px] text-center text-zinc-400 font-medium">
                        + {count - 5} movimientos más
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;

