'use client';

import React from 'react';
import { Transaction } from '../dto/finance';

interface Props {
  transactions: Transaction[];
}

const TransactionList: React.FC<Props> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <p>No hay transacciones para esta cuenta.</p>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Últimas Transacciones</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Descripción</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Fecha</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Monto</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{tx.description}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatDate(tx.date)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', color: tx.type === 'EGRESO' ? 'red' : 'green' }}>
                {tx.type === 'EGRESO' ? '-' : ''}${Math.abs(tx.amount).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
