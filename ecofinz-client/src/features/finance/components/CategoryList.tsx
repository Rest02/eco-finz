"use client";

import React, { useState, useMemo } from "react";
import { Category, Transaction } from "../types/finance";
import { useTransactions } from "../hooks/useTransactions";
import {
  LayoutGrid,
  Pencil,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  History
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
      <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
        <LayoutGrid className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
        <p className="text-neutral-500 text-lg">No has creado categorías todavía.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-white/90">Mis Categorías</h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400">
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
              className={`group relative glass-card glass-card-hover rounded-3xl p-6 transition-all duration-300 overflow-hidden ${isExpanded ? "ring-1 ring-emerald-500/30" : ""
                }`}
            >
              {/* Options */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => onCategoryEdit(category)}
                  className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-amber-400 transition-all"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Icon & Label */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${category.type === 'INGRESO'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                  {category.type === 'INGRESO' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                </div>

                <div className="flex-1 min-w-0 pr-12">
                  <h3 className="font-semibold text-white uppercase tracking-wider text-sm truncate">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${category.type === 'INGRESO' ? 'text-emerald-500/60' : 'text-red-500/60'
                      }`}>
                      {category.type === 'INGRESO' ? 'Entrada' : 'Salida'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats & Expand */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">
                  <History className="w-3.5 h-3.5" />
                  {count} {count === 1 ? 'Movimiento' : 'Movimientos'}
                </div>

                {count > 0 && (
                  <button
                    onClick={() => toggleExpand(category.id)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5 text-[9px] font-bold uppercase tracking-tighter transition-all"
                  >
                    {isExpanded ? 'Ocultar' : 'Ver Detalles'}
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                    <History className="w-3 h-3" /> Actividad Reciente
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {categoryTransactions.slice(0, 5).map(tx => (
                      <div key={tx.id} className="flex justify-between items-center bg-white/[0.02] p-2 rounded-lg border border-white/5">
                        <span className="text-[11px] text-white/80 truncate pr-4">{tx.description}</span>
                        <span className="text-[11px] font-bold text-neutral-500 shrink-0">
                          ${tx.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  {count > 5 && (
                    <p className="text-[9px] text-center text-neutral-600 uppercase font-bold">
                      + {count - 5} movimientos más
                    </p>
                  )}
                </div>
              )}

              {/* Glow effect */}
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 blur-[40px] rounded-full transition-colors opacity-20 group-hover:opacity-40 ${category.type === 'INGRESO' ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
