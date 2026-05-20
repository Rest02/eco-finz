"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { useIncomeProjection } from "../../hooks/useIncomeProjection";
import {
  useFixedExpenses,
  useCreateFixedExpense,
  useUpdateFixedExpense,
  useDeleteFixedExpense,
} from "../../hooks/useFixedExpenses";
import { useCreateSavingsGoal } from "../../hooks/useSavingsGoals";
import { IncomePeriodSelector } from "./IncomePeriodSelector";
import { FixedExpenseBuilder } from "./FixedExpenseBuilder";
import { DistributionPanel } from "./DistributionPanel";
import { ScenarioSimulator } from "./ScenarioSimulator";
import { GoalForm } from "../savings/GoalForm";
import { Target, PiggyBank, Loader2 } from "lucide-react";

type ScenarioMode = "A" | "B" | "C";

export function ProjectionSandbox() {
  const [period, setPeriod] = useState<"current" | "3m" | "6m">("current");
  const [scenarioMode, setScenarioMode] = useState<ScenarioMode>("A");
  const [targetAmount, setTargetAmount] = useState(0);
  const [targetDate, setTargetDate] = useState("");
  const [savingsPercentage, setSavingsPercentage] = useState(20);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);

  const { data: incomeData, isLoading: incomeLoading } = useIncomeProjection(period);
  const { data: fixedExpensesData = [], isLoading: expensesLoading } = useFixedExpenses();

  const createExpense = useCreateFixedExpense();
  const updateExpense = useUpdateFixedExpense();
  const deleteExpense = useDeleteFixedExpense();

  const averageIncome = incomeData?.averageIncome ?? 0;
  const totalFixedExpenses = useMemo(
    () =>
      fixedExpensesData
        .filter((e) => e.isActive)
        .reduce((sum, e) => sum + e.amount, 0),
    [fixedExpensesData],
  );
  const availableIncome = Math.max(0, averageIncome - totalFixedExpenses);
  const monthlySavings = availableIncome * (savingsPercentage / 100);
  const variableExpenses = availableIncome - monthlySavings;

  const handleAddFixedExpense = (name: string, amount: number) => {
    createExpense.mutate({ name, amount });
  };

  const handleToggleExpense = (id: string, isActive: boolean) => {
    updateExpense.mutate({ id, data: { isActive } });
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense.mutate(id);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  const percentageUsed = averageIncome > 0 ? (totalFixedExpenses / averageIncome) * 100 : 0;

  const createSavingsGoal = useCreateSavingsGoal();

  const handleConvertToGoal = (data: { name: string; targetAmount: number; allocatedPercentage: number; deadline?: string }) => {
    createSavingsGoal.mutate(data as any, {
      onSuccess: () => {
        setIsGoalFormOpen(false);
      },
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
          <PiggyBank className="w-6 h-6" />
          Proyección de Ahorro
        </h1>
        <p className="text-sm text-zinc-500 font-medium mt-0.5">
          Simula tu capacidad de ahorro basada en tus ingresos reales y gastos fijos
        </p>
      </motion.div>

      {/* Selector de Período de Ingresos */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6"
      >
        <h3 className="text-sm font-bold text-zinc-700 mb-3">Período de Ingresos</h3>
        <IncomePeriodSelector period={period} onChange={setPeriod} />
        {incomeLoading ? (
          <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            Calculando ingresos...
          </div>
        ) : incomeData ? (
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="font-bold text-zinc-700">
              Ingreso promedio:{" "}
              <span className="text-emerald-600">{formatCurrency(averageIncome)}</span>
            </span>
            <span className="text-zinc-300">|</span>
            <span className="text-zinc-500">
              {incomeData.transactionCount} transacciones en {incomeData.accountCount} cuentas
            </span>
          </div>
        ) : null}
      </motion.div>

      {/* Constructor de Gastos Fijos */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6"
      >
        <h3 className="text-sm font-bold text-zinc-700 mb-3">Gastos Fijos Mensuales</h3>
        {expensesLoading ? (
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            Cargando gastos fijos...
          </div>
        ) : (
          <FixedExpenseBuilder
            expenses={fixedExpensesData}
            totalFixedExpenses={totalFixedExpenses}
            onAdd={handleAddFixedExpense}
            onToggle={handleToggleExpense}
            onDelete={handleDeleteExpense}
          />
        )}
      </motion.div>

      {/* Panel de Distribución */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6"
      >
        <h3 className="text-sm font-bold text-zinc-700 mb-4">Distribución de Ingresos</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DistributionPanel
            fixedExpenses={totalFixedExpenses}
            savingsProjected={monthlySavings}
            variableExpenses={Math.max(0, variableExpenses)}
            totalIncome={averageIncome}
          />
          <div className="space-y-3 flex flex-col justify-center">
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-zinc-50">
              <span className="text-xs font-medium text-zinc-500">Ingreso Promedio</span>
              <span className="text-sm font-bold text-zinc-900">{formatCurrency(averageIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-rose-50">
              <span className="text-xs font-medium text-rose-600">Gastos Fijos</span>
              <span className="text-sm font-bold text-rose-600">- {formatCurrency(totalFixedExpenses)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-emerald-50">
              <span className="text-xs font-medium text-emerald-600">Ahorro Proyectado</span>
              <span className="text-sm font-bold text-emerald-600">{formatCurrency(monthlySavings)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-zinc-50">
              <span className="text-xs font-medium text-zinc-500">Gastos Variables</span>
              <span className="text-sm font-bold text-zinc-900">{formatCurrency(Math.max(0, variableExpenses))}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Simulador de Escenarios */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6"
      >
        <h3 className="text-sm font-bold text-zinc-700 mb-4">Simulador de Ahorro</h3>
        <ScenarioSimulator
          scenarioMode={scenarioMode}
          onScenarioChange={setScenarioMode}
          targetAmount={targetAmount}
          onTargetAmountChange={setTargetAmount}
          targetDate={targetDate}
          onTargetDateChange={setTargetDate}
          savingsPercentage={savingsPercentage}
          onSavingsPercentageChange={setSavingsPercentage}
          availableIncome={availableIncome}
        />
      </motion.div>

      {/* Botón Convertir en Meta */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <button
          onClick={() => setIsGoalFormOpen(true)}
          disabled={targetAmount <= 0}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Target className="w-5 h-5" />
          Convertir en Meta de Ahorro
        </button>
      </motion.div>

      {/* Goal Form Modal */}
      <GoalForm
        isOpen={isGoalFormOpen}
        onClose={() => setIsGoalFormOpen(false)}
        onSubmit={(data: any) => {
          handleConvertToGoal({
            name: data.name,
            targetAmount: data.targetAmount,
            allocatedPercentage: data.allocatedPercentage,
            deadline: data.deadline,
          });
        }}
        editingGoal={null}
        availablePercentage={100}
      />
    </motion.div>
  );
}
