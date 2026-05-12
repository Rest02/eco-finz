import React from "react";
import { TrendingDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { FormattedValue } from "./FormattedValue";

interface ExpenseCardProps {
  amount: number;
  isPrivateMode: boolean;
  changeText: string;
  chartData: { val: number }[];
}

export function ExpenseCard({ amount, isPrivateMode, changeText, chartData }: ExpenseCardProps) {
  return (
    <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm flex flex-col overflow-hidden">
      <div className="p-7 flex-1 flex flex-col justify-center pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wide">Egresos Mes</span>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><TrendingDown size={18}/></div>
        </div>
        <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 tracking-tight">
          <FormattedValue value={amount} isPrivateMode={isPrivateMode} />
        </h3>
        <p className="text-[10px] font-bold text-emerald-600 mt-1 bg-emerald-50 inline-block w-fit px-2 py-0.5 rounded-md">
          {changeText}
        </p>
      </div>
      <div className="h-10 w-full opacity-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradSparkE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" stopOpacity={0.2}/>
                <stop offset="100%" stopColor="#fb7185" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="val" stroke="#fb7185" strokeWidth={2} fill="url(#gradSparkE)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
