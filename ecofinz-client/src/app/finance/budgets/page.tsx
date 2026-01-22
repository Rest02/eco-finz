'use client';

import React, { useState } from 'react';
import BudgetForm from '@/features/finance/components/BudgetForm';
import BudgetList from '@/features/finance/components/BudgetList';
import { useBudgets } from '@/features/finance/hooks/useBudgets';
import { useCategories } from '@/features/finance/hooks/useCategories';
import { Budget } from '@/features/finance/types/finance';
import Link from 'next/link';

export default function BudgetsPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // React Query Hooks
  const { data: categories = [] } = useCategories();
  const {
    data: budgets = [],
    isLoading: budgetsLoading,
    error: budgetsError
  } = useBudgets({ month: selectedMonth, year: selectedYear });

  const handleBudgetCreated = (newBudget: Budget) => {
    // React Query invalida automáticamente
  };

  const handleBudgetUpdated = (updatedBudget: Budget) => {
    setEditingBudget(null);
  };

  const handleBudgetDeleted = (budgetId: string) => {
    // React Query invalida automáticamente
  };

  const handleBudgetEdit = (budget: Budget) => {
    setEditingBudget(budget);
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
  };

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Presupuestos</h1>

      <div style={{ margin: '20px 0' }}>
        <Link href="/finance/dashboard" style={{ textDecoration: 'underline', color: 'blue' }}>
          ← Volver al Dashboard
        </Link>
      </div>

      {/* Date Filters */}
      <div
        style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <label htmlFor="month-select" style={{ marginRight: '10px' }}>
            Mes:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{ padding: '8px' }}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="year-select" style={{ marginRight: '10px' }}>
            Año:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ padding: '8px' }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {budgetsError && (
        <div style={{ backgroundColor: '#fee', color: '#c33', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          No se pudieron cargar los presupuestos.
        </div>
      )}

      {budgetsLoading ? (
        <div>Cargando presupuestos...</div>
      ) : (
        <>
          {/* Form */}
          <div style={{ marginBottom: '30px' }}>
            <BudgetForm
              month={selectedMonth}
              year={selectedYear}
              onBudgetCreated={handleBudgetCreated}
              onBudgetUpdated={handleBudgetUpdated}
              initialBudget={editingBudget || undefined}
              isEditMode={!!editingBudget}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          <hr style={{ margin: '30px 0' }} />

          {/* List */}
          <div>
            <h2>Presupuestos de {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}</h2>
            <BudgetList
              budgets={budgets}
              categories={categories}
              onBudgetDeleted={handleBudgetDeleted}
              onBudgetEdit={handleBudgetEdit}
            />
          </div>
        </>
      )}
    </div>
  );
}
