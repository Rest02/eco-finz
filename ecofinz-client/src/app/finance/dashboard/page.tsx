'use client';

import { useState, useEffect } from 'react';
import AccountList from '@/finance/components/AccountList';
import AccountForm from '@/finance/components/AccountForm';
import { getAccounts, deleteAccount } from '@/finance/services/financeService';
import { Account } from '@/finance/dto/finance';
import Link from 'next/link';

export default function FinanceDashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await getAccounts();
        setAccounts(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
        setError("No se pudieron cargar tus cuentas. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountCreated = (newAccount: Account) => {
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
  };

  const handleAccountDeleted = async (accountId: string) => {
    try {
      await deleteAccount(accountId);
      setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== accountId));
    } catch (err) {
      console.error("Failed to delete account:", err);
      // Opcional: mostrar un mensaje de error al usuario
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard Financiero</h1>
      <p>Bienvenido a tu centro de finanzas.</p>

      <div style={{ margin: '20px 0' }}>
        <Link href="/finance/categories" style={{ textDecoration: 'underline', color: 'blue' }}>
          Gestionar Categorías
        </Link>
      </div>

      <AccountForm onAccountCreated={handleAccountCreated} />

      <hr style={{ margin: '20px 0' }} />

      <AccountList accounts={accounts} onAccountDeleted={handleAccountDeleted} />

      {accounts.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Link href={`/finance/accounts/${accounts[0].id}`}>
            Ver transacciones de mi primera cuenta
          </Link>
        </div>
      )}
    </div>
  );
}
