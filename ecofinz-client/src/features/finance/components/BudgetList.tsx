import React, { useState } from 'react';
import { useDeleteBudget } from '../hooks/useBudgets';
import { Budget, Category } from '../types/finance';

interface Props {
  budgets: Budget[];
  categories: Category[];
  onBudgetDeleted?: (budgetId: string) => void;
  onBudgetEdit: (budget: Budget) => void;
}

const BudgetList: React.FC<Props> = ({ budgets, categories, onBudgetDeleted, onBudgetEdit }) => {
  const [error, setError] = useState<string | null>(null);
  const deleteBudgetMutation = useDeleteBudget();

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Categoría desconocida';
  };

  const handleDelete = async (budgetId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este presupuesto?')) {
      return;
    }

    setError(null);

    try {
      await deleteBudgetMutation.mutateAsync(budgetId);
      if (onBudgetDeleted) onBudgetDeleted(budgetId);
    } catch (err) {
      console.error('Failed to delete budget:', err);
      setError('No se pudo eliminar el presupuesto. Inténtalo de nuevo.');
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
                  disabled={deleteBudgetMutation.isPending && deleteBudgetMutation.variables === budget.id}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: (deleteBudgetMutation.isPending && deleteBudgetMutation.variables === budget.id) ? '#ccc' : '#f44336',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: (deleteBudgetMutation.isPending && deleteBudgetMutation.variables === budget.id) ? 'not-allowed' : 'pointer',
                    fontSize: '0.9em',
                  }}
                >
                  {(deleteBudgetMutation.isPending && deleteBudgetMutation.variables === budget.id) ? 'Eliminando...' : 'Eliminar'}
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
