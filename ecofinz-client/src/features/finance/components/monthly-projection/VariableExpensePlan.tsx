"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { itemVariants } from "@/lib/animations";
import { CreditCard, CalendarDays, Check, ChevronDown, ChevronUp, CheckSquare, Square, Tag, Save, AlertTriangle, ArrowRight, Trash2, Pencil, Clock } from "lucide-react";
import { MonthlyProjection, Account, WeekAdjustment } from "../../types/finance";
import { useTransactions } from "../../hooks/useTransactions";
import { useUpdateSpendingPlan, useUpdateExcludedTransactions, useSaveWeeklyAdjustments } from "../../hooks/useMonthlyProjections";
import { useCategories } from "../../hooks/useCategories";
import type { Transaction } from "../../types/finance";
import toast from "react-hot-toast";

const MONTH_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

// --- Helpers ---

function getPrevMonth(year: number, month: number) {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
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
  const payDay = projection.payDay;
  const pm = getPrevMonth(currYear, currMonth);
  const prevYear = pm.year;
  const prevMonth = pm.month;

  const { mutate: updateSpendingPlan } = useUpdateSpendingPlan();
  const { mutate: saveExcluded, isPending: isSaving } = useUpdateExcludedTransactions();

  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(
    projection.variableExpensesAccountId || undefined
  );
  const [customWeeks, setCustomWeeks] = useState<number | null>(
    projection.variableExpenseWeeks ?? null
  );
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [expandedWeekIdx, setExpandedWeekIdx] = useState<number | null>(null);
  const [deselectedTxIds, setDeselectedTxIds] = useState<Set<string>>(() => {
    const excluded = (projection as any).excludedTransactions;
    return excluded && Array.isArray(excluded)
      ? new Set<string>(excluded.map((e: any) => e.transactionId))
      : new Set<string>();
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { mutate: saveAdjustments, isPending: isSavingAdjustments } = useSaveWeeklyAdjustments();
  const adjustTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [adjustments, setAdjustments] = useState<WeekAdjustment[]>(() => {
    const raw = (projection as any).weeklyAdjustments;
    return raw && Array.isArray(raw) ? raw : [];
  });

  const [newAdjSource, setNewAdjSource] = useState<number | null>(null);
  const [newAdjTarget, setNewAdjTarget] = useState<number | null>(null);
  const [newAdjAmount, setNewAdjAmount] = useState("");
  const [editingAdjId, setEditingAdjId] = useState<string | null>(null);
  const [editAdjTarget, setEditAdjTarget] = useState<number | null>(null);
  const [editAdjAmount, setEditAdjAmount] = useState("");

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

  const incomingDeductions = useMemo(() => {
    const map: Record<number, number> = {};
    for (const adj of adjustments) {
      map[adj.targetWeekIndex] = (map[adj.targetWeekIndex] || 0) + adj.amount;
    }
    return map;
  }, [adjustments]);

  const outgoingAssigned = useMemo(() => {
    const map: Record<number, number> = {};
    for (const adj of adjustments) {
      map[adj.sourceWeekIndex] = (map[adj.sourceWeekIndex] || 0) + adj.amount;
    }
    return map;
  }, [adjustments]);

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
      const baseBudget = w.totalBudget;
      const deduction = incomingDeductions[idx] || 0;
      const adjustedBudget = baseBudget - deduction;
      const effectiveBudget = Math.max(0, adjustedBudget);
      const weekPct = effectiveBudget > 0 ? Math.max(0, netOutflow) / effectiveBudget * 100 : 0;
      const weekAhorro = effectiveBudget - netOutflow;
      const excess = Math.max(0, netOutflow - baseBudget);

      return { ...w, weekEgresos: egresoTotal, weekIngresos: ingresoTotal, weekNet: netOutflow, weekPct, weekAhorro, baseBudget, adjustedBudget: effectiveBudget, deduction, excess };
    });
  }, [weeks, transactionsByWeek, deselectedTxIds, spendingByDate, incomingDeductions]);

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

  // --- Handlers ---

  const handleSelectAccount = useCallback(
    (accountId: string) => {
      setSelectedAccountId(accountId);
      setShowAccountSelector(false);
      updateSpendingPlan(
        {
          id: projection.id,
          data: {
            variableExpensesAccountId: accountId,
          },
        },
        {
          onSuccess: () => toast.success("Cuenta vinculada"),
          onError: () => toast.error("Error al vincular cuenta"),
        }
      );
    },
    [projection.id, updateSpendingPlan]
  );

  const handleRemoveAccount = useCallback(() => {
    setSelectedAccountId(undefined);
    updateSpendingPlan(
      {
        id: projection.id,
        data: {
          variableExpensesAccountId: "",
        },
      },
      { onError: () => toast.error("Error al desvincular cuenta") }
    );
  }, [projection.id, updateSpendingPlan]);

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

  // --- Adjustment helpers ---

  const persistAdjustments = useCallback((next: WeekAdjustment[]) => {
    if (adjustTimerRef.current) clearTimeout(adjustTimerRef.current);
    adjustTimerRef.current = setTimeout(() => {
      saveAdjustments(
        {
          id: projection.id,
          adjustments: next.map(a => ({
            sourceWeekIndex: a.sourceWeekIndex,
            targetWeekIndex: a.targetWeekIndex,
            amount: a.amount,
          })),
        },
        {
          onError: () => toast.error("Error al guardar ajustes de semanas"),
        }
      );
    }, 500);
  }, [projection.id, saveAdjustments]);

  const handleAddAdjustment = useCallback((sourceIdx: number) => {
    const target = newAdjTarget;
    const amount = parseFloat(newAdjAmount);
    if (target === null || target === sourceIdx || !amount || amount <= 0) {
      toast.error("Selecciona una semana destino y un monto válido");
      return;
    }
    const maxAvailable = Math.max(0, weekProgress[sourceIdx]?.excess || 0) - (outgoingAssigned[sourceIdx] || 0);
    if (amount > maxAvailable) {
      toast.error(`Solo puedes asignar hasta $${Math.round(maxAvailable).toLocaleString("es-CL")}`);
      return;
    }
    const next = [...adjustments, {
      id: crypto.randomUUID(),
      projectionId: projection.id,
      sourceWeekIndex: sourceIdx,
      targetWeekIndex: target,
      amount,
    }];
    setAdjustments(next);
    persistAdjustments(next);
    setNewAdjTarget(null);
    setNewAdjAmount("");
    setNewAdjSource(null);
  }, [adjustments, newAdjTarget, newAdjAmount, weekProgress, outgoingAssigned, projection.id, persistAdjustments]);

  const handleRemoveAdjustment = useCallback((adjId: string) => {
    const next = adjustments.filter(a => a.id !== adjId);
    setAdjustments(next);
    persistAdjustments(next);
  }, [adjustments, persistAdjustments]);

  const handleUpdateAdjustment = useCallback((adjId: string) => {
    const adj = adjustments.find(a => a.id === adjId);
    if (!adj) return;
    const target = editAdjTarget;
    const amount = parseFloat(editAdjAmount);
    if (target === null || target === adj.sourceWeekIndex || !amount || amount <= 0) {
      toast.error("Selecciona una semana destino y un monto válido");
      return;
    }
    const maxAvailable = Math.max(0, weekProgress[adj.sourceWeekIndex]?.excess || 0) - (outgoingAssigned[adj.sourceWeekIndex] || 0) + adj.amount;
    if (amount > maxAvailable) {
      toast.error(`Solo puedes asignar hasta $${Math.round(maxAvailable).toLocaleString("es-CL")}`);
      return;
    }
    const next = adjustments.map(a => a.id === adjId ? { ...a, targetWeekIndex: target, amount } : a);
    setAdjustments(next);
    persistAdjustments(next);
    setEditingAdjId(null);
    setEditAdjTarget(null);
    setEditAdjAmount("");
  }, [adjustments, editAdjTarget, editAdjAmount, weekProgress, outgoingAssigned, persistAdjustments]);

  const startEditing = useCallback((adj: WeekAdjustment) => {
    setEditingAdjId(adj.id);
    setEditAdjTarget(adj.targetWeekIndex);
    setEditAdjAmount(String(adj.amount));
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingAdjId(null);
    setEditAdjTarget(null);
    setEditAdjAmount("");
  }, []);

  // Sync adjustments from server after refetch
  useEffect(() => {
    const raw = (projection as any)?.weeklyAdjustments;
    if (raw && Array.isArray(raw) && raw.length > 0) {
      setAdjustments(raw);
    }
  }, [(projection as any)?.weeklyAdjustments]);

  // Reset adjustments when weeks change
  useEffect(() => {
    const maxIdx = weeks.length - 1;
    const invalid = adjustments.some(a => a.sourceWeekIndex > maxIdx || a.targetWeekIndex > maxIdx);
    if (invalid) {
      setAdjustments([]);
      persistAdjustments([]);
    }
  }, [weeks.length]);

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
                <div key={w.weekLabel} className="relative p-3 rounded-xl bg-zinc-50 border border-zinc-200/60">
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
                            : `${formatCurrency(w.weekNet)} neto de ${formatCurrency(w.adjustedBudget)}`
                          }
                        </p>
                        {w.weekIngresos > 0 && (
                          <span className="text-[10px] font-bold text-emerald-500">+{formatCurrency(w.weekIngresos)}</span>
                        )}
                      </div>
                      {w.deduction > 0 && (
                        <p className="text-[10px] font-bold text-amber-600 mt-1">
                          🎯 Presupuesto ajustado: {formatCurrency(w.adjustedBudget)}
                          <span className="text-zinc-400 font-normal"> ({formatCurrency(w.deduction)} descontado de semanas anteriores)</span>
                        </p>
                      )}
                      {w.weekAhorro > 0 && (
                        <p className="text-[10px] font-bold text-emerald-600 mt-1">
                          🏦 {formatCurrency(w.weekAhorro)} ahorrado
                        </p>
                      )}
                    </div>
                  )}
                  {/* --- Week Adjustments Section --- */}
                  {linkedAccount && (
                    <div className="mt-3 space-y-2">
                      {/* Incoming adjustments display */}
                      {w.deduction > 0 && (
                        <div className="px-2.5 py-2 rounded-lg bg-amber-50 border border-amber-200">
                          <p className="text-[10px] font-bold text-amber-700">Ajustes entrantes -{formatCurrency(w.deduction)}</p>
                          {adjustments.filter(a => a.targetWeekIndex === idx).map(adj => {
                            const srcWeek = weekProgress[adj.sourceWeekIndex];
                            return (
                              <div key={adj.id} className="flex items-center text-[10px] text-zinc-600 mt-1">
                                <span>-{formatCurrency(adj.amount)} de {srcWeek?.weekLabel || `Semana ${adj.sourceWeekIndex + 1}`}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Source: overspend → create adjustment */}
                      {w.excess > 0 && idx < weeks.length - 1 && (
                        <div className="px-2.5 py-2 rounded-lg bg-red-50 border border-red-200">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span className="text-[10px] font-bold text-red-600">
                              Exceso: {formatCurrency(w.excess)}
                            </span>
                          </div>

                          {/* Existing outgoing adjustments */}
                          {adjustments.filter(a => a.sourceWeekIndex === idx).map(adj => {
                            const isEditing = editingAdjId === adj.id;
                            return (
                              <div key={adj.id} className="flex items-center gap-1 mt-1 text-[10px] text-zinc-600">
                                {isEditing ? (
                                  <>
                                    <span className="text-zinc-400 shrink-0">-</span>
                                    <input
                                      type="number"
                                      value={editAdjAmount}
                                      onChange={e => setEditAdjAmount(e.target.value)}
                                      className="w-20 px-1.5 py-0.5 rounded border border-zinc-200 text-[10px] outline-none focus:ring-1 focus:ring-amber-200"
                                    />
                                    <span className="text-zinc-400">→</span>
                                    <select
                                      value={editAdjTarget ?? adj.targetWeekIndex}
                                      onChange={e => setEditAdjTarget(Number(e.target.value))}
                                      className="text-[10px] px-1 py-0.5 rounded border border-zinc-200 outline-none"
                                    >
                                      {weeks.map((_, wi) =>
                                        wi > adj.sourceWeekIndex ? (
                                          <option key={wi} value={wi}>Semana {wi + 1}</option>
                                        ) : null
                                      )}
                                    </select>
                                    <button onClick={() => handleUpdateAdjustment(adj.id)} className="text-emerald-600 hover:text-emerald-700 font-bold">
                                      ✓
                                    </button>
                                    <button onClick={cancelEditing} className="text-zinc-400 hover:text-zinc-600">✕</button>
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight className="w-3 h-3 text-amber-500" />
                                    <span>-{formatCurrency(adj.amount)} → Semana {adj.targetWeekIndex + 1}</span>
                                    <button onClick={() => startEditing(adj)} className="text-zinc-400 hover:text-zinc-600 ml-auto">
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => handleRemoveAdjustment(adj.id)} className="text-red-400 hover:text-red-600">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </>
                                )}
                              </div>
                            );
                          })}

                          {/* Assign new adjustment form */}
                          {newAdjSource === idx ? (
                            <div className="flex items-center gap-1 mt-1.5">
                              <input
                                type="number"
                                placeholder="Monto"
                                value={newAdjAmount}
                                onChange={e => setNewAdjAmount(e.target.value)}
                                className="w-20 px-1.5 py-0.5 rounded border border-zinc-200 text-[10px] outline-none focus:ring-1 focus:ring-amber-200"
                              />
                              <span className="text-[10px] text-zinc-400">→</span>
                              <select
                                value={newAdjTarget ?? ""}
                                onChange={e => setNewAdjTarget(e.target.value ? Number(e.target.value) : null)}
                                className="text-[10px] px-1 py-0.5 rounded border border-zinc-200 outline-none"
                              >
                                <option value="">Semana...</option>
                                {weeks.map((_, wi) =>
                                  wi > idx ? (
                                    <option key={wi} value={wi}>Semana {wi + 1}</option>
                                  ) : null
                                )}
                              </select>
                              <button
                                onClick={() => handleAddAdjustment(idx)}
                                className="text-[10px] font-bold text-white bg-amber-500 hover:bg-amber-600 px-2 py-0.5 rounded transition-colors"
                              >
                                Asignar
                              </button>
                              <button
                                onClick={() => { setNewAdjSource(null); setNewAdjTarget(null); setNewAdjAmount(""); }}
                                className="text-[10px] text-zinc-400 hover:text-zinc-600"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setNewAdjSource(idx)}
                              className="flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:text-amber-700 mt-1 transition-colors"
                            >
                              <ArrowRight className="w-3 h-3" /> Asignar a otra semana
                            </button>
                          )}

                          {/* Pending display */}
                          {(outgoingAssigned[idx] || 0) < w.excess && w.excess > 0 && (
                            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-zinc-400">
                              <Clock className="w-3 h-3" />
                              <span>Pendiente por asignar: {formatCurrency(w.excess - (outgoingAssigned[idx] || 0))}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Last week overspend - can't assign */}
                      {w.excess > 0 && idx === weeks.length - 1 && (
                        <div className="px-2.5 py-2 rounded-lg bg-red-50 border border-red-200">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span className="text-[10px] font-bold text-red-600">
                              Exceso: {formatCurrency(w.excess)}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-1">
                            No hay semana siguiente para descontar. Considera ajustar el % de gastos variables.
                          </p>
                        </div>
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
                        netSum > w.adjustedBudget ? 'text-red-500' : netSum <= 0 ? 'text-emerald-600' : 'text-zinc-700'
                      }`}>
                        <span>Neto semanal</span>
                        <span>
                          {formatCurrency(netSum)} de {formatCurrency(w.adjustedBudget)}
                          {w.deduction > 0 && (
                            <span className="text-amber-500 text-[10px] ml-1">({formatCurrency(w.totalBudget)} - {formatCurrency(w.deduction)})</span>
                          )}
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

      {/* --- Adjustments Summary --- */}
      {adjustments.length > 0 && linkedAccount && (
        <div className="mb-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <h4 className="text-xs font-bold text-zinc-500 flex items-center gap-1.5 mb-3">
            <ArrowRight className="w-3.5 h-3.5" />
            Resumen de Ajustes entre Semanas
          </h4>
          <div className="space-y-1.5">
            {adjustments.map(adj => {
              const src = weekProgress[adj.sourceWeekIndex];
              const tgt = weekProgress[adj.targetWeekIndex];
              return (
                <div key={adj.id} className="flex items-center justify-between text-[11px] text-zinc-600">
                  <span>
                    <span className="font-bold text-zinc-700">{src?.weekLabel || `Semana ${adj.sourceWeekIndex + 1}`}</span>
                    <ArrowRight className="w-3 h-3 inline mx-1 text-amber-400" />
                    <span className="font-bold text-zinc-700">{tgt?.weekLabel || `Semana ${adj.targetWeekIndex + 1}`}</span>
                  </span>
                  <span className="font-bold text-red-400">-{formatCurrency(adj.amount)}</span>
                </div>
              );
            })}
          </div>

          {weekProgress.some((w, i) => w.excess > 0 && (outgoingAssigned[i] || 0) < w.excess) && (
            <div className="mt-2 pt-2 border-t border-zinc-200">
              <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Excesos pendientes por asignar:
              </p>
              {weekProgress.map((w, i) => {
                const pending = w.excess - (outgoingAssigned[i] || 0);
                return pending > 0 ? (
                  <p key={i} className="text-[10px] text-zinc-500 ml-4">
                    {w.weekLabel}: {formatCurrency(pending)} sin asignar
                  </p>
                ) : null;
              })}
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-zinc-200 text-[10px] text-zinc-400 flex items-center justify-between">
            <span>Presupuesto total original: {formatCurrency(totalBudget)}</span>
            <span className="font-bold text-zinc-600">
              Ajustado: {formatCurrency(weekProgress.reduce((s, w) => s + w.adjustedBudget, 0))}
            </span>
          </div>
        </div>
      )}

    </motion.div>
  );
}
