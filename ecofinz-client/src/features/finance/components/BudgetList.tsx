'use client';

import React, { useState } from 'react';
import { deleteBudget } from '../services/financeService';
import { Budget, Category } from '../types/finance';

interface Props {
  budgets: Budget[];
  categories: Category[];
  onBudgetDeleted: (budgetId: string) => void;
  onBudgetEdit: (budget: Budget) => void;
}

const BudgetList: React.FC<Props> = ({ budgets, categories, onBudgetDeleted, onBudgetEdit }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Categoría desconocida';
  };

  const handleDelete = async (budgetId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este presupuesto?')) {
      return;
    }

    setLoadingId(budgetId);
    setError(null);

    try {
      await deleteBudget(budgetId);
      onBudgetDeleted(budgetId);
    } catch (err) {
      console.error('Failed to delete budget:', err);
      setError('No se pudo eliminar el presupuesto. Inténtalo de nuevo.');
    } finally {
      setLoadingId(null);
    }
  };

  if (budgets.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        <p>No hay presupuestos para este período.</p>
      </div>
    );
  }

  return (
    <div>
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
      <div style={{ display: 'grid', gap: '15px' }}>
        {budgets.map((budget) => (
          <div
            key={budget.id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>{budget.name}</h3>
                <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                  Categoría: {getCategoryName(budget.categoryId)}
                </p>
                <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                  Presupuesto: <strong>${parseFloat(String(budget.amount)).toFixed(2)}</strong>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => onBudgetEdit(budget)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(budget.id)}
                  disabled={loadingId === budget.id}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: loadingId === budget.id ? '#ccc' : '#f44336',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: loadingId === budget.id ? 'not-allowed' : 'pointer',
                    fontSize: '0.9em',
                  }}
                >
                  {loadingId === budget.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetList;
