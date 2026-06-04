"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { IncomeSelector } from "./IncomeSelector";
import { FixedExpenseSelector } from "./FixedExpenseSelector";
import { CardPaymentSelector } from "./CardPaymentSelector";
import { CalendarRange, Wallet, CreditCard, PiggyBank, Sliders, Calculator, Save } from "lucide-react";
import { MonthlyProjection } from "../../types/finance";
import { useAccounts } from "../../hooks/useAccounts";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface MonthlyProjectionFormProps {
  initialData?: MonthlyProjection;
  onSave: (data: {
    name: string;
    period: string;
    payDay: number;
    savingsPercentage: number;
    variableExpensesPercentage: number;
    incomeSnapshot: { name: string; amount: number }[];
    fixedExpenseSnapshot: { name: string; amount: number }[];
    cardPaymentSnapshot: { name: string; amount: number }[];
  }) => void;
  isSaving?: boolean;
}

export function MonthlyProjectionForm({ initialData, onSave, isSaving }: MonthlyProjectionFormProps) {
  const now = new Date();
  const [name, setName] = useState(initialData?.name || "");
  const [month, setMonth] = useState(initialData ? parseInt(initialData.period.split("-")[1]) : now.getMonth() + 1);
  const [year, setYear] = useState(initialData ? parseInt(initialData.period.split("-")[0]) : now.getFullYear());
  const [payDay, setPayDay] = useState(initialData?.payDay || 15);
  const [savingsPercentage, setSavingsPercentage] = useState(initialData?.savingsPercentage || 20);
  const [variablePercentage, setVariablePercentage] = useState(initialData?.variableExpensesPercentage || 25);
  const normalizedIncomes = initialData?.incomeSnapshot?.map(i => ({ name: i.name, amount: Number(i.amount) })) || [];
  const normalizedExpenses = initialData?.fixedExpenseSnapshot?.map(i => ({ name: i.name, amount: Number(i.amount) })) || [];
  const normalizedPayments = initialData?.cardPaymentSnapshot?.map(i => ({ name: i.name, amount: Number(i.amount) })) || [];

  const [incomes, setIncomes] = useState<{ name: string; amount: number }[]>(normalizedIncomes);
  const [expenses, setExpenses] = useState<{ name: string; amount: number }[]>(normalizedExpenses);
  const [payments, setPayments] = useState<{ name: string; amount: number }[]>(normalizedPayments);

  const { data: accounts = [] } = useAccounts();
  const savingsAccounts = accounts.filter(a => a.isSavingsAccount);
  const currentSavingsBalance = savingsAccounts.reduce((s, a) => s + a.balance, 0);

  const totalIncome = useMemo(() => incomes.reduce((s, i) => s + i.amount, 0), [incomes]);
  const totalExpenses = useMemo(() => expenses.reduce((s, i) => s + i.amount, 0), [expenses]);
  const totalPayments = useMemo(() => payments.reduce((s, i) => s + i.amount, 0), [payments]);
  const availableMoney = Math.max(0, totalIncome - totalExpenses - totalPayments);
  const projectedSavings = availableMoney * (savingsPercentage / 100);
  const projectedVariable = availableMoney * (variablePercentage / 100);
  const remaining = Math.max(0, availableMoney - projectedSavings - projectedVariable);

  const formattedPeriod = `${year}-${String(month).padStart(2, "0")}`;
  const autoName = name || `Proyección ${MONTHS[month - 1]} ${year}`;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  const handleSave = () => {
    onSave({
      name: autoName,
      period: formattedPeriod,
      payDay,
      savingsPercentage,
      variableExpensesPercentage: variablePercentage,
      incomeSnapshot: incomes,
      fixedExpenseSnapshot: expenses,
      cardPaymentSnapshot: payments,
    });
  };

  const canSave = incomes.length > 0 && payDay >= 1 && payDay <= 31;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
          <CalendarRange className="w-6 h-6" />
          {initialData ? "Editar Proyección" : "Nueva Proyección Mensual"}
        </h1>
        <p className="text-sm text-zinc-500 font-medium mt-0.5">
          Proyecta tus finanzas del mes seleccionando ingresos, gastos fijos y pagos de tarjetas.
        </p>
      </motion.div>

      {/* ❶ Nombre y Período */}
      <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
        <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
          <CalendarRange className="w-4 h-4" />
          ❶ Nombre y Período
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={autoName}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Mes</label>
            <select
              value={month}
              onChange={e => setMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Año</label>
            <input
              type="number"
              value={year}
              onChange={e => setYear(parseInt(e.target.value))}
              min={2024}
              max={2099}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        </div>
      </motion.div>

      {/* ❷ Ingresos */}
      <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
        <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          ❷ Ingresos
        </h3>
        <p className="text-xs text-zinc-400 mb-3">Selecciona una cuenta y rango de fechas para ver tus ingresos. Marca los que quieras incluir.</p>
        <IncomeSelector selectedIncomes={incomes} onChange={setIncomes} />
      </motion.div>

      {/* ❸ Gastos Fijos */}
      <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
        <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          ❸ Gastos Fijos
        </h3>
        <p className="text-xs text-zinc-400 mb-3">Crea nuevos gastos fijos o selecciona de los existentes. Los nuevos se guardarán automáticamente.</p>
        <FixedExpenseSelector selectedExpenses={expenses} onChange={setExpenses} />
      </motion.div>

      {/* ❹ Pagos de Tarjetas */}
      <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
        <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          ❹ Pagos de Tarjetas
        </h3>
        <p className="text-xs text-zinc-400 mb-3">Agrega los pagos de tarjetas de crédito que planeas hacer este mes.</p>
        <CardPaymentSelector
          selectedPayments={payments}
          onChange={setPayments}
          projectionMonth={month}
          projectionYear={year}
        />
      </motion.div>

      {/* ❺ Configuración */}
      <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
        <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4" />
          ❺ Configuración
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Día de pago</label>
            <input
              type="number"
              value={payDay}
              onChange={e => setPayDay(parseInt(e.target.value) || 1)}
              min={1}
              max={31}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">% Ahorro: {savingsPercentage}%</label>
            <input
              type="range"
              value={savingsPercentage}
              onChange={e => setSavingsPercentage(parseInt(e.target.value))}
              min={0}
              max={100}
              className="w-full accent-black"
            />
            <div className="flex justify-between text-xs text-zinc-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">% Gastos Variables: {variablePercentage}%</label>
            <input
              type="range"
              value={variablePercentage}
              onChange={e => setVariablePercentage(parseInt(e.target.value))}
              min={0}
              max={100}
              className="w-full accent-black"
            />
            <div className="flex justify-between text-xs text-zinc-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ❻ Resultados */}
      <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6">
        <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          ❻ Resultados
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between py-2 px-3 rounded-xl bg-zinc-50">
              <span className="text-xs font-medium text-zinc-500">Ingresos totales</span>
              <span className="text-sm font-bold text-emerald-600">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-xl bg-rose-50">
              <span className="text-xs font-medium text-rose-600">- Gastos fijos</span>
              <span className="text-sm font-bold text-rose-600">- {formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-xl bg-blue-50">
              <span className="text-xs font-medium text-blue-600">- Pagos tarjetas</span>
              <span className="text-sm font-bold text-blue-600">- {formatCurrency(totalPayments)}</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-xl bg-zinc-100 border border-zinc-200">
              <span className="text-xs font-bold text-zinc-700">Dinero disponible real</span>
              <span className="text-sm font-bold text-zinc-900">{formatCurrency(availableMoney)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between py-2 px-3 rounded-xl bg-emerald-50">
              <span className="text-xs font-medium text-emerald-600">- Ahorro ({savingsPercentage}%)</span>
              <span className="text-sm font-bold text-emerald-600">- {formatCurrency(projectedSavings)}</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-xl bg-amber-50">
              <span className="text-xs font-medium text-amber-600">- Gastos variables ({variablePercentage}%)</span>
              <span className="text-sm font-bold text-amber-600">- {formatCurrency(projectedVariable)}</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-xl bg-zinc-100 border border-zinc-200">
              <span className="text-xs font-bold text-zinc-700">Saldo restante</span>
              <span className={`text-sm font-bold ${remaining > 0 ? "text-emerald-600" : "text-zinc-900"}`}>
                {formatCurrency(remaining)}
              </span>
            </div>
            {currentSavingsBalance > 0 && (
              <div className="flex justify-between py-2 px-3 rounded-xl bg-violet-50 border border-violet-200">
                <span className="text-xs font-bold text-violet-700">+ Saldo actual cuentas ahorro</span>
                <span className="text-sm font-bold text-violet-700">{formatCurrency(currentSavingsBalance)}</span>
              </div>
            )}
            {currentSavingsBalance > 0 && (
              <div className="flex justify-between py-2 px-3 rounded-xl bg-violet-100 border border-violet-300">
                <span className="text-xs font-bold text-violet-800">Total ahorro acumulado</span>
                <span className="text-sm font-bold text-violet-800">
                  {formatCurrency(currentSavingsBalance + projectedSavings)}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Guardar */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Guardando..." : "Guardar Proyección"}
        </button>
      </motion.div>
    </motion.div>
  );
}
