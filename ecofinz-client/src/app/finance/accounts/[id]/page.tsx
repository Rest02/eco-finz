import TransactionList from "@/finance/components/TransactionList";
import { getTransactions } from "@/finance/services/financeService";
import Link from "next/link";

interface PageProps {
  params: {
    id: string; // Este 'id' es el ID de la cuenta y viene de la URL
  };
}

// Esta también es una página de servidor.
// Usa el 'id' de la URL para buscar las transacciones de esa cuenta específica.
export default async function AccountDetailPage({ params }: PageProps) {
  const { id: accountId } = params;

  try {
    const transactionResponse = await getTransactions({ accountId: accountId });
    const transactions = transactionResponse.data;

    return (
      <div>
        {/* En el futuro, podríamos buscar y mostrar el nombre de la cuenta aquí */}
        <h1>Transacciones de la Cuenta</h1>
        
        <TransactionList transactions={transactions} />
        
        <div style={{ marginTop: '20px' }}>
          <Link href="/finance/dashboard">
            &larr; Volver al Dashboard
          </Link>
        </div>
      </div>
    );

  } catch (error) {
    console.error(`Failed to fetch transactions for account ${accountId}:`, error);
    return (
      <div>
        <h1>Error</h1>
        <p>No se pudieron cargar las transacciones. Por favor, intenta de nuevo más tarde.</p>
        <div style={{ marginTop: '20px' }}>
          <Link href="/finance/dashboard">
            &larr; Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }
}
