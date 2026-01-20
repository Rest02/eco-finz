'use client';

import React, { useState, useEffect } from 'react';
import { createTransaction } from '../services/financeService';
import { getCategories } from '../services/financeService';
import { Transaction, CreateTransactionDto, TransactionType, Category } from '../dto/finance';

const transactionTypes: TransactionType[] = ["INGRESO", "EGRESO"];

interface Props {
  accountId: string;
  onTransactionCreated: (newTransaction: Transaction) => void;
}

const TransactionForm: React.FC<Props> = ({ accountId, onTransactionCreated }) => {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<TransactionType>('EGRESO');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategoryId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Por favor, selecciona una categoría.');
      return;
    }

    const newTransaction: CreateTransactionDto = {
      amount,
      type,
      description,
      date,
      accountId,
      categoryId,
    };

    try {
      const response = await createTransaction(newTransaction);
      onTransactionCreated(response.data);
      // Reset form
      setAmount(0);
      setType('EGRESO');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      console.error('Failed to create transaction:', err);
      setError('No se pudo crear la transacción. Inténtalo de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
      <h2>Añadir Nueva Transacción</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
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

      <button type="submit">Añadir Transacción</button>
    </form>
  );
};

export default TransactionForm;
