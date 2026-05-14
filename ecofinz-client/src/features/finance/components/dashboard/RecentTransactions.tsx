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
  accountName?: string;
  installmentInfo?: { count: number; monthlyAmount: number };
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
        {transactions.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            <p className="text-sm font-medium text-zinc-400">
              Sin movimientos registrados en los últimos 30 días
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 md:px-4 rounded-2xl hover:bg-zinc-50 transition-all group">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", tx.color)}>
                    <tx.icon size={18} />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-bold text-zinc-900 truncate leading-snug">{tx.desc}</p>
                    {tx.installmentInfo && (
                      <p className="text-[10px] text-zinc-500 font-medium mt-0.5 flex items-center gap-1">
                        <span>{tx.installmentInfo.count} cuotas de</span>
                        <span className="font-bold text-zinc-700">
                          <FormattedValue value={tx.installmentInfo.monthlyAmount} isPrivateMode={isPrivateMode} />
                        </span>
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 flex-wrap">
                      <p className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">{tx.date}</p>
                      <span className="w-1 h-1 rounded-full bg-zinc-200 shrink-0"/>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[100px]">{tx.category}</p>
                      {tx.accountName && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-zinc-200 shrink-0"/>
                          <p className="text-[10px] text-indigo-600 font-bold truncate max-w-[120px] bg-indigo-50/50 px-1.5 py-0.5 rounded-md border border-indigo-100/40">
                            {tx.accountName}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-4">
                  <p className={cn("text-sm md:text-base font-extrabold tracking-tight", 
                    tx.amount > 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {tx.amount > 0 ? '+' : ''}
                    <FormattedValue value={tx.amount} isPrivateMode={isPrivateMode} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
