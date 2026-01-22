import React, { useState, useEffect } from 'react';
import { useCreateAccount, useUpdateAccount } from '../hooks/useAccounts';
import { Account, AccountType, CreateAccountDto, UpdateAccountDto } from '../types/finance';

const accountTypes: AccountType[] = ["BANCO", "BILLETERA_DIGITAL", "EFECTIVO", "TARJETA_CREDITO"];

interface Props {
  onAccountCreated?: (newAccount: Account) => void;
  onAccountUpdated?: (updatedAccount: Account) => void;
  initialData?: Account;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const AccountForm: React.FC<Props> = ({
  onAccountCreated,
  onAccountUpdated,
  initialData,
  isEditMode = false,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('BANCO');
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();

  const loading = createAccountMutation.isPending || updateAccountMutation.isPending;

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setBalance(initialData.balance);
    } else {
      setName('');
      setType('BANCO');
      setBalance(0);
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      if (isEditMode && initialData) {
        const updateData: UpdateAccountDto = { name, type };
        const response = await updateAccountMutation.mutateAsync({ id: initialData.id, data: updateData });
        if (onAccountUpdated) onAccountUpdated(response.data);
      } else {
        const newAccount: CreateAccountDto = { name, type, balance };
        const response = await createAccountMutation.mutateAsync(newAccount);
        if (onAccountCreated) onAccountCreated(response.data);
        // Reset form only on create
        setName('');
        setType('BANCO');
        setBalance(0);
      }
    } catch (err) {
      console.error('Failed to save account:', err);
      setError(`No se pudo ${isEditMode ? 'actualizar' : 'crear'} la cuenta. Inténtalo de nuevo.`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h2>{isEditMode ? 'Editar Cuenta' : 'Crear Nueva Cuenta'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Nombre de la Cuenta</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <div>
        <label htmlFor="type" style={{ display: 'block', marginBottom: '5px' }}>Tipo de Cuenta</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as AccountType)}
          style={{ width: '100%', padding: '8px' }}
        >
          {accountTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="balance" style={{ display: 'block', marginBottom: '5px' }}>
          {isEditMode ? 'Balance (No editable)' : 'Balance Inicial'}
        </label>
        <input
          id="balance"
          type="number"
          value={balance}
          onChange={(e) => setBalance(parseFloat(e.target.value))}
          required
          disabled={isEditMode}
          style={{ width: '100%', padding: '8px', backgroundColor: isEditMode ? '#f5f5f5' : 'white' }}
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
          {loading ? 'Guardando...' : isEditMode ? 'Actualizar Cuenta' : 'Crear Cuenta'}
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

export default AccountForm;
