'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MonthlyData {
  label: string;
  ingresos: number;
  egresos: number;
}

interface SavingsMonthlyChartProps {
  data: MonthlyData[];
}

export function SavingsMonthlyChart({ data }: SavingsMonthlyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
        <h3 className="font-bold text-zinc-900 text-lg mb-4">Evolución Mensual</h3>
        <div className="h-[250px] flex items-center justify-center text-zinc-400 text-sm font-medium">
          No hay datos suficientes para mostrar el gráfico
        </div>
      </div>
    );
  }

  if (data.every((d) => d.ingresos === 0 && d.egresos === 0)) {
    return (
      <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
        <h3 className="font-bold text-zinc-900 text-lg mb-4">Evolución Mensual</h3>
        <div className="h-[250px] flex items-center justify-center text-zinc-400 text-sm font-medium">
          No hay movimientos de ahorro en los últimos 6 meses
        </div>
      </div>
    );
  }

  const totalIn = data.reduce((s, d) => s + d.ingresos, 0);
  const totalOut = data.reduce((s, d) => s + d.egresos, 0);

  return (
    <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-zinc-900 text-lg">Evolución Mensual</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-zinc-500">Aportes ${(totalIn / (data.length || 1)).toLocaleString()}/mes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingDown size={14} className="text-rose-500" />
            <span className="text-xs font-bold text-zinc-500">Retiros ${(totalOut / (data.length || 1)).toLocaleString()}/mes</span>
          </div>
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
<XAxis
  dataKey="label"
  axisLine={false}
  tickLine={false}
  tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 600 }}
/>
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #e4e4e7',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '12px' }}
            />
            <Bar
              dataKey="ingresos"
              name="Aportes"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="egresos"
              name="Retiros"
              fill="#f43f5e"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
