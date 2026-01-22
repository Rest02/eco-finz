'use client';

import React, { useState, useEffect } from 'react';
import BudgetForm from '@/features/finance/components/BudgetForm';
import BudgetList from '@/features/finance/components/BudgetList';
import { getBudgets, getCategories } from '@/features/finance/services/financeService';
import { Budget, Category } from '@/features/finance/types/finance';
import Link from 'next/link';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch budgets when month/year changes
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        const response = await getBudgets({
          month: selectedMonth,
          year: selectedYear,
        });
        setBudgets(response.data);
        setError(null);
        setEditingBudget(null);
      } catch (err) {
        console.error('Failed to fetch budgets:', err);
        setError('No se pudieron cargar los presupuestos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const handleBudgetCreated = (newBudget: Budget) => {
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
  };

  const handleBudgetUpdated = (updatedBudget: Budget) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
  };

  const handleBudgetDeleted = (budgetId: string) => {
    setBudgets((prevBudgets) => prevBudgets.filter((budget) => budget.id !== budgetId));
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

      {error && (
        <div style={{ backgroundColor: '#fee', color: '#c33', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
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
