import React from "react";
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { FormattedValue } from "./FormattedValue";

interface SavingsCardProps {
  amount: number;
  isPrivateMode: boolean;
  percentage: number;
  chartData: { val: number }[];
}

export function SavingsCard({ amount, isPrivateMode, percentage, chartData }: SavingsCardProps) {
  return (
    <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm flex flex-col overflow-hidden">
      <div className="p-7 flex-1 flex flex-col justify-center pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wide">Ahorro Mensual</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={18}/></div>
        </div>
        <h3 className="text-2xl font-extrabold text-indigo-600 mt-1 tracking-tight">
          <FormattedValue value={amount} isPrivateMode={isPrivateMode} />
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1.5 bg-indigo-50 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{width: `${percentage}%`}} />
          </div>
          <span className="text-[11px] font-black text-indigo-700">{percentage}%</span>
        </div>
      </div>
      <div className="h-10 w-full opacity-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradSparkA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2}/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={2} fill="url(#gradSparkA)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
