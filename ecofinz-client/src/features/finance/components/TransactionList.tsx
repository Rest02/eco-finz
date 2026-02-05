"use client";

import React from "react";
import { Transaction } from "../types/finance";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Pencil,
  Trash2,
  Clock,
  Tag,
  Calendar,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

interface Props {
  transactions: Transaction[];
  onDelete: (transactionId: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionList: React.FC<Props> = ({ transactions, onDelete, onEdit }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-50 border border-zinc-100 rounded-[2rem]">
        <Clock className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <p className="text-zinc-500 text-lg">No hay movimientos registrados para este periodo.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="group relative bg-white/40 border border-white/60 p-4 md:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:bg-zinc-50 shadow-sm"
        >
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            {/* Icon Box */}
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${tx.isInflow
              ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
              : tx.type === 'EGRESO'
                ? 'bg-red-100 text-red-600 border border-red-200'
                : tx.type === 'AHORRO'
                  ? 'bg-blue-100 text-blue-600 border border-blue-200'
                  : 'bg-violet-100 text-violet-600 border border-violet-200'
              }`}>
              {tx.type === 'INGRESO' ? <ArrowUpCircle className="w-5 h-5 md:w-6 md:h-6" />
                : tx.type === 'EGRESO' ? <ArrowDownCircle className="w-5 h-5 md:w-6 md:h-6" />
                  : tx.type === 'AHORRO' ? <PiggyBank className="w-5 h-5 md:w-6 md:h-6" />
                    : <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-black group-hover:text-emerald-600 transition-colors uppercase tracking-wider text-xs md:text-sm mb-0.5 truncate">
                {tx.description}
              </h4>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1 shrink-0">
                  <Calendar className="w-3 h-3" />
                  {formatDate(tx.date)}
                </span>
                {tx.category && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-zinc-100 rounded-full border border-zinc-200 uppercase text-[9px] font-bold tracking-tighter text-zinc-600 whitespace-nowrap">
                    <Tag className="w-2.5 h-2.5" />
                    {tx.category.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Amount & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-14 sm:pl-0">
            <div className="text-left sm:text-right">
              <div className={`text-base md:text-lg font-bold tracking-tight ${tx.isInflow
                ? 'text-emerald-600'
                : tx.type === 'EGRESO' ? 'text-red-600'
                  : tx.type === 'AHORRO' ? 'text-blue-600'
                    : 'text-violet-600'
                }`}>
                {tx.isInflow ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
              </div>
            </div>

            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onEdit(tx)}
                className="p-1.5 md:p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-amber-500 transition-all"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(tx.id)}
                className="p-1.5 md:p-2 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
