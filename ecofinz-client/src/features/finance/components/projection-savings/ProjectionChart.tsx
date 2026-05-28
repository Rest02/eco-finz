"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Sparkles, Target } from "lucide-react";

export interface ProjectionDataPoint {
  name: string;
  acumulado: number;
}

interface ProjectionChartProps {
  data: ProjectionDataPoint[];
  targetAmount: number;
  formatCurrency: (value: number) => string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  targetAmount: number;
  formatCurrency: (value: number) => string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  targetAmount,
  formatCurrency,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0].value as number;
    const progress = targetAmount > 0 ? (value / targetAmount) * 100 : null;

    return (
      <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-xl">
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
          {label}
        </p>
        <div className="space-y-1">
          <div className="flex justify-between items-baseline gap-6">
            <span className="text-xs font-medium text-zinc-400">Acumulado:</span>
            <span className="text-sm font-bold text-zinc-900">
              {formatCurrency(value)}
            </span>
          </div>
          {progress !== null && progress > 0 && (
            <div className="flex justify-between items-center gap-6 mt-1.5 pt-1.5 border-t border-zinc-100">
              <span className="text-xs font-medium text-zinc-400">Progreso:</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {progress.toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function ProjectionChart({
  data,
  targetAmount,
  formatCurrency,
}: ProjectionChartProps) {
  // If array is empty or all accumulated savings are 0
  const isEmpty = !data || data.length === 0 || data.every((d) => d.acumulado === 0);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px] bg-zinc-50/50 border-2 border-dashed border-zinc-200/80 rounded-[32px] text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-zinc-400 animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-zinc-800 mb-1">Sin Proyección Activa</h4>
        <p className="text-xs text-zinc-500 max-w-[280px] leading-relaxed">
          Introduce un monto objetivo de ahorro, plazo o porcentaje para ver el gráfico de proyección acumulada en el tiempo.
        </p>
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  return (
    <div className="w-full bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6 lg:p-8 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-zinc-900">Progreso Proyectado</h3>
          <p className="text-zinc-500 text-xs font-medium">Evolución de tu ahorro mes a mes</p>
        </div>
        {targetAmount > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5 text-xs text-amber-800 font-bold self-start sm:self-center">
            <Target className="w-3.5 h-3.5 text-amber-600" />
            Meta: {formatCurrency(targetAmount)}
          </div>
        )}
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              content={
                <CustomTooltip
                  targetAmount={targetAmount}
                  formatCurrency={formatCurrency}
                />
              }
            />
            {targetAmount > 0 && (
              <ReferenceLine
                y={targetAmount}
                stroke="#eab308"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: "Meta",
                  fill: "#eab308",
                  position: "top",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="acumulado"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAcumulado)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
