"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";
import { CreditCard, CalendarDays, TrendingUp, Check, ChevronDown, ChevronUp } from "lucide-react";
import { MonthlyProjection, Account } from "../../types/finance";
import { useTransactions } from "../../hooks/useTransactions";
import { useUpdateSpendingPlan } from "../../hooks/useMonthlyProjections";
import toast from "react-hot-toast";

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

// --- Helpers ---

function getPrevMonth(year: number, month: number) {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

function getBusinessDays(start: number, end: number, y: number, m: number): number[] {
  const days: number[] = [];
  for (let d = start; d <= end; d++) {
    const dow = new Date(y, m - 1, d).getDay();
    if (dow !== 0 && dow !== 6) days.push(d);
  }
  return days;
}

function getAllDays(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getAlternateDays(start: number, end: number, y: number, m: number): number[] {
  return getBusinessDays(start, end, y, m).filter((_, i) => i % 2 === 0);
}

function generateDaysForRange(pattern: string, y: number, m: number, start: number, end: number): number[] {
  switch (pattern) {
    case "business_days": return getBusinessDays(start, end, y, m);
    case "full_week":     return getAllDays(start, end);
    case "alternate_days": return getAlternateDays(start, end, y, m);
    default:              return getBusinessDays(start, end, y, m);
  }
}

// Default spending days for current month: pattern applied to 1 → payDay-1
function defaultCurrentDays(pattern: string, y: number, m: number, payDay: number): number[] {
  if (payDay <= 1) return [];
  return generateDaysForRange(pattern, y, m, 1, payDay - 1);
}

// Auto days in previous month for the full period: pattern applied to payDay → end
function autoPrevMonthDays(pattern: string, py: number, pm: number, payDay: number): number[] {
  const dim = new Date(py, pm, 0).getDate();
  if (payDay > dim) return [];
  const p = pattern === "custom" ? "business_days" : pattern;
  return generateDaysForRange(p, py, pm, payDay, dim);
}

// Build the full date range as ISO strings for an array of (year, month, dayNumbers)
function toDateStrings(y: number, m: number, days: number[]): string[] {
  const ym = `${y}-${String(m).padStart(2, "0")}`;
  return days.map(d => `${ym}-${String(d).padStart(2, "0")}`);
}

interface WeekInfo {
  weekLabel: string;
  weekStart: Date;
  weekEnd: Date;
  dayCount: number;
  totalBudget: number;
  dateStrings: string[];
}

function buildEqualWeeks(
  prevYear: number, prevMonthNum: number,
  currYear: number, currMonth: number,
  payDay: number,
  totalBudget: number,
  numberOfWeeks: number
): WeekInfo[] {
  const startDate = new Date(prevYear, prevMonthNum - 1, payDay);
  const endDate = new Date(currYear, currMonth - 1, payDay);

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const weeklyBudget = totalBudget / numberOfWeeks;
  const chunkSize = Math.ceil(totalDays / numberOfWeeks);

  const weeks: WeekInfo[] = [];
  const cursor = new Date(startDate);

  for (let w = 0; w < numberOfWeeks; w++) {
    const weekStart = new Date(cursor);
    const chunkEnd = new Date(cursor);
    chunkEnd.setDate(chunkEnd.getDate() + chunkSize - 1);
    const actualEnd = chunkEnd > endDate ? new Date(endDate) : chunkEnd;

    const dateStrings: string[] = [];
    const dayCursor = new Date(weekStart);
    while (dayCursor <= actualEnd) {
      dateStrings.push(dayCursor.toISOString().slice(0, 10));
      dayCursor.setDate(dayCursor.getDate() + 1);
    }

    const s = weekStart;
    const e = actualEnd;
    const label = `${s.getDate()} ${MONTH_SHORT[s.getMonth()]} - ${e.getDate()} ${MONTH_SHORT[e.getMonth()]}`;

    weeks.push({
      weekLabel: label,
      weekStart,
      weekEnd: actualEnd,
      dayCount: dateStrings.length,
      totalBudget: weeklyBudget,
      dateStrings,
    });

    cursor.setDate(cursor.getDate() + chunkSize);
  }

  return weeks;
}

// --- Component ---

interface VariableExpensePlanProps {
  projection: MonthlyProjection;
  accounts: Account[];
}

export function VariableExpensePlan({ projection, accounts }: VariableExpensePlanProps) {
  const currYear = parseInt(projection.period.split("-")[0]);
  const currMonth = parseInt(projection.period.split("-")[1]);
  const daysInMonth = new Date(currYear, currMonth, 0).getDate();
  const payDay = projection.payDay;
  const pm = getPrevMonth(currYear, currMonth);
  const prevYear = pm.year;
  const prevMonth = pm.month;

  const { mutate: updateSpendingPlan } = useUpdateSpendingPlan();

  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(
    projection.variableExpensesAccountId || undefined
  );
  const [spendingDays, setSpendingDays] = useState<number[]>(() => {
    if (projection.spendingDays) {
      return projection.spendingDays.split(",").map(Number);
    }
    return defaultCurrentDays(
      projection.spendingPlanPattern || "business_days",
      currYear, currMonth, payDay
    );
  });
  const [currentPattern, setCurrentPattern] = useState<string>(
    projection.spendingPlanPattern || "business_days"
  );
  const [customWeeks, setCustomWeeks] = useState<number | null>(
    projection.variableExpenseWeeks ?? null
  );
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  // --- Derived data ---

  const spendableAccounts = useMemo(
    () => accounts.filter(a => a.type === "BANCO" || a.type === "BILLETERA_DIGITAL"),
    [accounts]
  );
  const linkedAccount = useMemo(
    () => accounts.find(a => a.id === selectedAccountId),
    [accounts, selectedAccountId]
  );

  const totalBudget = Number(projection.projectedVariableExpenses);

  // Auto days in previous month part of the period
  const prevMonthDays = useMemo(
    () => autoPrevMonthDays(currentPattern, prevYear, prevMonth, payDay),
    [currentPattern, prevYear, prevMonth, payDay]
  );

  // All spending days in the current month (user-configured)
  const currDayStrings = useMemo(
    () => toDateStrings(currYear, currMonth, spendingDays),
    [currYear, currMonth, spendingDays]
  );
  const prevDayStrings = useMemo(
    () => toDateStrings(prevYear, prevMonth, prevMonthDays),
    [prevYear, prevMonth, prevMonthDays]
  );

  const totalSpendingDays = prevMonthDays.length + spendingDays.length;
  const dailyBudget = totalSpendingDays > 0 ? totalBudget / totalSpendingDays : 0;

  // Weeks spanning the full period (prevPayDay → currPayDay)
  const maxWeeks = useMemo(() => {
    const start = new Date(prevYear, prevMonth - 1, payDay);
    const end = new Date(currYear, currMonth - 1, payDay);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(totalDays / 7));
  }, [prevYear, prevMonth, currYear, currMonth, payDay]);

  const effectiveWeeks = customWeeks ?? maxWeeks;
  const weeklyBudget = effectiveWeeks > 0 ? totalBudget / effectiveWeeks : 0;

  const weeks = useMemo(
    () => buildEqualWeeks(prevYear, prevMonth, currYear, currMonth, payDay, totalBudget, effectiveWeeks),
    [prevYear, prevMonth, currYear, currMonth, payDay, totalBudget, effectiveWeeks]
  );

  // --- Transactions for progress ---
  const periodStartStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(payDay).padStart(2, "0")}`;
  const periodEndStr = `${currYear}-${String(currMonth).padStart(2, "0")}-${String(payDay).padStart(2, "0")}`;

  const { data: txsData } = useTransactions(
    selectedAccountId
      ? { accountId: selectedAccountId, startDate: periodStartStr, endDate: periodEndStr, limit: 10000 }
      : undefined
  );

  // Expense transactions by full ISO date string
  const spendingByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of txsData?.data || []) {
      if (!tx.isInflow) {
        const iso = tx.date.slice(0, 10);
        map.set(iso, (map.get(iso) || 0) + Math.abs(Number(tx.amount)));
      }
    }
    return map;
  }, [txsData]);

  const totalSpent = Array.from(spendingByDate.values()).reduce((s, v) => s + v, 0);
  const spentPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Per-week progress
  const weekProgress = useMemo(() => {
    return weeks.map(w => {
      let spent = 0;
      for (const iso of w.dateStrings) spent += spendingByDate.get(iso) || 0;
      return { ...w, weekSpent: spent, weekPct: w.totalBudget > 0 ? (spent / w.totalBudget) * 100 : 0 };
    });
  }, [weeks, spendingByDate]);

  // Spending by day-of-month (for calendar display)
  const spendingByDOM = useMemo(() => {
    const map = new Map<number, number>();
    for (const tx of txsData?.data || []) {
      if (!tx.isInflow) {
        const d = new Date(tx.date);
        if (d.getMonth() + 1 === currMonth && d.getFullYear() === currYear) {
          map.set(d.getDate(), (map.get(d.getDate()) || 0) + Math.abs(Number(tx.amount)));
        }
      }
    }
    return map;
  }, [txsData, currMonth, currYear]);

  // --- Persistence ---

  const persist = useCallback(
    (days: number[], pattern: string) => {
      updateSpendingPlan(
        {
          id: projection.id,
          data: {
            variableExpensesAccountId: selectedAccountId,
            spendingPlanPattern: pattern,
            spendingDays: days.join(","),
          },
        },
        { onError: () => toast.error("Error al guardar el plan de gastos") }
      );
    },
    [projection.id, selectedAccountId, updateSpendingPlan]
  );

  // --- Handlers ---

  const handleToggleDay = useCallback(
    (day: number) => {
      const next = spendingDays.includes(day)
        ? spendingDays.filter(d => d !== day)
        : [...spendingDays, day].sort((a, b) => a - b);
      setSpendingDays(next);
      setCurrentPattern("custom");
      persist(next, "custom");
    },
    [spendingDays, persist]
  );

  const handleApplyPattern = useCallback(
    (pattern: string) => {
      const days = defaultCurrentDays(pattern, currYear, currMonth, payDay);
      setSpendingDays(days);
      setCurrentPattern(pattern);
      persist(days, pattern);
    },
    [currYear, currMonth, payDay, persist]
  );

  const handleSelectAccount = useCallback(
    (accountId: string) => {
      setSelectedAccountId(accountId);
      setShowAccountSelector(false);
      updateSpendingPlan(
        {
          id: projection.id,
          data: {
            variableExpensesAccountId: accountId,
            spendingDays: spendingDays.join(","),
            spendingPlanPattern: currentPattern,
          },
        },
        {
          onSuccess: () => toast.success("Cuenta vinculada"),
          onError: () => toast.error("Error al vincular cuenta"),
        }
      );
    },
    [projection.id, spendingDays, currentPattern, updateSpendingPlan]
  );

  const handleRemoveAccount = useCallback(() => {
    setSelectedAccountId(undefined);
    updateSpendingPlan(
      {
        id: projection.id,
        data: {
          variableExpensesAccountId: "",
          spendingDays: spendingDays.join(","),
          spendingPlanPattern: currentPattern,
        },
      },
      { onError: () => toast.error("Error al desvincular cuenta") }
    );
  }, [projection.id, spendingDays, currentPattern, updateSpendingPlan]);

  const handleWeeksChange = useCallback((weeks: number | null) => {
    setCustomWeeks(weeks);
    updateSpendingPlan(
      {
        id: projection.id,
        data: { variableExpenseWeeks: weeks ?? undefined },
      },
      { onError: () => toast.error("Error al guardar configuración de semanas") }
    );
  }, [projection.id, updateSpendingPlan]);

  const patterns = [
    { key: "business_days", label: "Días hábiles" },
    { key: "full_week", label: "Semana completa" },
    { key: "alternate_days", label: "Día por medio" },
  ];

  // --- Render ---

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-zinc-700 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Plan de Gastos Variables
        </h3>
        <span className="text-lg font-black text-amber-600">{formatCurrency(totalBudget)}</span>
      </div>

      {/* Periodo info */}
      <div className="mb-4 px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-500 flex items-center gap-2">
        <CalendarDays className="w-3.5 h-3.5" />
        Período de gasto: <span className="font-bold text-zinc-700">{payDay} de {MONTH_SHORT[prevMonth - 1]} → {payDay} de {MONTH_SHORT[currMonth - 1]}</span>
        <span className="ml-auto font-medium text-zinc-400">
          {effectiveWeeks} semana{effectiveWeeks !== 1 ? "s" : ""} · {formatCurrency(weeklyBudget)} / semana
        </span>
      </div>

      {/* Account Linker */}
      <div className="mb-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
        {linkedAccount ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-700">{linkedAccount.name}</p>
                <p className="text-xs text-zinc-400">
                  {linkedAccount.type === "BANCO" ? "Banco" : "Billetera Digital"} · Saldo: {formatCurrency(Number(linkedAccount.balance))}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAccountSelector(!showAccountSelector)} className="text-xs text-zinc-400 hover:text-black transition-colors font-medium">Cambiar</button>
              <button onClick={handleRemoveAccount} className="text-xs text-zinc-400 hover:text-red-500 transition-colors font-medium">Quitar</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-3">Vincula una cuenta para trackear tus gastos variables</p>
            {showAccountSelector ? (
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {spendableAccounts.length === 0 ? (
                  <p className="text-xs text-zinc-400">No hay cuentas bancarias o billeteras digitales disponibles.</p>
                ) : (
                  spendableAccounts.map(acc => (
                    <button key={acc.id} onClick={() => handleSelectAccount(acc.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 transition-colors text-left"
                    >
                      <span className="text-sm font-medium text-zinc-700">{acc.name}</span>
                      <span className="text-xs text-zinc-400">{formatCurrency(Number(acc.balance))}</span>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <button onClick={() => setShowAccountSelector(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 transition-colors text-sm font-medium text-zinc-600"
              >
                <CreditCard className="w-4 h-4" /> Seleccionar cuenta
              </button>
            )}
          </div>
        )}
      </div>

      {/* Weekly Breakdown */}
      {weeks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-zinc-500 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Distribución Semanal
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-400 font-medium">Semanas:</span>
              <select
                value={customWeeks === null ? 'auto' : String(customWeeks)}
                onChange={e => {
                  const val = e.target.value;
                  handleWeeksChange(val === 'auto' ? null : Number(val));
                }}
                className="text-[11px] font-bold text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-lg px-2 py-1 cursor-pointer outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="auto">Auto ({maxWeeks})</option>
                {Array.from({ length: maxWeeks }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {weekProgress.map(w => (
              <div key={w.weekLabel}
                className="relative p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 overflow-hidden"
              >
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{w.weekLabel}</p>
                <p className="text-base font-black text-zinc-900">{formatCurrency(w.totalBudget)}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  {w.dayCount} día{w.dayCount !== 1 ? "s" : ""}
                </p>
                {linkedAccount && w.weekSpent > 0 && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${w.weekPct > 100 ? "bg-red-500" : w.weekPct > 80 ? "bg-amber-400" : "bg-emerald-400"}`}
                        style={{ width: `${Math.min(w.weekPct, 100)}%` }} />
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{formatCurrency(w.weekSpent)} gastado</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Breakdown */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-zinc-500 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            Distribución Diaria — {MONTH_SHORT[currMonth - 1].charAt(0).toUpperCase() + MONTH_SHORT[currMonth - 1].slice(1)} {currYear}
          </h4>
          <span className="text-xs font-bold text-amber-600">{formatCurrency(dailyBudget)} / día</span>
        </div>

        {/* Pattern Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {patterns.map(p => (
            <button key={p.key} onClick={() => handleApplyPattern(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentPattern === p.key
                  ? "bg-amber-100 text-amber-700 border border-amber-300"
                  : "bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200"
              }`}
            >{p.label}</button>
          ))}
          {currentPattern === "custom" && (
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-100 text-violet-700 border border-violet-300">
              Personalizado
            </span>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {DAY_NAMES.map(name => (
            <div key={name} className="text-center text-[10px] font-bold text-zinc-400 py-1 uppercase tracking-wider">{name}</div>
          ))}
          {Array.from({ length: new Date(currYear, currMonth - 1, 1).getDay() }, (_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isInPeriod = day < payDay;
            const isPayDay = day === payDay;
            const isNextPeriod = day > payDay;
            const isSpending = spendingDays.includes(day);
            const spent = spendingByDOM.get(day) || 0;
            const isExceeded = isSpending && spent > dailyBudget;
            const isPartial = isSpending && spent > 0 && spent <= dailyBudget;
            return (
              <button key={day} onClick={() => handleToggleDay(day)}
                className={`relative flex flex-col items-center py-1.5 rounded-lg text-xs transition-all min-h-[56px] cursor-pointer border ${
                  isPayDay
                    ? "border-emerald-300 bg-emerald-50"
                    : isNextPeriod
                    ? "border-zinc-200/40 bg-zinc-50/50"
                    : "border-zinc-200"
                } ${
                  isSpending && !isPayDay
                    ? "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100"
                    : isPayDay
                    ? "hover:bg-emerald-100"
                    : "hover:bg-zinc-100"
                } ${isExceeded ? "ring-2 ring-red-300" : ""} ${isPartial ? "ring-2 ring-emerald-300" : ""}`}
              >
                <div className="flex items-center gap-0.5">
                  <span className={`font-bold text-[11px] ${isPayDay ? "text-emerald-700" : isSpending ? "" : "text-zinc-400"}`}>
                    {day}
                  </span>
                </div>
                {isPayDay && (
                  <span className="text-[6px] font-bold text-emerald-600 leading-tight">💰 PAGO</span>
                )}
                {isSpending && !isPayDay && (
                  <span className="text-[8px] text-amber-600 font-medium leading-tight mt-0.5">
                    {formatCurrency(dailyBudget)}
                  </span>
                )}
                {!isSpending && isInPeriod && (
                  <span className="text-[7px] text-zinc-300 font-medium leading-tight mt-0.5">—</span>
                )}
                {spent > 0 && (
                  <span className={`text-[8px] font-bold leading-tight mt-0.5 ${isExceeded ? "text-red-500" : "text-emerald-500"}`}>
                    {formatCurrency(spent)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[10px] text-zinc-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-50 border border-amber-200" /> Gasto programado</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-300" /> Día de pago</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-zinc-50/50 border border-zinc-200/40" /> Próximo período</span>
          {linkedAccount && (
            <>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded ring-2 ring-emerald-300 bg-white" /> Gastado (ok)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded ring-2 ring-red-300 bg-white" /> Excedido</span>
            </>
          )}
        </div>
      </div>

      {/* Spending Progress */}
      {linkedAccount && (
        <div>
          <button onClick={() => setShowProgress(!showProgress)}
            className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-3 hover:text-zinc-700 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Progreso vs Gastos Reales
            {showProgress ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showProgress && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-zinc-500">Total gastado ({payDay} {MONTH_SHORT[prevMonth - 1]} → {payDay} {MONTH_SHORT[currMonth - 1]})</span>
                  <span className="text-sm font-bold text-zinc-900">{formatCurrency(totalSpent)} de {formatCurrency(totalBudget)}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-zinc-200 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${spentPct > 100 ? "bg-red-500" : spentPct > 80 ? "bg-amber-400" : "bg-emerald-400"}`}
                    style={{ width: `${Math.min(spentPct, 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                  <span>{spentPct.toFixed(1)}% del presupuesto</span>
                  <span>{totalSpendingDays - new Set([...prevDayStrings, ...currDayStrings].filter(d => spendingByDate.has(d))).size} días sin gasto de {totalSpendingDays}</span>
                </div>
              </div>

              {weekProgress.some(w => w.weekSpent > 0) && (
                <div className="space-y-2">
                  {weekProgress.map(w => (
                    <div key={w.weekLabel} className="p-3 rounded-xl bg-white border border-zinc-200">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold text-zinc-500">{w.weekLabel}</span>
                        <span className="text-xs font-bold text-zinc-700">{formatCurrency(w.weekSpent)} de {formatCurrency(w.totalBudget)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${w.weekPct > 100 ? "bg-red-400" : w.weekPct > 80 ? "bg-amber-400" : "bg-emerald-400"}`}
                          style={{ width: `${Math.min(w.weekPct, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalSpent === 0 && (
                <p className="text-xs text-zinc-400 text-center py-2">
                  Aún no hay egresos registrados en {linkedAccount.name} para este período.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
