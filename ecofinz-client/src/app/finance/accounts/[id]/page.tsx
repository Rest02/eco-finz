'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AxiosError } from 'axios';
import TransactionList from "@/finance/components/TransactionList";
import TransactionForm from '@/finance/components/TransactionForm';
import { getTransactions } from "@/finance/services/financeService";
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
        setTransactions(transactionResponse.data);
        setError(null);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          // El backend devuelve 404 si no hay transacciones, lo tratamos como un caso de éxito con 0 transacciones.
          setTransactions([]);
          setError(null);
        } else {
          console.error(`Failed to fetch transactions:`, err);
          setError("No se pudieron cargar las transacciones. Intenta de nuevo.");
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

      <TransactionList transactions={transactions} />
      
      <div style={{ marginTop: '20px' }}>
        <Link href="/finance/dashboard">
          &larr; Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
