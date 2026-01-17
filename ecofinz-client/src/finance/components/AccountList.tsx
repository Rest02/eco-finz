'use client';

import React from 'react';
import { Account } from '../dto/finance';

interface Props {
  accounts: Account[];
}

const AccountList: React.FC<Props> = ({ accounts }) => {
  if (accounts.length === 0) {
    return <p>No hay cuentas disponibles.</p>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Mis Cuentas</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {accounts.map((account) => (
          <li key={account.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <div style={{ fontWeight: 'bold' }}>{account.name}</div>
            <div>Tipo: {account.type}</div>
            <div>Balance: ${account.balance.toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;
