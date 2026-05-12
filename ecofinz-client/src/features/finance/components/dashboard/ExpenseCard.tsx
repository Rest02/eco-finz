import React, { useState, useMemo } from "react";
import { TrendingDown, CreditCard, Zap, Eye } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { FormattedValue } from "./FormattedValue";
import { cn } from "@/lib/utils";

interface ExpenseCardProps {
  amountDebit: number;
  amountCredit: number;
  isPrivateMode: boolean;
  chartDataDebit?: { val: number }[];
  chartDataCredit?: { val: number }[];
}

type ViewMode = "all" | "debit" | "credit";

export function ExpenseCard({ 
  amountDebit, 
  amountCredit, 
  isPrivateMode, 
  chartDataDebit = [], 
  chartDataCredit = [] 
}: ExpenseCardProps) {
  const [view, setView] = useState<ViewMode>("all");

  const totalAmount = amountDebit + amountCredit;

  // Calculate consolidated chart data (mock/simulated if lengths don't match, but ideally summed)
  const combinedChart = useMemo(() => {
    const length = Math.max(chartDataDebit.length, chartDataCredit.length);
    const data = [];
    for (let i = 0; i < length; i++) {
      const valD = chartDataDebit[i]?.val || 0;
      const valC = chartDataCredit[i]?.val || 0;
      data.push({ val: valD + valC });
    }
    return data.length > 0 ? data : [{ val: 0 }];
  }, [chartDataDebit, chartDataCredit]);

  // Selection mapping
  const currentAmount = view === "debit" ? amountDebit : view === "credit" ? amountCredit : totalAmount;
  const currentChart = view === "debit" ? chartDataDebit : view === "credit" ? chartDataCredit : combinedChart;
  const label = view === "debit" ? "Egresos Débito" : view === "credit" ? "Egresos Crédito" : "Egresos del Mes";
  
  // Color theme based on selection
  const mainColor = view === "debit" ? "#10b981" : view === "credit" ? "#3b82f6" : "#ef4444";
  const sparkId = `gradSparkE-${view}`;

  return (
    <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm flex flex-col overflow-hidden transition-all duration-300 relative">
      
      <div className="p-6 pb-2 flex-1 flex flex-col h-full relative z-10">
        {/* Header & Context Toggle */}
        <div className="flex items-center justify-between mb-2">
          <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors duration-300", 
            view === "debit" ? "text-emerald-600" : view === "credit" ? "text-blue-600" : "text-zinc-500"
          )}>
            {label}
          </span>
          <button 
            onClick={() => setView("all")}
            className={cn("p-1.5 rounded-lg transition-all", 
              view === "all" ? "bg-rose-50 text-rose-600" : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            )}
            title="Ver Total Consolidado"
          >
            {view === "all" ? <TrendingDown size={16}/> : <Eye size={16}/>}
          </button>
        </div>

        {/* Main Highlighted Amount */}
        <div className="h-10 mb-4">
          <h3 className={cn("text-3xl font-black tracking-tight transition-colors duration-300",
            view === "debit" ? "text-emerald-600" : view === "credit" ? "text-blue-600" : "text-zinc-900"
          )}>
            <FormattedValue value={currentAmount} isPrivateMode={isPrivateMode} />
          </h3>
        </div>

        {/* Mini Distribution Bar */}
        <div className="w-full h-1 bg-zinc-100 rounded-full flex overflow-hidden mb-5">
          <div 
            className="h-full bg-emerald-400 transition-all duration-500" 
            style={{ width: `${(amountDebit / (totalAmount || 1)) * 100}%` }} 
          />
          <div 
            className="h-full bg-blue-400 transition-all duration-500" 
            style={{ width: `${(amountCredit / (totalAmount || 1)) * 100}%` }} 
          />
        </div>

        {/* Interactive Dual Breakdowns */}
        <div className="space-y-2.5">
          {/* Debit Option */}
          <button
            onClick={() => setView("debit")}
            className={cn(
              "w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 border group",
              view === "debit" 
                ? "bg-emerald-50 border-emerald-100" 
                : "bg-zinc-50/50 border-transparent hover:border-zinc-200 hover:bg-zinc-50"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className={cn("p-2 rounded-xl transition-colors", 
                view === "debit" ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-emerald-100 group-hover:text-emerald-600"
              )}>
                <Zap size={14} className="fill-current" />
              </div>
              <span className="text-xs font-bold text-zinc-600">Débito</span>
            </div>
            <span className={cn("text-sm font-bold", view === "debit" ? "text-emerald-600" : "text-zinc-800")}>
              <FormattedValue value={amountDebit} isPrivateMode={isPrivateMode} />
            </span>
          </button>

          {/* Credit Option */}
          <button
            onClick={() => setView("credit")}
            className={cn(
              "w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 border group",
              view === "credit" 
                ? "bg-blue-50 border-blue-100" 
                : "bg-zinc-50/50 border-transparent hover:border-zinc-200 hover:bg-zinc-50"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className={cn("p-2 rounded-xl transition-colors", 
                view === "credit" ? "bg-blue-500 text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-blue-100 group-hover:text-blue-600"
              )}>
                <CreditCard size={14} />
              </div>
              <span className="text-xs font-bold text-zinc-600">Crédito</span>
            </div>
            <span className={cn("text-sm font-bold", view === "credit" ? "text-blue-600" : "text-zinc-800")}>
              <FormattedValue value={amountCredit} isPrivateMode={isPrivateMode} />
            </span>
          </button>
        </div>
      </div>

      {/* Background Sparkline chart adapted for specific data */}
      <div className="h-16 w-full mt-2 opacity-50 relative -mb-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentChart}>
            <defs>
              <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={mainColor} stopOpacity={0.3}/>
                <stop offset="100%" stopColor={mainColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="val" 
              stroke={mainColor} 
              strokeWidth={2} 
              fill={`url(#${sparkId})`} 
              dot={false} 
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
