import React from "react";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormattedValue } from "./FormattedValue";

interface Transaction {
  id: string;
  desc: string;
  amount: number;
  date: string;
  icon: LucideIcon;
  color: string;
  category: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  isPrivateMode: boolean;
}

export function RecentTransactions({ transactions, isPrivateMode }: RecentTransactionsProps) {
  return (
    <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm overflow-hidden">
      <div className="p-6 md:px-8 border-b border-zinc-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
        <h3 className="font-bold text-zinc-900 text-lg">Últimos Movimientos</h3>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          Ver todos <ChevronRight size={14} />
        </button>
      </div>
      <div className="p-2 md:p-4">
        <div className="space-y-1">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 md:px-4 rounded-2xl hover:bg-zinc-50 transition-all group">
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", tx.color)}>
                  <tx.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{tx.desc}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] text-zinc-400 font-medium">{tx.date}</p>
                    <span className="w-1 h-1 rounded-full bg-zinc-200"/>
                    <p className="text-[11px] text-zinc-500">{tx.category}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-sm md:text-base font-extrabold tracking-tight", 
                  tx.amount > 0 ? "text-emerald-600" : "text-zinc-900"
                )}>
                  {tx.amount > 0 ? '+' : ''}
                  <FormattedValue value={tx.amount} isPrivateMode={isPrivateMode} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
