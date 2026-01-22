'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AxiosError } from 'axios';
import TransactionList from "@/finance/components/TransactionList";
import TransactionForm from '@/finance/components/TransactionForm';
import TransactionFilters from '@/finance/components/TransactionFilters';
import { getTransactions, deleteTransaction } from "@/finance/services/financeService";
import { Transaction, TransactionType } from '@/finance/dto/finance';
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

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  useEffect(() => {
    if (!accountId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const transactionResponse = await getTransactions({
          accountId,
          type: filterValues.type || undefined,
          categoryId: filterValues.categoryId || undefined,
          startDate: filterValues.startDate || undefined,
          endDate: filterValues.endDate || undefined
        });

        // El backend devuelve { data: [...], meta: {...} }
        // Las transacciones están en response.data.data
        const transactionsData = Array.isArray(transactionResponse.data?.data)
          ? transactionResponse.data.data
          : [];

        setTransactions(transactionsData);
        setError(null);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          setTransactions([]);
          setError(null);
        } else {
          console.error(`Failed to fetch transactions:`, err);
          setError("No se pudieron cargar las transacciones. Intenta de nuevo.");
          setTransactions([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, filterValues]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilterValues(newFilters);
  };

  const handleTransactionCreated = (newTransaction: Transaction) => {
    // Si hay filtros activos, es mejor recargar todo para asegurar que la nueva transacción cumpla los filtros
    setFilterValues({ ...filterValues });
  };

  const handleTransactionUpdated = (updatedTransaction: Transaction) => {
    setTransactions(prev =>
      prev.map(tx => tx.id === updatedTransaction.id ? updatedTransaction : tx)
    );
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
      await deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(tx => tx.id !== transactionId));
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

      {error ? (
        <div style={{ padding: '20px', backgroundColor: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      ) : loading ? (
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
