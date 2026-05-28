"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DistributionPanelProps {
  fixedExpenses: number;
  savingsProjected: number;
  variableExpenses: number;
  totalIncome: number;
}

const COLORS = {
  fixed: "#f43f5e",
  savings: "#10b981",
  variable: "#a1a1aa",
};

export function DistributionPanel({
  fixedExpenses,
  savingsProjected,
  variableExpenses,
  totalIncome,
}: DistributionPanelProps) {
  const total = fixedExpenses + savingsProjected + variableExpenses;
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-400 text-sm font-medium">
        Selecciona un período de ingresos para ver la distribución
      </div>
    );
  }

  const data = [
    { name: "Gastos Fijos", value: fixedExpenses, color: COLORS.fixed },
    { name: "Ahorro Proyectado", value: savingsProjected, color: COLORS.savings },
    { name: "Gastos Variables", value: Math.max(0, variableExpenses), color: COLORS.variable },
  ].filter((d) => d.value > 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  return (
    <div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: string | number | undefined) => formatCurrency(Number(value ?? 0))}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e4e4e7",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs font-medium text-zinc-500">{d.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500 font-medium">Ingreso Disponible</span>
          <span className="font-bold text-zinc-900">
            {formatCurrency(totalIncome - fixedExpenses)}
          </span>
        </div>
        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden flex">
          <div
            className="bg-rose-500 h-full transition-all duration-500"
            style={{ width: `${(fixedExpenses / total) * 100}%` }}
          />
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(savingsProjected / total) * 100}%` }}
          />
          <div
            className="bg-zinc-300 h-full transition-all duration-500"
            style={{ width: `${Math.max(0, variableExpenses / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
