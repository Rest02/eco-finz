import React, { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { FormattedValue } from "./FormattedValue";
import { cn } from "@/lib/utils";

interface ChartDataItem {
  month: string;
  ingresos: number;
  egresosDebito: number;
  egresosCredito: number;
}

interface IncomeExpensesChartProps {
  data: ChartDataItem[];
  isPrivateMode: boolean;
}

export function IncomeExpensesChart({ data, isPrivateMode }: IncomeExpensesChartProps) {
  const [filterType, setFilterType] = useState<"ALL" | "DEBIT" | "CREDIT">("ALL");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Mapear y computar los datos finales según el filtro local
  const processedData = data.map(item => ({
    month: item.month,
    ingresos: item.ingresos,
    egresos: filterType === "ALL"
      ? item.egresosDebito + item.egresosCredito
      : filterType === "DEBIT"
        ? item.egresosDebito
        : item.egresosCredito
  }));

  return (
    <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-zinc-200/60 shadow-sm flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">Ingresos vs Egresos</h3>
          <p className="text-zinc-500 text-xs font-medium">Histórico mensual</p>
        </div>

        {/* Segmented Control Selector */}
        <div className="flex bg-zinc-100/80 p-1 rounded-xl self-start sm:self-center border border-zinc-200/40">
          <button
            onClick={() => setFilterType("ALL")}
            className={cn(
              "px-3.5 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200",
              filterType === "ALL"
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/20"
                : "text-zinc-500 hover:text-zinc-800"
            )}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType("DEBIT")}
            className={cn(
              "px-3.5 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200",
              filterType === "DEBIT"
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/20"
                : "text-zinc-500 hover:text-zinc-800"
            )}
          >
            Débito
          </button>
          <button
            onClick={() => setFilterType("CREDIT")}
            className={cn(
              "px-3.5 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200",
              filterType === "CREDIT"
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/20"
                : "text-zinc-500 hover:text-zinc-800"
            )}
          >
            Crédito
          </button>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-bold">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm" /> Ingresos
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-rose-400 rounded-sm" /> Egresos
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc", radius: 8 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-zinc-900 text-white p-3 rounded-xl shadow-xl border border-zinc-800 text-xs font-medium">
                      <p className="text-zinc-400 mb-2 font-bold">{payload[0].payload.month}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-indigo-300">Ingresos:</span>{" "}
                          <b>
                            <FormattedValue
                              value={payload[0].value as number}
                              isPrivateMode={isPrivateMode}
                            />
                          </b>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-rose-300">Egresos:</span>{" "}
                          <b>
                            <FormattedValue
                              value={payload[1].value as number}
                              isPrivateMode={isPrivateMode}
                            />
                          </b>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="ingresos" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={14} />
            <Bar dataKey="egresos" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
