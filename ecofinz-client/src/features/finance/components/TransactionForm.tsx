import React, { useState, useEffect } from 'react';
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useAccounts } from '../hooks/useAccounts';
import { Transaction, CreateTransactionDto, UpdateTransactionDto, TransactionType } from '../types/finance';

const transactionTypes: TransactionType[] = ["INGRESO", "EGRESO"];

interface Props {
  accountId?: string;
  onTransactionCreated?: (newTransaction: Transaction) => void;
  onTransactionUpdated?: (updatedTransaction: Transaction) => void;
  initialData?: Transaction;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const TransactionForm: React.FC<Props> = ({
  accountId: propAccountId,
  onTransactionCreated,
  onTransactionUpdated,
  initialData,
  isEditMode = false,
  onCancel
}) => {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<TransactionType>('EGRESO');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(propAccountId || '');
  const [error, setError] = useState<string | null>(null);

  // React Query Hooks
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();

  const loading = createTransactionMutation.isPending || updateTransactionMutation.isPending;

  // Determinar si necesitamos mostrar el selector de cuenta
  const showAccountSelector = !propAccountId;

  useEffect(() => {
    if (isEditMode && initialData) {
      setAmount(initialData.amount);
      setType(initialData.type);
      setDescription(initialData.description);
      setDate(initialData.date.split('T')[0]);
      setCategoryId(initialData.categoryId);
      setSelectedAccountId(initialData.accountId);
    } else {
      setAmount(0);
      setType('EGRESO');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isEditMode, initialData]);

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

    try {
      if (isEditMode && initialData) {
        const updateData: UpdateTransactionDto = {
          amount,
          type,
          description,
          date,
          accountId: accountIdToUse,
          categoryId,
        };
        const response = await updateTransactionMutation.mutateAsync({ id: initialData.id, data: updateData });
        if (onTransactionUpdated) onTransactionUpdated(response.data);
      } else {
        const newTransaction: CreateTransactionDto = {
          amount,
          type,
          description,
          date,
          accountId: accountIdToUse,
          categoryId,
        };
        const response = await createTransactionMutation.mutateAsync(newTransaction);
        if (onTransactionCreated) onTransactionCreated(response.data);
        // Reset form only on create
        setAmount(0);
        setType('EGRESO');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setError(`No se pudo ${isEditMode ? 'actualizar' : 'crear'} la transacción. Inténtalo de nuevo.`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
      <h2>{isEditMode ? 'Editar Transacción' : 'Añadir Nueva Transacción'}</h2>
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
            style={{ width: '100%', padding: '8px' }}
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
          style={{ width: '100%', padding: '8px' }}
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
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div>
        <label htmlFor="type">Tipo</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)} style={{ width: '100%', padding: '8px' }}>
          {transactionTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="category">Categoría</label>
        <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
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
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 15px',
            border: 'none',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            flex: 1
          }}
        >
          {loading ? 'Guardando...' : isEditMode ? 'Actualizar Transacción' : 'Añadir Transacción'}
        </button>
        {isEditMode && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 15px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              color: '#333',
              borderRadius: '5px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;
