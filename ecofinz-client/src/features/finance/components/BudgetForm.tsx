'use client';

import React, { useState, useEffect } from 'react';
import { createBudget, updateBudget, getCategories } from '../services/financeService';
import { Budget, Category, CreateBudgetDto, UpdateBudgetDto } from '../types/finance';

interface Props {
  month: number;
  year: number;
  onBudgetCreated?: (newBudget: Budget) => void;
  onBudgetUpdated?: (updatedBudget: Budget) => void;
  initialBudget?: Budget;
  isEditMode?: boolean;
  onCancelEdit?: () => void;
}

const BudgetForm: React.FC<Props> = ({
  month,
  year,
  onBudgetCreated,
  onBudgetUpdated,
  initialBudget,
  isEditMode = false,
  onCancelEdit,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        // Filter only EGRESO categories
        const egressCategories = response.data.filter(cat => cat.type === 'EGRESO');
        setCategories(egressCategories);
        if (egressCategories.length > 0 && !categoryId) {
          setCategoryId(egressCategories[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('No se pudieron cargar las categorías.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialBudget && isEditMode) {
      setName(initialBudget.name);
      setAmount(parseFloat(String(initialBudget.amount)));
      setCategoryId(initialBudget.categoryId);
    }
  }, [initialBudget, isEditMode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Debes seleccionar una categoría.');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode && initialBudget) {
        const updateData: UpdateBudgetDto = { name, amount, categoryId };
        const response = await updateBudget(initialBudget.id, updateData);
        if (onBudgetUpdated) {
          onBudgetUpdated(response.data);
        }
      } else {
        const newBudget: CreateBudgetDto = {
          name,
          amount,
          month,
          year,
          categoryId,
        };
        const response = await createBudget(newBudget);
        if (onBudgetCreated) {
          onBudgetCreated(response.data);
        }
      }

      // Reset form
      setName('');
      setAmount(0);
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }

      if (isEditMode && onCancelEdit) {
        onCancelEdit();
      }
    } catch (err) {
      console.error('Failed to save budget:', err);
      setError('No se pudo guardar el presupuesto. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setAmount(0);
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '5px',
      }}
    >
      <h2>{isEditMode ? 'Editar Presupuesto' : 'Crear Nuevo Presupuesto'}</h2>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Mes: {month.toString().padStart(2, '0')} / {year}
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label htmlFor="budget-name" style={{ display: 'block', marginBottom: '5px' }}>
          Nombre del Presupuesto
        </label>
        <input
          id="budget-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
          placeholder="ej. Comida, Transporte, etc."
        />
      </div>

      <div>
        <label htmlFor="budget-amount" style={{ display: 'block', marginBottom: '5px' }}>
          Monto Presupuestado
        </label>
        <input
          id="budget-amount"
          type="number"
          step="0.01"
          value={amount || ''}
          onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : 0)}
          required
          min="0"
          style={{ width: '100%', padding: '8px' }}
          placeholder="0.00"
        />
      </div>

      <div>
        <label htmlFor="budget-category" style={{ display: 'block', marginBottom: '5px' }}>
          Categoría (Egresos)
        </label>
        <select
          id="budget-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          {categories.length === 0 ? (
            <option value="">No hay categorías de egreso</option>
          ) : (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          disabled={loading || categories.length === 0}
          style={{
            padding: '10px 15px',
            border: 'none',
            backgroundColor: loading || categories.length === 0 ? '#ccc' : '#0070f3',
            color: 'white',
            borderRadius: '5px',
            cursor: loading || categories.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
        </button>

        {isEditMode && (
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '10px 15px',
              border: '1px solid #ccc',
              backgroundColor: '#f5f5f5',
              color: '#333',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default BudgetForm;
