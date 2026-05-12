import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { FormattedValue } from "./FormattedValue";

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  change: number;
}

interface SpendingIntelligenceProps {
  categories: ExpenseCategory[];
  total: number;
  isPrivateMode: boolean;
}

export function SpendingIntelligence({ categories, total, isPrivateMode }: SpendingIntelligenceProps) {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-zinc-200/60 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-bold text-zinc-900 mb-1">Inteligencia de Gastos</h3>
      <p className="text-zinc-500 text-xs font-medium mb-6">Categorización</p>
      
      <div className="relative h-[150px] flex items-center justify-center mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={categories} innerRadius={45} outerRadius={60} paddingAngle={6} dataKey="value">
              {categories.map((entry, index) => <Cell key={`c-${index}`} fill={entry.color} stroke="none" />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[9px] font-bold text-zinc-400 uppercase">Total</span>
          <span className="text-base font-black text-zinc-800 tracking-tight">
            <FormattedValue value={total} isPrivateMode={isPrivateMode} />
          </span>
        </div>
      </div>
      
      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
        {categories.map(cat => (
          <div key={cat.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: cat.color}}/>
              <span className="text-xs font-semibold text-zinc-600">{cat.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900">
                <FormattedValue value={cat.value} isPrivateMode={isPrivateMode} />
              </span>
              <span className={cn("text-[9px] font-bold px-1.5 rounded-md", cat.change > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")}>
                {cat.change > 0 ? '+' : ''}{cat.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
