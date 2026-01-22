'use client';

import { useState } from 'react';
import AccountList from '@/features/finance/components/AccountList';
import AccountForm from '@/features/finance/components/AccountForm';
import TransactionForm from '@/features/finance/components/TransactionForm';
import MonthlySummary from '@/features/finance/components/MonthlySummary';
import { useAccounts, useDeleteAccount } from '@/features/finance/hooks/useAccounts';
import { useMonthlySummary } from '@/features/finance/hooks/useBudgets';
import { Account, Transaction } from '@/features/finance/types/finance';
import Link from 'next/link';

export default function FinanceDashboardPage() {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // Estado para el periodo del resumen mensual
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  // React Query Hooks
  const { data: accounts = [], isLoading: accountsLoading, error: accountsError } = useAccounts();
  const { data: summaryData, isLoading: summaryLoading } = useMonthlySummary(selectedYear, selectedMonth);
  const deleteAccountMutation = useDeleteAccount();

  const handleAccountCreated = (newAccount: Account) => {
    // React Query se encarga de invalidar y refrescar vía useCreateAccount (si se usara en el form)
    // O simplemente dejamos que el componente hijo maneje su propia mutación.
  };

  const handleAccountUpdated = (updatedAccount: Account) => {
    setEditingAccount(null);
  };

  const handleAccountEdit = (account: Account) => {
    setEditingAccount(account);
    window.scrollTo({ top: document.getElementById('account-form-section')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleAccountDeleted = async (accountId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cuenta?')) {
      try {
        await deleteAccountMutation.mutateAsync(accountId);
        if (editingAccount?.id === accountId) {
          setEditingAccount(null);
        }
      } catch (err) {
        console.error("Failed to delete account:", err);
      }
    }
  };

  const handleDateChange = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const handleTransactionCreated = (newTransaction: Transaction) => {
    // Las mutaciones de transacciones invalidan automáticamente el resumen y las cuentas
  };

  if (accountsLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando dashboard...</div>;
  }

  if (accountsError) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        <h1>Error</h1>
        <p>No se pudieron cargar tus datos. Por favor, intenta de nuevo más tarde.</p>
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
        data={summaryData || null}
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

      <div id="account-form-section">
        <AccountForm
          onAccountCreated={handleAccountCreated}
          onAccountUpdated={handleAccountUpdated}
          initialData={editingAccount || undefined}
          isEditMode={!!editingAccount}
          onCancel={() => setEditingAccount(null)}
        />
      </div>

      <hr style={{ margin: '20px 0' }} />

      <AccountList
        accounts={accounts}
        onAccountDeleted={handleAccountDeleted}
        onAccountEdit={handleAccountEdit}
      />
    </div>
  );
}

