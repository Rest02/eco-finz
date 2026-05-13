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

  const lastDayOfMonth = new Date(currentYearNum, currentMonthNum, 0).getDate();
  const mm = String(currentMonthNum).padStart(2, '0');
  const startOfMonth = `${currentYearNum}-${mm}-01T00:00:00.000Z`;
  const endOfMonth = `${currentYearNum}-${mm}-${String(lastDayOfMonth).padStart(2, '0')}T23:59:59.999Z`;

  // Fetch Real Data
  const { data: accounts = [] } = useAccounts();
  // Fetch Real Data (Todos los ahorros históricos para Patrimonio Neto y cálculo acumulado)
  const { data: transactionResponse } = useTransactions({ type: "AHORRO", limit: 10000 });
  const savingsTransactions = transactionResponse?.data || [];
  
  // Fetch TODAS las transacciones del mes actual para unificar cálculos del dashboard
  const { data: monthlyTransactionsResponse } = useTransactions({ 
    startDate: startOfMonth, 
    endDate: endOfMonth, 
    limit: 10000 
  });
  const currentMonthTransactions = monthlyTransactionsResponse?.data || [];

  // Filtrar egresos para mantener compatibilidad con la lógica de tarjetas de crédito/débito
  const expenseTransactions = useMemo(() => 
    currentMonthTransactions.filter(tx => tx.type === "EGRESO"), 
    [currentMonthTransactions]
  );

  // Process Real Data for "Patrimonio Neto" and "Fuentes"
  const netWorthData = useMemo(() => {
    // Suma de balances de cuentas de débito (no crédito), que ya reflejan todo su dinero actual históricamente
    const debitAccounts = accounts.filter(a => a.type !== "TARJETA_CREDITO");
    const totalNetWorth = debitAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    // Desglose por cuenta para mostrar las fuentes reales (Tarjetas de Débito/Efectivo)
    const contributionMap: Record<string, { name: string, total: number }> = {};

    debitAccounts.forEach(a => {
      contributionMap[a.id] = { name: a.name, total: Number(a.balance) };
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
  }, [accounts]);

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

  // --- LÓGICA FUNCIONAL DE AHORRO (ENTRADAS VS SALIDAS DEL MES) ---
  const monthlySavingsData = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;

    const daysInMonth = new Date(currentYearNum, currentMonthNum, 0).getDate();
    const dailyIn = Array.from({ length: daysInMonth }, () => 0);
    const dailyOut = Array.from({ length: daysInMonth }, () => 0);
    
    currentMonthTransactions.forEach(tx => {
      const amount = Number(tx.amount);
      const dateStr = tx.date.split('T')[0]; // YYYY-MM-DD
      const dayOfMonth = parseInt(dateStr.split('-')[2], 10);
      const dayIdx = dayOfMonth - 1;
      
      const account = accounts.find(a => a.id === tx.accountId);

      if (tx.type === "AHORRO") {
        // Ignorar patas secundarias (+) de transferencias para procesar solo el ahorro raíz (-)
        if (tx.isInflow) return;

        // Validar si el ahorro se originó de una cuenta que ya es de ahorro
        // Si el origen es una cuenta de ahorro, representa una salida del fondo de ahorro
        if (account?.isSavingsAccount) {
          totalOut += amount;
          if (dayIdx >= 0 && dayIdx < daysInMonth) {
            dailyOut[dayIdx] += amount;
          }
        } else {
          // Si se originó de una cuenta normal o manual, es una entrada a los ahorros
          totalIn += amount;
          if (dayIdx >= 0 && dayIdx < daysInMonth) {
            dailyIn[dayIdx] += amount;
          }
        }
      } else if (tx.type === "INGRESO" && account?.isSavingsAccount) {
        // Ingreso directo a cuenta de ahorro = Incremento de ahorro
        totalIn += amount;
        if (dayIdx >= 0 && dayIdx < daysInMonth) {
          dailyIn[dayIdx] += amount;
        }
      } else if (tx.type === "EGRESO" && account?.isSavingsAccount) {
        // Egreso directo de cuenta de ahorro = Salida de ahorro
        totalOut += amount;
        if (dayIdx >= 0 && dayIdx < daysInMonth) {
          dailyOut[dayIdx] += amount;
        }
      }
    });

    const sparkIn = dailyIn.map(val => ({ val }));
    const sparkOut = dailyOut.map(val => ({ val }));

    return {
      totalIn,
      totalOut,
      sparkIn,
      sparkOut
    };
  }, [currentMonthTransactions, accounts, currentMonthNum, currentYearNum]);

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

  // --- CÁLCULO DE AHORRO TOTAL HISTÓRICO (Balances de cuentas + movimientos manuales) ---
  const allTimeSavingsTotal = useMemo(() => {
    // 1. Suma de balances de cuentas marcadas como cuenta de ahorro personal
    const savingsAccountsBalance = accounts
      .filter(a => a.isSavingsAccount)
      .reduce((sum, acc) => sum + Number(acc.balance), 0);

    // 2. Suma acumulada de movimientos de ahorro históricos que NO están en una cuenta de ahorro (para evitar duplicar)
    const otherSavingsTransactionsTotal = savingsTransactions.reduce((sum, tx) => {
      // Ignorar patas de entrada (+) para trabajar solo con los registros raíz de ahorro (-)
      if (tx.isInflow) return sum;

      const amount = Number(tx.amount);

      if (tx.relatedTransactionId) {
        // Si es una transferencia, buscamos la transacción vinculada (destino) en el historial de ahorros
        const linkedTx = savingsTransactions.find(t => t.id === tx.relatedTransactionId);
        if (linkedTx) {
          const destAccount = accounts.find(a => a.id === linkedTx.accountId);
          // Si la cuenta de destino ya es una cuenta de ahorro, la omitimos ya que ya se sumó en su balance
          if (destAccount?.isSavingsAccount) return sum;
        }
      } else {
        // Caso manual sin transferencia (origen directo)
        const originAccount = accounts.find(a => a.id === tx.accountId);
        if (originAccount?.isSavingsAccount) return sum; // Ya contemplado en el balance
      }

      return sum + amount;
    }, 0);

    return savingsAccountsBalance + otherSavingsTransactionsTotal;
  }, [accounts, savingsTransactions]);


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
          totalSavings={allTimeSavingsTotal}
          amountIn={monthlySavingsData.totalIn}
          amountOut={monthlySavingsData.totalOut}
          isPrivateMode={isPrivateMode}
          chartDataIn={monthlySavingsData.sparkIn}
          chartDataOut={monthlySavingsData.sparkOut}
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

