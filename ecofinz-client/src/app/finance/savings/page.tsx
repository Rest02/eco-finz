'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useSavingsGoals, useSavingsSummary, useCreateSavingsGoal, useUpdateSavingsGoal, useDeleteSavingsGoal } from '@/features/finance/hooks/useSavingsGoals';
import { useTransactions } from '@/features/finance/hooks/useTransactions';
import { useAccounts } from '@/features/finance/hooks/useAccounts';
import { SavingsOverviewCard } from '@/features/finance/components/savings/SavingsOverviewCard';
import { SavingsMonthlyChart } from '@/features/finance/components/savings/SavingsMonthlyChart';
import { GoalList } from '@/features/finance/components/savings/GoalList';
import { GoalForm } from '@/features/finance/components/savings/GoalForm';
import type { SavingsGoal } from '@/features/finance/types/savings';

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function SavingsPage() {
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const { data: savingsData } = useSavingsGoals();
  const { data: summary } = useSavingsSummary();
  const { data: accounts = [] } = useAccounts();

  const dateRange = useMemo(() => {
    const today = new Date();
    const start6MonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const end = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T23:59:59.999Z`;
    const start = `${start6MonthsAgo.getFullYear()}-${String(start6MonthsAgo.getMonth() + 1).padStart(2, '0')}-01T00:00:00.000Z`;
    return { startDate: start, endDate: end };
  }, []);

  const txFilters = useMemo(() => ({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    limit: 10000 as const,
  }), [dateRange]);

  const { data: txResponse } = useTransactions(txFilters);
  const historicalTransactions = txResponse?.data || [];

  const monthlyChartData = useMemo(() => {
    const today = new Date();
    const monthsList: { key: string; label: string; year: number; monthNum: number; ingresos: number; egresos: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      monthsList.push({
        key: `${y}-${String(m).padStart(2, '0')}`,
        label: monthNames[d.getMonth()],
        year: y,
        monthNum: m,
        ingresos: 0,
        egresos: 0,
      });
    }

    historicalTransactions.forEach((tx) => {
      const amount = Number(tx.amount);
      const txDate = new Date(tx.date);
      const txMonth = txDate.getMonth() + 1;
      const txYear = txDate.getFullYear();
      const key = `${txYear}-${String(txMonth).padStart(2, '0')}`;
      const bucket = monthsList.find((m) => m.key === key);
      if (!bucket) return;

      const account = accounts.find((a) => a.id === tx.accountId);

      if (tx.type === 'AHORRO') {
        if (tx.isInflow) return;
        if (account?.isSavingsAccount) {
          bucket.egresos += amount;
        } else {
          bucket.ingresos += amount;
        }
      } else if (tx.type === 'INGRESO' && account?.isSavingsAccount) {
        bucket.ingresos += amount;
      } else if (tx.type === 'EGRESO' && account?.isSavingsAccount) {
        bucket.egresos += amount;
      }
    });

    return monthsList;
  }, [historicalTransactions, accounts]);

  const createMutation = useCreateSavingsGoal();
  const updateMutation = useUpdateSavingsGoal();
  const deleteMutation = useDeleteSavingsGoal();

  const handleCreate = (data: any) => {
    createMutation.mutate(data as any, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (!editingGoal) return;
    updateMutation.mutate(
      { id: editingGoal.id, data },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          setEditingGoal(null);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta meta?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleNew = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const goals = savingsData?.goals ?? [];
  const overviewTotalSaved = summary?.totalSaved ?? savingsData?.totalSaved ?? 0;
  const overviewAllocated = summary?.totalAllocatedPercentage ?? 0;
  const overviewAvailable = summary?.availablePercentage ?? 100;
  const overviewGoalCount = summary?.goalCount ?? 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative min-h-screen p-6 lg:p-10 pb-20 space-y-8 w-full max-w-7xl mx-auto transition-all duration-500"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">Ahorros</h1>
          <p className="text-sm text-zinc-500 font-medium mt-0.5">
            Gestiona tus metas y monitorea tu progreso
          </p>
        </div>
        <button
          onClick={() => setIsPrivateMode(!isPrivateMode)}
          className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          {isPrivateMode ? 'Mostrar montos' : 'Ocultar montos'}
        </button>
      </div>

      <motion.div variants={itemVariants}>
        <SavingsOverviewCard
          totalSaved={overviewTotalSaved}
          totalAllocatedPercentage={overviewAllocated}
          availablePercentage={overviewAvailable}
          goalCount={overviewGoalCount}
          isPrivateMode={isPrivateMode}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SavingsMonthlyChart data={monthlyChartData} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <GoalList
          goals={goals}
          isPrivateMode={isPrivateMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onNew={handleNew}
        />
      </motion.div>

      <GoalForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={editingGoal ? handleUpdate : handleCreate}
        editingGoal={editingGoal}
        availablePercentage={overviewAvailable}
      />
    </motion.div>
  );
}
