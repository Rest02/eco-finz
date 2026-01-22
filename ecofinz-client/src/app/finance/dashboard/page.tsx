'use client';

import { useState, useEffect } from 'react';
import AccountList from '@/finance/components/AccountList';
import AccountForm from '@/finance/components/AccountForm';
import TransactionForm from '@/finance/components/TransactionForm';
import MonthlySummary from '@/finance/components/MonthlySummary';
import { getAccounts, deleteAccount, getMonthlySummary } from '@/finance/services/financeService';
import { Account, MonthlySummary as MonthlySummaryType, Transaction } from '@/finance/dto/finance';
import Link from 'next/link';

export default function FinanceDashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el resumen mensual
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [summaryData, setSummaryData] = useState<MonthlySummaryType | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

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

  // Efecto para cargar el resumen mensual
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        const response = await getMonthlySummary(selectedYear, selectedMonth);
        setSummaryData(response.data);
      } catch (err) {
        console.error("Failed to fetch monthly summary:", err);
        setSummaryData(null);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, [selectedYear, selectedMonth]);

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

  const handleDateChange = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const handleTransactionCreated = (newTransaction: Transaction) => {
    // Recargar el resumen mensual después de crear una transacción
    const fetchSummary = async () => {
      try {
        const response = await getMonthlySummary(selectedYear, selectedMonth);
        setSummaryData(response.data);
      } catch (err) {
        console.error("Failed to refresh summary:", err);
      }
    };
    fetchSummary();
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

      <div style={{ margin: '20px 0', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <Link href="/finance/categories" style={{ textDecoration: 'underline', color: 'blue' }}>
          Gestionar Categorías
        </Link>
        <Link href="/finance/budgets" style={{ textDecoration: 'underline', color: 'blue' }}>
          Gestionar Presupuestos
        </Link>
      </div>

      {/* Resumen Mensual */}
      <MonthlySummary
        data={summaryData}
        isLoading={summaryLoading}
        year={selectedYear}
        month={selectedMonth}
        onDateChange={handleDateChange}
      />

      <hr style={{ margin: '20px 0' }} />

      {/* Sección de Transacción Rápida */}
      {accounts.length > 0 && (
        <>
          <h2 style={{ marginTop: '30px' }}>➕ Añadir Transacción Rápida</h2>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            Registra un ingreso o egreso en cualquiera de tus cuentas
          </p>
          <TransactionForm onTransactionCreated={handleTransactionCreated} />
          <hr style={{ margin: '30px 0' }} />
        </>
      )}

      <AccountForm onAccountCreated={handleAccountCreated} />

      <hr style={{ margin: '20px 0' }} />

      <AccountList accounts={accounts} onAccountDeleted={handleAccountDeleted} />
    </div>
  );
}

