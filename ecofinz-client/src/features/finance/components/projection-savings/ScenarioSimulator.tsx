"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Target, Calendar, Percent, TrendingUp } from "lucide-react";

type ScenarioMode = "A" | "B" | "C";

interface ScenarioSimulatorProps {
  scenarioMode: ScenarioMode;
  onScenarioChange: (mode: ScenarioMode) => void;
  targetAmount: number;
  onTargetAmountChange: (value: number) => void;
  targetDate: string;
  onTargetDateChange: (value: string) => void;
  savingsPercentage: number;
  onSavingsPercentageChange: (value: number) => void;
  availableIncome: number;
}

const scenarioDescriptions = {
  A: "Fija el monto y la fecha para calcular el % necesario",
  B: "Fija el monto y el % para calcular la fecha estimada",
  C: "Fija la fecha y el % para calcular el monto acumulado",
};

export function ScenarioSimulator({
  scenarioMode,
  onScenarioChange,
  targetAmount,
  onTargetAmountChange,
  targetDate,
  onTargetDateChange,
  savingsPercentage,
  onSavingsPercentageChange,
  availableIncome,
}: ScenarioSimulatorProps) {
  const monthlySavings = availableIncome * (savingsPercentage / 100);
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  let feedback = "";
  if (availableIncome > 0 && targetAmount > 0) {
    if (scenarioMode === "A" && targetDate) {
      const months = monthsBetween(new Date(), new Date(targetDate));
      if (months > 0) {
        const needed = (targetAmount / months / availableIncome) * 100;
        feedback = `Para alcanzar ${formatCurrency(targetAmount)} en ${fechaEspanol(targetDate)}, necesitas destinar el <strong>${Math.ceil(needed)}%</strong> de tu ingreso disponible (${formatCurrency(targetAmount / months)}/mes).`;
      }
    } else if (scenarioMode === "B" && savingsPercentage > 0) {
      const monthsNeeded = Math.ceil(targetAmount / monthlySavings);
      if (monthsNeeded > 0) {
        const estimatedDate = new Date();
        estimatedDate.setMonth(estimatedDate.getMonth() + monthsNeeded);
        feedback = `Ahorrando el <strong>${savingsPercentage}%</strong> (${formatCurrency(monthlySavings)}/mes), alcanzarás ${formatCurrency(targetAmount)} en <strong>${monthsNeeded} meses</strong> (${fechaEspanol(estimatedDate.toISOString().split("T")[0])}).`;
      }
    } else if (scenarioMode === "C" && targetDate && savingsPercentage > 0) {
      const months = monthsBetween(new Date(), new Date(targetDate));
      if (months > 0) {
        const totalAccumulated = monthlySavings * months;
        const monthsLabel = months === 1 ? "1 mes" : `${months} meses`;
        feedback = `Si mantienes este nivel de ahorro por <strong>${monthsLabel}</strong>, habrás acumulado <strong>${formatCurrency(totalAccumulated)}</strong> para esa fecha.`;
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Scenario Mode Selector */}
      <div className="flex gap-2">
        {(["A", "B", "C"] as ScenarioMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onScenarioChange(mode)}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              scenarioMode === mode
                ? "bg-black text-white shadow-lg"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
            )}
          >
            Escenario {mode}
          </button>
        ))}
      </div>

      <p className="text-xs text-zinc-500 font-medium text-center">
        {scenarioDescriptions[scenarioMode]}
      </p>

      {scenarioMode !== "C" && (
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
            <Target className="w-3.5 h-3.5" />
            Monto Objetivo
          </label>
          <input
            type="number"
            value={targetAmount || ""}
            onChange={(e) => onTargetAmountChange(Number(e.target.value))}
            placeholder="Ej: 2000000"
            min={1}
            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>
      )}

      {/* EScenario A: Monto + Fecha -> calcula % */}
      {scenarioMode === "A" && (
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Fecha Límite
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => onTargetDateChange(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>
      )}

      {/* Escenario B: Monto + % -> calcula fecha */}
      {scenarioMode === "B" && (
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
            <Percent className="w-3.5 h-3.5" />
            % de Ahorro
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              value={savingsPercentage}
              onChange={(e) => onSavingsPercentageChange(Number(e.target.value))}
              min={0}
              max={100}
              className="flex-1 accent-black"
            />
            <span className="text-sm font-bold text-zinc-800 min-w-[3ch]">
              {savingsPercentage}%
            </span>
          </div>
        </div>
      )}

      {/* Escenario C: Fecha + % -> calcula monto */}
      {scenarioMode === "C" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Fecha Límite
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => onTargetDateChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              <Percent className="w-3.5 h-3.5" />
              % de Ahorro
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                value={savingsPercentage}
                onChange={(e) => onSavingsPercentageChange(Number(e.target.value))}
                min={0}
                max={100}
                className="flex-1 accent-black"
              />
              <span className="text-sm font-bold text-zinc-800 min-w-[3ch]">
                {savingsPercentage}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="flex gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p
              className="text-sm text-emerald-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: feedback }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function monthsBetween(d1: Date, d2: Date): number {
  let months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months += d2.getMonth() - d1.getMonth();
  if (d2.getDate() < d1.getDate()) months--;
  return Math.max(0, months);
}

function fechaEspanol(isoDate: string): string {
  const d = new Date(isoDate);
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${meses[d.getMonth()]} ${d.getFullYear()}`;
}
