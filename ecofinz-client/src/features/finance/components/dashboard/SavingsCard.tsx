"use client";

import React, { useMemo } from "react";
import { Calculator } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { FormattedValue } from "./FormattedValue";

interface SavingsCardProps {
  amountIn: number;
  amountOut: number;
  isPrivateMode: boolean;
  chartDataIn: { val: number }[];
  chartDataOut: { val: number }[];
}

export function SavingsCard({ 
  amountIn, 
  amountOut, 
  isPrivateMode, 
  chartDataIn, 
  chartDataOut 
}: SavingsCardProps) {
  const netSavings = amountIn - amountOut;

  // Chart data as Net
  const displayData = useMemo(() => {
    return chartDataIn.map((d, i) => ({ val: Math.max(0, d.val - (chartDataOut[i]?.val || 0)) }));
  }, [chartDataIn, chartDataOut]);

  const monthsUntilNovember = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const targetMonth = 11;
    let delta = targetMonth - currentMonth;
    return delta < 0 ? 0 : delta;
  }, []);

  const projectionTotal = Math.max(0, netSavings) * monthsUntilNovember;

  return (
    <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm flex flex-col overflow-hidden transition-all duration-300 relative h-[340px]">
      
      <div className="p-6 pb-2 flex-1 flex flex-col h-full relative z-10">
        
        {/* TOP HEADER CON EQUILIBRIO DE ALTURA */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Ahorro Neto Mes
          </span>
          {/* Elemento fantasma para igualar la altura de línea que el botón da en Egresos */}
          <div className="p-1.5 w-7 h-7 invisible pointer-events-none" aria-hidden="true"></div>
        </div>

        {/* MONTO DESTACADO */}
        <div className="h-10 mb-4">
          <h3 className="text-3xl font-black tracking-tight text-zinc-900">
            <FormattedValue value={netSavings} isPrivateMode={isPrivateMode} />
          </h3>
        </div>

        {/* BARRA DE DISTRIBUCIÓN */}
        <div className="w-full h-1 bg-zinc-100 rounded-full flex overflow-hidden mb-5">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500" 
            style={{ width: `${(amountIn / (amountIn + amountOut || 1)) * 100}%` }} 
          />
          <div 
            className="h-full bg-violet-400 transition-all duration-500" 
            style={{ width: `${(amountOut / (amountIn + amountOut || 1)) * 100}%` }} 
          />
        </div>

        {/* PROYECCIÓN (Único elemento visible) */}
        <div className="mb-2 p-2.5 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 border border-zinc-100 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-indigo-600">
            <Calculator size={16} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-400 uppercase">Proyección Noviembre</p>
            <h4 className="text-sm font-extrabold text-zinc-800">
              <FormattedValue value={projectionTotal} isPrivateMode={isPrivateMode} />
            </h4>
          </div>
        </div>
        
      </div>

      {/* BACKGROUND CHART AT BOTTOM (Igual a Egresos) */}
      <div className="h-16 w-full mt-2 opacity-50 relative -mb-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="gradAhorroStatic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="val" 
              stroke="#4f46e5" 
              strokeWidth={2} 
              fill="url(#gradAhorroStatic)" 
              dot={false}
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
