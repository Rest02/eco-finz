import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { FormattedValue } from "./FormattedValue";

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface SpendingIntelligenceProps {
  categories: ExpenseCategory[];
  total: number;
  isPrivateMode: boolean;
}

export function SpendingIntelligence({ categories, total, isPrivateMode }: SpendingIntelligenceProps) {
  const hasData = categories.length > 0 && total > 0;

  // Si no hay datos, pasamos un array falso con color gris para mostrar una dona vacía y elegante
  const chartData = hasData 
    ? categories 
    : [{ name: "Sin gastos", value: 1, color: "#f1f5f9", percentage: 0 }];

  return (
    <div className="bg-white rounded-[32px] p-8 border border-zinc-200/60 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-bold text-zinc-900 mb-1">Inteligencia de Gastos</h3>
      <p className="text-zinc-500 text-xs font-medium mb-6">Categorización</p>
      
      <div className="relative h-[150px] flex items-center justify-center mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={chartData} 
              innerRadius={45} 
              outerRadius={60} 
              paddingAngle={hasData ? 6 : 0} 
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`c-${index}`} fill={entry.color} stroke="none" />
              ))}
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
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-1 min-h-[120px]">
        {!hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <p className="text-zinc-400 text-xs font-medium leading-relaxed">
              Sin movimientos registrados este mes
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div 
                    className="w-1.5 h-1.5 rounded-full shrink-0" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-semibold text-zinc-600 truncate">
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-zinc-900">
                    <FormattedValue value={cat.value} isPrivateMode={isPrivateMode} />
                  </span>
                  <span className="text-[10px] font-extrabold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
