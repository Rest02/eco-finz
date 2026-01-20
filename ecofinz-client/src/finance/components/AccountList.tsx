'use client';

import React from 'react';
import { Account } from '../dto/finance';

interface Props {
  accounts: Account[];
  onAccountDeleted: (accountId: string) => void;
}

const AccountList: React.FC<Props> = ({ accounts, onAccountDeleted }) => {
  if (accounts.length === 0) {
    return <p>No hay cuentas disponibles.</p>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Mis Cuentas</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {accounts.map((account) => (
          <li key={account.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{account.name}</div>
              <div>Tipo: {account.type}</div>
              <div>Balance: ${account.balance.toLocaleString()}</div>
            </div>
            <button 
              onClick={() => onAccountDeleted(account.id)}
              style={{ padding: '8px 12px', border: 'none', backgroundColor: '#e53e3e', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;
