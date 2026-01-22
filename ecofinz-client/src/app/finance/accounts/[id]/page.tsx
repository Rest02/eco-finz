'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import TransactionList from "@/features/finance/components/TransactionList";
import TransactionForm from '@/features/finance/components/TransactionForm';
import TransactionFilters from '@/features/finance/components/TransactionFilters';
import { useTransactions, useDeleteTransaction } from '@/features/finance/hooks/useTransactions';
import { Transaction, TransactionType } from '@/features/finance/types/finance';
import Link from "next/link";

interface FilterValues {
  type?: TransactionType | '';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = params.id as string;

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  // React Query Hook
  const {
    data: transactionResponse,
    isLoading,
    error: fetchError
  } = useTransactions({
    accountId,
    type: filterValues.type || undefined,
    categoryId: filterValues.categoryId || undefined,
    startDate: filterValues.startDate || undefined,
    endDate: filterValues.endDate || undefined
  });

  const deleteTransactionMutation = useDeleteTransaction();

  // Las transacciones están en response.data (según el hook que devuelve response.data)
  // Pero mi hook useTransactions devuelve response.data, y response.data tiene { data: Transaction[], meta: ... }
  const transactions = Array.isArray(transactionResponse?.data) ? transactionResponse.data : [];

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilterValues(newFilters);
  };

  const handleTransactionCreated = (newTransaction: Transaction) => {
    // React Query invalida automáticamente
  };

  const handleTransactionUpdated = (updatedTransaction: Transaction) => {
    setEditingTransaction(null);
  };

  const handleTransactionEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      return;
    }

    try {
      await deleteTransactionMutation.mutateAsync(transactionId);
      if (editingTransaction?.id === transactionId) {
        setEditingTransaction(null);
      }
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert('No se pudo eliminar la transacción. Inténtalo de nuevo.');
    }
  };

  return (
    <div>
      <h1>Gestión de Transacciones</h1>
      <p>Administra los movimientos de tu cuenta. Puedes añadir nuevos, editar los existentes o eliminarlos.</p>

      <TransactionForm
        accountId={accountId}
        onTransactionCreated={handleTransactionCreated}
        onTransactionUpdated={handleTransactionUpdated}
        initialData={editingTransaction || undefined}
        isEditMode={!!editingTransaction}
        onCancel={() => setEditingTransaction(null)}
      />

      <hr style={{ margin: '30px 0' }} />

      <TransactionFilters onFilterChange={handleFilterChange} />

      {fetchError ? (
        <div style={{ padding: '20px', backgroundColor: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '20px' }}>
          <strong>Error:</strong> No se pudieron cargar las transacciones.
        </div>
      ) : isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          <p>Cargando transacciones...</p>
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          onDelete={handleDeleteTransaction}
          onEdit={handleTransactionEdit}
        />
      )}

      <div style={{ marginTop: '20px' }}>
        <Link href="/finance/dashboard">
          &larr; Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
