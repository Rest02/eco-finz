'use client';

import React, { useState, useEffect } from 'react';
import { Category, Transaction } from '../types/finance';
import { getTransactions } from '../services/financeService';

interface Props {
  categories: Category[];
  onCategoryDeleted: (categoryId: string) => void;
  onCategoryEdit: (category: Category) => void;
}

const CategoryList: React.FC<Props> = ({ categories, onCategoryDeleted, onCategoryEdit }) => {
  const [transactionCounts, setTransactionCounts] = useState<Record<string, number>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryTransactions, setCategoryTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar el conteo de transacciones para cada categoría
  useEffect(() => {
    const loadTransactionCounts = async () => {
      try {
        const response = await getTransactions();
        console.log('CategoryList - Transactions Response:', response);
        console.log('CategoryList - Transactions Data:', response.data);

        // El backend devuelve { data: [...], meta: {...} }
        const allTransactions = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const counts: Record<string, number> = {};
        categories.forEach(cat => {
          counts[cat.id] = allTransactions.filter((t: Transaction) => t.categoryId === cat.id).length;
        });

        setTransactionCounts(counts);
      } catch (err) {
        console.error('Failed to load transaction counts:', err);
        // En caso de error, inicializar con ceros
        const counts: Record<string, number> = {};
        categories.forEach(cat => {
          counts[cat.id] = 0;
        });
        setTransactionCounts(counts);
      }
    };

    if (categories.length > 0) {
      loadTransactionCounts();
    }
  }, [categories]);

  const handleShowTransactions = async (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      setCategoryTransactions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getTransactions();
      console.log('Show Transactions - Response:', response);
      console.log('Show Transactions - Data:', response.data);

      // El backend devuelve { data: [...], meta: {...} }
      const allTransactions = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      const filtered = allTransactions.filter((t: Transaction) => t.categoryId === categoryId);

      setCategoryTransactions(filtered);
      setExpandedCategory(categoryId);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setCategoryTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (categoryId: string) => {
    const count = transactionCounts[categoryId] || 0;

    if (count > 0) {
      const confirmed = confirm(
        `⚠️ ADVERTENCIA: Esta categoría tiene ${count} transacción(es) asociada(s).\n\n` +
        `Si eliminas esta categoría, las transacciones quedarán sin categoría.\n\n` +
        `¿Estás seguro de que deseas continuar?`
      );

      if (!confirmed) return;
    }

    onCategoryDeleted(categoryId);
  };

  if (categories.length === 0) {
    return <p>No hay categorías definidas.</p>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Mis Categorías</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map((category) => {
          const count = transactionCounts[category.id] || 0;
          const isExpanded = expandedCategory === category.id;

          return (
            <li key={category.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px', backgroundColor: count > 0 ? '#fff9e6' : 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{category.name}</div>
                  <div style={{ fontSize: '0.9em', color: '#555', marginTop: '4px' }}>
                    Tipo: {category.type}
                    {count > 0 && (
                      <span style={{ marginLeft: '10px', color: '#d97706', fontWeight: '600' }}>
                        • {count} transacción(es) usando esta categoría
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {count > 0 && (
                    <button
                      onClick={() => handleShowTransactions(category.id)}
                      style={{
                        padding: '8px 12px',
                        border: 'none',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {isExpanded ? '🔼 Ocultar' : '🔍 Ver Transacciones'}
                    </button>
                  )}

                  <button
                    onClick={() => onCategoryEdit(category)}
                    style={{
                      padding: '8px 12px',
                      border: 'none',
                      backgroundColor: '#ecc94b',
                      color: 'white',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    onClick={() => handleDelete(category.id)}
                    style={{
                      padding: '8px 12px',
                      border: 'none',
                      backgroundColor: count > 0 ? '#f59e0b' : '#e53e3e',
                      color: 'white',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {count > 0 ? '⚠️ Eliminar' : '🗑️ Eliminar'}
                  </button>
                </div>
              </div>

              {/* Lista de transacciones expandida */}
              {isExpanded && (
                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
                  {loading ? (
                    <p>Cargando transacciones...</p>
                  ) : categoryTransactions.length > 0 ? (
                    <>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Transacciones que usan esta categoría:</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {categoryTransactions.map((tx) => (
                          <li key={tx.id} style={{ padding: '8px', borderBottom: '1px solid #ddd', fontSize: '13px' }}>
                            <div style={{ fontWeight: '600' }}>{tx.description}</div>
                            <div style={{ color: '#666', fontSize: '12px' }}>
                              Monto: ${tx.amount.toLocaleString()} • Fecha: {new Date(tx.date).toLocaleDateString()}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <p style={{ marginTop: '10px', fontSize: '12px', color: '#d97706' }}>
                        💡 Debes eliminar estas transacciones primero antes de poder eliminar la categoría.
                      </p>
                    </>
                  ) : (
                    <p>No se encontraron transacciones.</p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryList;
