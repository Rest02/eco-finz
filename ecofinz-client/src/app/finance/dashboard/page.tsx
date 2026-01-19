import AccountList from "@/finance/components/AccountList";
import { getAccounts } from "@/finance/services/financeService";
import Link from "next/link";

// Esta es una página de servidor (Server Page).
// Obtiene los datos antes de renderizar.
export default async function FinanceDashboardPage() {
  
  try {
    const accountsResponse = await getAccounts();
    const accounts = accountsResponse.data;

    return (
      <div>
        <h1>Dashboard Financiero</h1>
        <p>Bienvenido a tu centro de finanzas.</p>
        
        {/* En el futuro aquí podríamos añadir un AccountForm para crear cuentas */}
        
        <AccountList accounts={accounts} />

        {/* Ejemplo de cómo podríamos linkear a una página de detalle */}
        {accounts.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <Link href={`/finance/accounts/${accounts[0].id}`}>
              Ver transacciones de mi primera cuenta
            </Link>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    return (
      <div>
        <h1>Error</h1>
        <p>No se pudieron cargar tus cuentas. Por favor, intenta de nuevo más tarde.</p>
      </div>
    );
  }
}
