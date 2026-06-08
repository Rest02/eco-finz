"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { itemVariants } from "@/lib/animations";
import { CreditCard, CalendarDays, TrendingUp, Check, ChevronDown, ChevronUp, CheckSquare, Square, Tag, Save } from "lucide-react";
import { MonthlyProjection, Account } from "../../types/finance";
import { useTransactions } from "../../hooks/useTransactions";
import { useUpdateSpendingPlan, useUpdateExcludedTransactions } from "../../hooks/useMonthlyProjections";
import { useCategories } from "../../hooks/useCategories";
import type { Transaction } from "../../types/finance";
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

function createWeekEntry(start: Date, end: Date, budget: number): WeekInfo {
  const dateStrings: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dateStrings.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  const s = start;
  const e = end;
  return {
    weekLabel: `${s.getDate()} ${MONTH_SHORT[s.getMonth()]} - ${e.getDate()} ${MONTH_SHORT[e.getMonth()]}`,
    weekStart: start,
    weekEnd: end,
    dayCount: dateStrings.length,
    totalBudget: budget,
    dateStrings,
  };
}

function buildCalendarWeeks(
  prevYear: number, prevMonthNum: number,
  currYear: number, currMonth: number,
  payDay: number,
  totalBudget: number,
  numberOfWeeks: number
): WeekInfo[] {
  const startDate = new Date(prevYear, prevMonthNum - 1, payDay);
  const endDate = new Date(currYear, currMonth - 1, payDay);
  const weeklyBudget = totalBudget / numberOfWeeks;

  const weeks: WeekInfo[] = [];
  const cursor = new Date(startDate);

  // Week 1: prevPayDay → next Sunday
  const firstSun = new Date(cursor);
  firstSun.setDate(cursor.getDate() + (6 - cursor.getDay()));
  const w1End = firstSun > endDate ? new Date(endDate) : firstSun;
  weeks.push(createWeekEntry(cursor, w1End, weeklyBudget));

  // Remaining weeks: Mon → Sun (or Mon → currPayDay for the last)
  cursor.setTime(w1End.getTime());
  cursor.setDate(cursor.getDate() + 1);

  while (weeks.length < numberOfWeeks && cursor < endDate) {
    const weekEnd = new Date(cursor);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const actualEnd = weekEnd > endDate ? new Date(endDate) : weekEnd;
    weeks.push(createWeekEntry(cursor, actualEnd, weeklyBudget));
    cursor.setDate(cursor.getDate() + 7);
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
  const { mutate: saveExcluded, isPending: isSaving } = useUpdateExcludedTransactions();

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
  const [expandedWeekIdx, setExpandedWeekIdx] = useState<number | null>(null);
  const [deselectedTxIds, setDeselectedTxIds] = useState<Set<string>>(() => {
    const excluded = (projection as any).excludedTransactions;
    return excluded && Array.isArray(excluded)
      ? new Set<string>(excluded.map((e: any) => e.transactionId))
      : new Set<string>();
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [weekEgresoCatFilter, setWeekEgresoCatFilter] = useState<Record<number, string | null>>({});
  const [weekIngresoCatFilter, setWeekIngresoCatFilter] = useState<Record<number, string | null>>({});

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
    const firstSun = new Date(start);
    firstSun.setDate(start.getDate() + (6 - start.getDay()));
    if (firstSun >= end) return 1;
    let count = 1;
    const cur = new Date(firstSun);
    cur.setDate(cur.getDate() + 1);
    while (cur < end) {
      count++;
      cur.setDate(cur.getDate() + 7);
    }
    return count;
  }, [prevYear, prevMonth, currYear, currMonth, payDay]);

  const effectiveWeeks = customWeeks ?? maxWeeks;
  const weeklyBudget = effectiveWeeks > 0 ? totalBudget / effectiveWeeks : 0;

  const weeks = useMemo(
    () => buildCalendarWeeks(prevYear, prevMonth, currYear, currMonth, payDay, totalBudget, effectiveWeeks),
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

  const { data: categories = [] } = useCategories();

  // All transactions grouped by week index
  const transactionsByWeek = useMemo(() => {
    const map: Record<number, Transaction[]> = {};
    for (const tx of txsData?.data || []) {
      const iso = tx.date.slice(0, 10);
      for (let i = 0; i < weeks.length; i++) {
        if (weeks[i].dateStrings.includes(iso)) {
          if (!map[i]) map[i] = [];
          map[i].push(tx);
          break;
        }
      }
    }
    return map;
  }, [txsData, weeks]);

  // Separate expense and income maps
  const egresosByWeek = useMemo(() => {
    const map: Record<number, Transaction[]> = {};
    for (const [idx, txs] of Object.entries(transactionsByWeek)) {
      map[Number(idx)] = txs.filter(tx => !tx.isInflow);
    }
    return map;
  }, [transactionsByWeek]);

  const ingresosByWeek = useMemo(() => {
    const map: Record<number, Transaction[]> = {};
    for (const [idx, txs] of Object.entries(transactionsByWeek)) {
      map[Number(idx)] = txs.filter(tx => tx.isInflow);
    }
    return map;
  }, [transactionsByWeek]);

  // Per-week progress (net: egresos - ingresos)
  const weekProgress = useMemo(() => {
    return weeks.map((w, idx) => {
      const weekTxs = transactionsByWeek[idx] || [];
      const selectedTxs = weekTxs.filter(tx => !deselectedTxIds.has(tx.id));

      let egresoTotal = 0;
      let ingresoTotal = 0;

      if (selectedTxs.length > 0) {
        for (const tx of selectedTxs) {
          const amt = Math.abs(Number(tx.amount));
          if (tx.isInflow) ingresoTotal += amt;
          else egresoTotal += amt;
        }
      } else {
        // Fallback to raw expense data
        for (const iso of w.dateStrings) egresoTotal += spendingByDate.get(iso) || 0;
      }

      const netOutflow = egresoTotal - ingresoTotal;
      const weekPct = w.totalBudget > 0 ? Math.max(0, netOutflow) / w.totalBudget * 100 : 0;

      return { ...w, weekEgresos: egresoTotal, weekIngresos: ingresoTotal, weekNet: netOutflow, weekPct, weekAhorro: w.totalBudget - netOutflow };
    });
  }, [weeks, transactionsByWeek, deselectedTxIds, spendingByDate]);

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

  const getFilteredEgresos = useCallback((weekIdx: number) => {
    const txs = egresosByWeek[weekIdx] || [];
    const catId = weekEgresoCatFilter[weekIdx];
    return catId ? txs.filter(tx => tx.categoryId === catId) : txs;
  }, [egresosByWeek, weekEgresoCatFilter]);

  const getFilteredIngresos = useCallback((weekIdx: number) => {
    const txs = ingresosByWeek[weekIdx] || [];
    const catId = weekIngresoCatFilter[weekIdx];
    return catId ? txs.filter(tx => tx.categoryId === catId) : txs;
  }, [ingresosByWeek, weekIngresoCatFilter]);

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

  const handleSaveExclusions = useCallback(() => {
    saveExcluded(
      { id: projection.id, excludedTransactionIds: Array.from(deselectedTxIds) },
      {
        onSuccess: () => {
          toast.success("Movimientos guardados");
          setHasUnsavedChanges(false);
        },
        onError: () => toast.error("Error al guardar los movimientos"),
      }
    );
  }, [projection.id, deselectedTxIds, saveExcluded]);

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

  const handleToggleTx = useCallback((txId: string) => {
    setDeselectedTxIds(prev => {
      const next = new Set(prev);
      if (next.has(txId)) next.delete(txId);
      else next.add(txId);
      return next;
    });
    setHasUnsavedChanges(true);
  }, []);

  const handleSelectAll = useCallback((weekIdx: number, type: 'egreso' | 'ingreso', select: boolean) => {
    const source = type === 'egreso' ? egresosByWeek : ingresosByWeek;
    const txs = source[weekIdx] || [];
    setDeselectedTxIds(prev => {
      const next = new Set(prev);
      for (const tx of txs) {
        if (select) next.delete(tx.id);
        else next.add(tx.id);
      }
      return next;
    });
    setHasUnsavedChanges(true);
  }, [egresosByWeek, ingresosByWeek]);

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
        <div className="flex items-center gap-3">
          {linkedAccount && hasUnsavedChanges && (
            <button
              onClick={handleSaveExclusions}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-xs font-bold transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          )}
          <span className="text-lg font-black text-amber-600">{formatCurrency(totalBudget)}</span>
        </div>
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
          <div className="space-y-3">
            {weekProgress.map((w, idx) => {
              const isExpanded = expandedWeekIdx === idx;
              const weekTxs = transactionsByWeek[idx] || [];
              const weekEgresosTxs = egresosByWeek[idx] || [];
              const weekIngresosTxs = ingresosByWeek[idx] || [];
              const filteredEgresos = getFilteredEgresos(idx);
              const filteredIngresos = getFilteredIngresos(idx);
              const allEgresosSelected = weekEgresosTxs.length > 0 && weekEgresosTxs.every(tx => !deselectedTxIds.has(tx.id));
              const allIngresosSelected = weekIngresosTxs.length > 0 && weekIngresosTxs.every(tx => !deselectedTxIds.has(tx.id));
              const selectedEgresoSum = weekEgresosTxs
                .filter(tx => !deselectedTxIds.has(tx.id))
                .reduce((s, tx) => s + Math.abs(Number(tx.amount)), 0);
              const selectedIngresoSum = weekIngresosTxs
                .filter(tx => !deselectedTxIds.has(tx.id))
                .reduce((s, tx) => s + Math.abs(Number(tx.amount)), 0);
              const netSum = selectedEgresoSum - selectedIngresoSum;
              const hasTransactions = weekTxs.length > 0;
              return (
                <div className="relative p-3 rounded-xl bg-zinc-50 border border-zinc-200/60">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{w.weekLabel}</p>
                      <p className="text-base font-black text-zinc-900">{formatCurrency(w.totalBudget)}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {w.dayCount} día{w.dayCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {linkedAccount && hasTransactions && (
                      <button onClick={() => setExpandedWeekIdx(isExpanded ? null : idx)}
                        className="shrink-0 p-1 rounded-lg hover:bg-zinc-200/60 transition-colors text-zinc-400 hover:text-zinc-700"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  {linkedAccount && (w.weekEgresos > 0 || w.weekIngresos > 0) && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                        {w.weekNet < 0 ? (
                          <div className="h-full rounded-full bg-emerald-400" style={{ width: '100%' }} />
                        ) : (
                          <div className={`h-full rounded-full transition-all duration-300 ${
                            w.weekPct > 100 ? "bg-red-500" : w.weekPct > 80 ? "bg-amber-400" : "bg-emerald-400"
                          }`} style={{ width: `${Math.min(w.weekPct, 100)}%` }} />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className={`text-[10px] ${w.weekNet < 0 ? 'text-emerald-600 font-bold' : 'text-zinc-400'}`}>
                          {w.weekNet < 0
                            ? `Excedente +${formatCurrency(Math.abs(w.weekNet))}`
                            : `${formatCurrency(w.weekNet)} neto de ${formatCurrency(w.totalBudget)}`
                          }
                        </p>
                        {w.weekIngresos > 0 && (
                          <span className="text-[10px] font-bold text-emerald-500">+{formatCurrency(w.weekIngresos)}</span>
                        )}
                      </div>
                      {w.weekAhorro > 0 && (
                        <p className="text-[10px] font-bold text-emerald-600 mt-1">
                          🏦 {formatCurrency(w.weekAhorro)} ahorrado
                        </p>
                      )}
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                  {isExpanded && linkedAccount && hasTransactions && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-zinc-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* --- Egresos Column --- */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-3 h-3 text-red-400" />
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Egresos</span>
                            <select
                              value={weekEgresoCatFilter[idx] || ''}
                              onChange={e => setWeekEgresoCatFilter(prev => ({ ...prev, [idx]: e.target.value || null }))}
                              className="text-[11px] px-2 py-1 rounded-lg border border-zinc-200 bg-white text-zinc-700 outline-none focus:ring-2 focus:ring-amber-200 ml-auto"
                            >
                              <option value="">Todas las categorías</option>
                              {categories.filter(c => c.type === 'EGRESO').map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center justify-between mb-1">
                            <button
                              onClick={() => handleSelectAll(idx, 'egreso', !allEgresosSelected)}
                              className="text-[10px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors flex items-center gap-1"
                            >
                              {allEgresosSelected ? (
                                <><Square className="w-3 h-3" /> Deseleccionar todo</>
                              ) : (
                                <><CheckSquare className="w-3 h-3" /> Seleccionar todo</>
                              )}
                            </button>
                          </div>
                          <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
                            {filteredEgresos.length === 0 ? (
                              <p className="text-xs text-zinc-400 text-center py-4">Sin egresos</p>
                            ) : filteredEgresos.map(tx => (
                              <label key={tx.id}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={!deselectedTxIds.has(tx.id)}
                                  onChange={() => handleToggleTx(tx.id)}
                                  className="accent-amber-500 w-3.5 h-3.5 shrink-0"
                                />
                                <span className="flex-1 text-xs text-zinc-700 truncate min-w-0">{tx.description}</span>
                                {tx.category && (
                                  <span className="text-[9px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-full shrink-0 uppercase tracking-tighter">
                                    {tx.category.name}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-zinc-700 shrink-0 tabular-nums">-{formatCurrency(Math.abs(Number(tx.amount)))}</span>
                              </label>
                            ))}
                          </div>
                          {weekEgresosTxs.length > 0 && (
                            <div className="flex justify-between pt-2 border-t border-zinc-200 text-xs font-bold text-zinc-700 mt-1">
                              <span>Total egresos</span>
                              <span>{formatCurrency(selectedEgresoSum)}</span>
                            </div>
                          )}
                        </div>

                        {/* --- Ingresos Column --- */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Ingresos</span>
                            <select
                              value={weekIngresoCatFilter[idx] || ''}
                              onChange={e => setWeekIngresoCatFilter(prev => ({ ...prev, [idx]: e.target.value || null }))}
                              className="text-[11px] px-2 py-1 rounded-lg border border-zinc-200 bg-white text-zinc-700 outline-none focus:ring-2 focus:ring-amber-200 ml-auto"
                            >
                              <option value="">Todas las categorías</option>
                              {categories.filter(c => c.type === 'INGRESO').map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center justify-between mb-1">
                            <button
                              onClick={() => handleSelectAll(idx, 'ingreso', !allIngresosSelected)}
                              className="text-[10px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors flex items-center gap-1"
                            >
                              {allIngresosSelected ? (
                                <><Square className="w-3 h-3" /> Deseleccionar todo</>
                              ) : (
                                <><CheckSquare className="w-3 h-3" /> Seleccionar todo</>
                              )}
                            </button>
                          </div>
                          <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
                            {filteredIngresos.length === 0 ? (
                              <p className="text-xs text-zinc-400 text-center py-4">Sin ingresos</p>
                            ) : filteredIngresos.map(tx => (
                              <label key={tx.id}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={!deselectedTxIds.has(tx.id)}
                                  onChange={() => handleToggleTx(tx.id)}
                                  className="accent-emerald-500 w-3.5 h-3.5 shrink-0"
                                />
                                <span className="flex-1 text-xs text-zinc-700 truncate min-w-0">{tx.description}</span>
                                {tx.category && (
                                  <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0 uppercase tracking-tighter">
                                    {tx.category.name}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-emerald-600 shrink-0 tabular-nums">+{formatCurrency(Math.abs(Number(tx.amount)))}</span>
                              </label>
                            ))}
                          </div>
                          {weekIngresosTxs.length > 0 && (
                            <div className="flex justify-between pt-2 border-t border-zinc-200 text-xs font-bold text-emerald-600 mt-1">
                              <span>Total ingresos</span>
                              <span>+{formatCurrency(selectedIngresoSum)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Net footer */}
                      <div className={`flex justify-between pt-3 mt-3 border-t border-zinc-200 text-xs font-bold ${
                        netSum > w.totalBudget ? 'text-red-500' : netSum <= 0 ? 'text-emerald-600' : 'text-zinc-700'
                      }`}>
                        <span>Neto semanal</span>
                        <span>
                          {formatCurrency(netSum)} de {formatCurrency(w.totalBudget)}
                          {selectedIngresoSum > 0 && (
                            <span className="text-emerald-500 ml-1">(+{formatCurrency(selectedIngresoSum)})</span>
                          )}
                        </span>
                      </div>
                      {w.weekAhorro > 0 && (
                        <div className="flex justify-between pt-1 text-[10px] font-bold text-emerald-600">
                          <span>🏦 Ahorro de la semana</span>
                          <span>+{formatCurrency(w.weekAhorro)}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                  {isExpanded && linkedAccount && !hasTransactions && (
                    <motion.div
                      key="no-tx"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-zinc-200"
                    >
                      <p className="text-xs text-zinc-400 text-center py-4">No hay movimientos en esta semana</p>
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              );
            })}
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

              {weekProgress.some(w => w.weekEgresos > 0 || w.weekIngresos > 0) && (
                <div className="space-y-2">
                  {weekProgress.map(w => (w.weekEgresos > 0 || w.weekIngresos > 0) && (
                    <div key={w.weekLabel} className="p-3 rounded-xl bg-white border border-zinc-200">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold text-zinc-500">{w.weekLabel}</span>
                        <span className="text-xs font-bold text-zinc-700">{formatCurrency(w.weekNet)} neto de {formatCurrency(w.totalBudget)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                        {w.weekNet < 0 ? (
                          <div className="h-full rounded-full bg-emerald-400" style={{ width: '100%' }} />
                        ) : (
                          <div className={`h-full rounded-full transition-all duration-300 ${w.weekPct > 100 ? "bg-red-400" : w.weekPct > 80 ? "bg-amber-400" : "bg-emerald-400"}`}
                            style={{ width: `${Math.min(w.weekPct, 100)}%` }} />
                        )}
                      </div>
                      {w.weekAhorro > 0 && (
                        <p className="text-[10px] font-bold text-emerald-500 mt-1">🏦 {formatCurrency(w.weekAhorro)} ahorrado</p>
                      )}
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
