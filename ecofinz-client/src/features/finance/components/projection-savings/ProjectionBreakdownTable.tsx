"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

export interface ProjectionBreakdownData {
  month: string;
  savings: number;
  accumulated: number;
  progress: number;
}

export interface ProjectionBreakdownTableProps {
  data: ProjectionBreakdownData[];
  formatCurrency: (value: number) => string;
}

export function ProjectionBreakdownTable({ data, formatCurrency }: ProjectionBreakdownTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
        <Info className="w-8 h-8 text-zinc-400 mb-2" />
        <p className="text-sm font-semibold text-zinc-700">No hay datos de proyección disponibles</p>
        <p className="text-xs text-zinc-400 mt-1">Configura tu escenario de simulación para ver el desglose mensual.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-2xl border border-zinc-100 bg-white">
        <div className="max-h-60 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white border-b border-zinc-100 z-10">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider bg-white">
                  Mes / Período
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider bg-white">
                  Ahorro del Mes
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider bg-white">
                  Total Acumulado
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider bg-white pl-6">
                  Progreso
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/80">
              {data.map((row, index) => {
                const isGoalReached = row.progress >= 100;
                
                return (
                  <tr
                    key={`${row.month}-${index}`}
                    className="hover:bg-zinc-50/50 transition-colors duration-150 group"
                  >
                    {/* Mes / Período */}
                    <td className="px-4 py-3 text-sm font-medium text-zinc-600 whitespace-nowrap">
                      {row.month}
                    </td>

                    {/* Ahorro del Mes */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span
                        className={cn(
                          "text-sm font-semibold inline-flex items-center gap-1.5",
                          row.savings > 0 ? "text-emerald-600" : "text-zinc-400"
                        )}
                      >
                        {row.savings > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        {formatCurrency(row.savings)}
                      </span>
                    </td>

                    {/* Total Acumulado */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="inline-block text-sm font-bold text-zinc-900 bg-zinc-50/80 border border-zinc-100/80 px-2.5 py-1 rounded-lg">
                        {formatCurrency(row.accumulated)}
                      </span>
                    </td>

                    {/* Progreso */}
                    <td className="px-4 py-3 pl-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-full min-w-[50px] text-center border",
                            isGoalReached
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : row.progress >= 50
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : row.progress > 0
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-zinc-50 text-zinc-500 border-zinc-200"
                          )}
                        >
                          {Math.round(row.progress)}%
                        </span>
                        <div className="w-20 bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-300",
                              isGoalReached
                                ? "bg-emerald-500"
                                : row.progress >= 50
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            )}
                            style={{ width: `${Math.min(100, Math.max(0, row.progress))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
