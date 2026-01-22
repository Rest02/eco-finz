'use client';

import React from 'react';
import Link from 'next/link';
import { Account } from '../types/finance';

interface Props {
  accounts: Account[];
  onAccountDeleted: (accountId: string) => void;
  onAccountEdit: (account: Account) => void;
}

const AccountList: React.FC<Props> = ({ accounts, onAccountDeleted, onAccountEdit }) => {
  if (accounts.length === 0) {
    return <p>No hay cuentas disponibles.</p>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Mis Cuentas</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {accounts.map((account) => (
          <li key={account.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' }}>{account.name}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>Tipo: {account.type}</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: account.balance >= 0 ? '#38a169' : '#e53e3e', marginTop: '5px' }}>
                Balance: ${account.balance.toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link
                href={`/finance/accounts/${account.id}`}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4299e1',
                  color: 'white',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                📊 Ver Transacciones
              </Link>

              <button
                onClick={() => onAccountEdit(account)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: '#ecc94b',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                ✏️ Editar
              </button>

              <button
                onClick={() => onAccountDeleted(account.id)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: '#e53e3e',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;
