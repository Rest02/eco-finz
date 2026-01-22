'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AxiosError } from 'axios';
import TransactionList from "@/finance/components/TransactionList";
import TransactionForm from '@/finance/components/TransactionForm';
import { getTransactions, deleteTransaction } from "@/finance/services/financeService";
import { Transaction } from '@/finance/dto/finance';
import Link from "next/link";

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = params.id as string;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const transactionResponse = await getTransactions({ accountId });

        // Log para depuración
        console.log('Transaction Response:', transactionResponse);
        console.log('Transaction Data:', transactionResponse.data);

        // El backend devuelve { data: [...], meta: {...} }
        // Las transacciones están en response.data.data
        const transactionsData = Array.isArray(transactionResponse.data?.data)
          ? transactionResponse.data.data
          : [];

        setTransactions(transactionsData);
        setError(null);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          // El backend devuelve 404 si no hay transacciones, lo tratamos como un caso de éxito con 0 transacciones.
          setTransactions([]);
          setError(null);
        } else {
          console.error(`Failed to fetch transactions:`, err);
          setError("No se pudieron cargar las transacciones. Intenta de nuevo.");
          setTransactions([]); // Asegurar que sea un array vacío en caso de error
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  const handleTransactionCreated = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      return;
    }

    try {
      await deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(tx => tx.id !== transactionId));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert('No se pudo eliminar la transacción. Inténtalo de nuevo.');
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
        <Link href="/finance/dashboard">&larr; Volver al Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Añadir Transacción a una Cuenta</h1>
      <p>Estás añadiendo una transacción a la cuenta seleccionada. Abajo se muestran todas tus transacciones recientes.</p>

      <TransactionForm accountId={accountId} onTransactionCreated={handleTransactionCreated} />

      <hr style={{ margin: '20px 0' }} />

      <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />

      <div style={{ marginTop: '20px' }}>
        <Link href="/finance/dashboard">
          &larr; Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
