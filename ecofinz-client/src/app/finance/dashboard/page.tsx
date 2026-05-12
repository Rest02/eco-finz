"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingBag,
  Car,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import custom dashboard components
import {
  DashboardHeader,
  NetWorthCard,
  ExpenseCard,
  SavingsCard,
  IncomeExpensesChart,
  SpendingIntelligence,
  SavingsGoals,
  RecentTransactions
} from "@/features/finance/components/dashboard";

import { useAccounts } from "@/features/finance/hooks/useAccounts";
import { useTransactions } from "@/features/finance/hooks/useTransactions";

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

const COMPARISON_DATA = [
  { month: "Ene", ingresos: 1200000, egresos: 850000 },
  { month: "Feb", ingresos: 1350000, egresos: 920000 },
  { month: "Mar", ingresos: 1150000, egresos: 880000 },
  { month: "Abr", ingresos: 1400000, egresos: 950000 },
  { month: "May", ingresos: 1250000, egresos: 780000 },
  { month: "Jun", ingresos: 1600000, egresos: 1050000 },
];

const SAVINGS_GOALS = [
  { id: 1, name: "✈️ Viaje a Japón", target: 3000000, current: 1800000, color: "bg-rose-500" },
  { id: 2, name: "🚗 Nuevo Auto", target: 8000000, current: 2400000, color: "bg-indigo-500" },
  { id: 3, name: "🛡️ Fondo Emergencia", target: 4000000, current: 3200000, color: "bg-emerald-500" },
];

const SPARK_DATA_EGRESOS = [
  { val: 20000 }, { val: 15000 }, { val: 45000 }, { val: 10000 }, { val: 35000 }, { val: 12000 }, { val: 8000 }
];
const SPARK_DATA_AHORRO = [
  { val: 10 }, { val: 15 }, { val: 12 }, { val: 20 }, { val: 25 }, { val: 32 }, { val: 34 }
];

const EXPENSE_CATEGORIES = [
  { name: "Alimentación", value: 320000, color: "#6366F1", change: 5 },
  { name: "Transporte", value: 85000, color: "#F59E0B", change: -2 },
  { name: "Entretenimiento", value: 120000, color: "#EC4899", change: 15 },
  { name: "Compras", value: 250000, color: "#10B981", change: -8 },
  { name: "Servicios", value: 145000, color: "#3B82F6", change: 0 },
];

const RECENT_TRANSACTIONS = [
  { id: "tx1", desc: "Supermercado Jumbo", amount: -85200, date: "Hoy", icon: ShoppingBag, color: "text-indigo-600 bg-indigo-50", category: "Alimentación" },
  { id: "tx2", desc: "Transferencia Sueldo", amount: 1600000, date: "Ayer", icon: DollarSign, color: "text-emerald-600 bg-emerald-50", category: "Ingresos" },
  { id: "tx3", desc: "Carga Bip", amount: -10000, date: "Ayer", icon: Car, color: "text-amber-600 bg-amber-50", category: "Transporte" },
  { id: "tx4", desc: "Netflix", amount: -9900, date: "08 May", icon: ShoppingBag, color: "text-rose-600 bg-rose-50", category: "Servicios" },
];

export default function FinanceDashboardPage() {
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(true);

  // Definir mes y año actual en hora local para la carga inicial
  const today = new Date();
  const currentMonthNum = today.getMonth() + 1;
  const currentYearNum = today.getFullYear();

  const startOfMonth = new Date(currentYearNum, currentMonthNum - 1, 1).toISOString();
  const endOfMonth = new Date(currentYearNum, currentMonthNum, 0, 23, 59, 59, 999).toISOString();

  // Fetch Real Data
  const { data: accounts = [] } = useAccounts();
  // Se debe habilitar la consulta incluso si no es un filtro estricto. La hook valida startDate/endDate ahora.
  const { data: transactionResponse } = useTransactions({ type: "AHORRO", limit: 10000 });
  const savingsTransactions = transactionResponse?.data || [];

  // Fetch Egresos del Mes Actual
  const { data: expenseResponse } = useTransactions({ 
    type: "EGRESO", 
    startDate: startOfMonth, 
    endDate: endOfMonth, 
    limit: 10000 
  });
  const expenseTransactions = expenseResponse?.data || [];

  // Process Real Data for "Patrimonio Neto" and "Fuentes"
  const netWorthData = useMemo(() => {
    // Suma de balances de cuentas de débito (no crédito)
    const debitAccounts = accounts.filter(a => a.type !== "TARJETA_CREDITO");
    const totalDebit = debitAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    // Suma acumulada de movimientos de ahorro históricos (restando egresos de ahorro automáticamente por el campo isInflow)
    const totalSavings = savingsTransactions.reduce((sum, tx) => {
      const amount = Number(tx.amount);
      return sum + (tx.isInflow ? amount : -amount);
    }, 0);

    const totalNetWorth = totalDebit + totalSavings;

    // Desglose por cuenta para mostrar las tarjetas/fuentes
    const contributionMap: Record<string, { name: string, total: number }> = {};

    // Cuentas con saldo a favor (débito)
    debitAccounts.forEach(a => {
      contributionMap[a.id] = { name: a.name, total: Number(a.balance) };
    });

    // Agregar ahorros registrados en cada cuenta
    savingsTransactions.forEach(tx => {
      if (!tx.accountId) return;
      const amount = Number(tx.amount);
      const delta = tx.isInflow ? amount : -amount;
      
      if (contributionMap[tx.accountId]) {
        contributionMap[tx.accountId].total += delta;
      } else {
        // En caso de ser una cuenta que no estaba en debitAccounts (ej. Ahorro en Cuenta Corriente vacía)
        // Buscamos el nombre de la cuenta en la lista original
        const accountRef = accounts.find(a => a.id === tx.accountId);
        contributionMap[tx.accountId] = { 
          name: accountRef?.name || "Otra Fuente", 
          total: delta 
        };
      }
    });

    const COLORS = ["bg-indigo-400", "bg-emerald-400", "bg-amber-400", "bg-violet-400", "bg-sky-400", "bg-rose-400"];
    
    const sources = Object.values(contributionMap)
      .filter(item => item.total > 0) // Solo graficar lo positivo
      .sort((a, b) => b.total - a.total) // De mayor a menor
      .map((item, idx) => ({
        name: item.name,
        pct: Math.round((item.total / (totalNetWorth || 1)) * 100),
        color: COLORS[idx % COLORS.length]
      }));

    return {
      patrimonioNeto: totalNetWorth,
      sources: sources.length > 0 ? sources : [{ name: "Sin Activos", pct: 100, color: "bg-zinc-400" }]
    };
  }, [accounts, savingsTransactions]);

  // --- LÓGICA FUNCIONAL DE EGRESOS (DÉBITO VS CRÉDITO) ---
  const monthlyExpensesData = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;

    // Contenedores para graficar por día del mes (31 días max)
    const daysInMonth = new Date(currentYearNum, currentMonthNum, 0).getDate();
    const dailyDebit = Array.from({ length: daysInMonth }, () => 0);
    const dailyCredit = Array.from({ length: daysInMonth }, () => 0);

    expenseTransactions.forEach(tx => {
      const amount = Number(tx.amount);
      const account = accounts.find(a => a.id === tx.accountId);
      
      // Extraer día seguro de la fecha evitando desfase horaria (YYYY-MM-DD...)
      const dateStr = tx.date.split('T')[0];
      const dayOfMonth = parseInt(dateStr.split('-')[2], 10); // 1-31
      const dayIdx = dayOfMonth - 1;

      const isCreditCard = account?.type === "TARJETA_CREDITO";

      if (!isCreditCard) {
        // Es Débito/Efectivo -> Contabiliza completo
        totalDebit += amount;
        if (dayIdx >= 0 && dayIdx < daysInMonth) {
          dailyDebit[dayIdx] += amount;
        }
      } else {
        // Es Crédito -> Aplicar validación de ciclo (día de cierre)
        const closingDay = Number(account?.closingDay || 15); // Default 15 si no tiene

        if (dayOfMonth <= closingDay) {
          // Movimiento realizado el día de cierre o antes -> Entra en la facturación de este mes
          totalCredit += amount;
          if (dayIdx >= 0 && dayIdx < daysInMonth) {
            dailyCredit[dayIdx] += amount;
          }
        }
        // Si es posterior al día de cierre, se ignora ya que el usuario indicó que pasa al mes siguiente
      }
    });

    // Convertir los arrays diarios acumulativos o directos para el Sparkline de Recharts
    // Vamos a generar una curva suave (acumulada suave o por días)
    const sparkDebit = dailyDebit.map(val => ({ val }));
    const sparkCredit = dailyCredit.map(val => ({ val }));

    return {
      totalDebit,
      totalCredit,
      sparkDebit,
      sparkCredit
    };
  }, [expenseTransactions, accounts, currentMonthNum, currentYearNum]);

  const stats = useMemo(() => {
    const currentMonthData = COMPARISON_DATA[COMPARISON_DATA.length - 1];
    const savings = currentMonthData.ingresos - currentMonthData.egresos;
    const savingsPercentage = (savings / currentMonthData.ingresos) * 100;
    return {
      mesActualIngresos: currentMonthData.ingresos,
      mesActualEgresos: currentMonthData.egresos,
      mesActualAhorro: savings,
      porcentajeAhorro: Math.round(savingsPercentage),
    };
  }, []);


  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={cn(
        "relative min-h-screen p-6 lg:p-10 pb-20 space-y-8 w-full transition-all duration-500 ease-in-out",
        !isFullWidth && "max-w-7xl mx-auto"
      )}
    >
      <DashboardHeader 
        isPrivateMode={isPrivateMode}
        onTogglePrivateMode={() => setIsPrivateMode(!isPrivateMode)}
        isFullWidth={isFullWidth}
        onToggleFullWidth={() => setIsFullWidth(!isFullWidth)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NetWorthCard 
          amount={netWorthData.patrimonioNeto}
          isPrivateMode={isPrivateMode}
          sources={netWorthData.sources}
        />
        
        <ExpenseCard 
          amountDebit={monthlyExpensesData.totalDebit}
          amountCredit={monthlyExpensesData.totalCredit}
          isPrivateMode={isPrivateMode}
          chartDataDebit={monthlyExpensesData.sparkDebit}
          chartDataCredit={monthlyExpensesData.sparkCredit}
        />

        <SavingsCard 
          amount={stats.mesActualAhorro}
          isPrivateMode={isPrivateMode}
          percentage={stats.porcentajeAhorro}
          chartData={SPARK_DATA_AHORRO}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <IncomeExpensesChart 
          data={COMPARISON_DATA}
          isPrivateMode={isPrivateMode}
        />

        <SpendingIntelligence 
          categories={EXPENSE_CATEGORIES}
          total={stats.mesActualEgresos}
          isPrivateMode={isPrivateMode}
        />
      </div>

      <SavingsGoals 
        goals={SAVINGS_GOALS}
        isPrivateMode={isPrivateMode}
      />

      <RecentTransactions 
        transactions={RECENT_TRANSACTIONS}
        isPrivateMode={isPrivateMode}
      />

    </motion.div>
  );
}

