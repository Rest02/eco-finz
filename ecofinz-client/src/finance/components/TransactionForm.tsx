'use client';

import React, { useState, useEffect } from 'react';
import { createTransaction, getCategories, getAccounts } from '../services/financeService';
import { Transaction, CreateTransactionDto, TransactionType, Category, Account } from '../dto/finance';

const transactionTypes: TransactionType[] = ["INGRESO", "EGRESO"];

interface Props {
  accountId?: string; // Ahora es opcional
  onTransactionCreated: (newTransaction: Transaction) => void;
}

const TransactionForm: React.FC<Props> = ({ accountId: propAccountId, onTransactionCreated }) => {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<TransactionType>('EGRESO');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(propAccountId || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Determinar si necesitamos mostrar el selector de cuenta
  const showAccountSelector = !propAccountId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Siempre cargar categorías
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.data);
        if (categoriesResponse.data.length > 0) {
          setCategoryId(categoriesResponse.data[0].id);
        }

        // Solo cargar cuentas si no se proporcionó accountId
        if (showAccountSelector) {
          const accountsResponse = await getAccounts();
          setAccounts(accountsResponse.data);
          if (accountsResponse.data.length > 0) {
            setSelectedAccountId(accountsResponse.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, [showAccountSelector]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Por favor, selecciona una categoría.');
      return;
    }

    const accountIdToUse = propAccountId || selectedAccountId;
    if (!accountIdToUse) {
      setError('Por favor, selecciona una cuenta.');
      return;
    }

    const newTransaction: CreateTransactionDto = {
      amount,
      type,
      description,
      date,
      accountId: accountIdToUse,
      categoryId,
    };

    try {
      setLoading(true);
      const response = await createTransaction(newTransaction);
      onTransactionCreated(response.data);
      // Reset form
      setAmount(0);
      setType('EGRESO');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setError(null);
    } catch (err) {
      console.error('Failed to create transaction:', err);
      setError('No se pudo crear la transacción. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
      <h2>Añadir Nueva Transacción</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Selector de cuenta - solo si no se proporcionó accountId */}
      {showAccountSelector && (
        <div>
          <label htmlFor="account">Cuenta</label>
          <select
            id="account"
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            required
          >
            <option value="">Selecciona una cuenta</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} - ${acc.balance.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="description">Descripción</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="amount">Monto</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
        />
      </div>

      <div>
        <label htmlFor="type">Tipo</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
          {transactionTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="category">Categoría</label>
        <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Selecciona una categoría</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="date">Fecha</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Añadiendo...' : 'Añadir Transacción'}
      </button>
    </form>
  );
};

export default TransactionForm;
