'use client';

import React, { useState } from 'react';
import { createAccount } from '../services/financeService';
import { Account, AccountType, CreateAccountDto } from '../dto/finance';

const accountTypes: AccountType[] = ["BANCO", "BILLETERA_DIGITAL", "EFECTIVO", "TARJETA_CREDITO"];

interface Props {
  onAccountCreated: (newAccount: Account) => void;
}

const AccountForm: React.FC<Props> = ({ onAccountCreated }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('BANCO');
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    
    const newAccount: CreateAccountDto = { name, type, balance };
    
    try {
      const response = await createAccount(newAccount);
      onAccountCreated(response.data);
      // Reset form
      setName('');
      setType('BANCO');
      setBalance(0);
    } catch (err) {
      console.error('Failed to create account:', err);
      setError('No se pudo crear la cuenta. Inténtalo de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h2>Crear Nueva Cuenta</h2>
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
        <label htmlFor="balance" style={{ display: 'block', marginBottom: '5px' }}>Balance Inicial</label>
        <input
          id="balance"
          type="number"
          value={balance}
          onChange={(e) => setBalance(parseFloat(e.target.value))}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <button type="submit" style={{ padding: '10px 15px', border: 'none', backgroundColor: '#0070f3', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
        Crear Cuenta
      </button>
    </form>
  );
};

export default AccountForm;
