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
  Calendar
} from "lucide-react";

interface Props {
  transactions: Transaction[];
  onDelete: (transactionId: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionList: React.FC<Props> = ({ transactions, onDelete, onEdit }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-[2rem]">
        <Clock className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
        <p className="text-neutral-500 text-lg">No hay movimientos registrados para este periodo.</p>
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
          className="group relative glass-card p-4 md:p-5 rounded-2xl flex items-center justify-between transition-all duration-300 hover:bg-white/[0.05]"
        >
          <div className="flex items-center gap-4">
            {/* Icon Box */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'INGRESO'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
              {tx.type === 'INGRESO' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
            </div>

            {/* Info */}
            <div>
              <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-wider text-sm mb-0.5">
                {tx.description}
              </h4>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(tx.date)}
                </span>
                {tx.category && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-full border border-white/5 uppercase text-[9px] font-bold tracking-tighter">
                    <Tag className="w-2.5 h-2.5" />
                    {tx.category.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Amount & Actions */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className={`text-lg font-bold tracking-tight ${tx.type === 'INGRESO' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                {tx.type === 'INGRESO' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
              <button
                onClick={() => onEdit(tx)}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-amber-400 transition-all backdrop-blur-md"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(tx.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all backdrop-blur-md"
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
