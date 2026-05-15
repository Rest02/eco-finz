"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingBag,
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
import { useProjections } from "@/features/finance/hooks/useProjections";
import { useSavingsGoals } from "@/features/finance/hooks/useSavingsGoals";


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

  // Rango Histórico para el Gráfico (7 meses atrás para cubrir colas de facturación)
  const startHistoryDate = new Date(currentYearNum, currentMonthNum - 1 - 7, 1);
  const startOfHistory = `${startHistoryDate.getFullYear()}-${String(startHistoryDate.getMonth() + 1).padStart(2, '0')}-01T00:00:00.000Z`;

  // Fetch Real Data
  const { data: accounts = [] } = useAccounts();
  // Fetch Real Data (Todos los ahorros históricos para Patrimonio Neto y cálculo acumulado)
  const { data: transactionResponse } = useTransactions({ type: "AHORRO", limit: 10000 });
  const savingsTransactions = transactionResponse?.data || [];
  
  // Fetch Transacciones en Rango Histórico (unifica el gráfico y las tarjetas actuales)
  const { data: monthlyTransactionsResponse } = useTransactions({ 
    startDate: startOfHistory, 
    endDate: endOfMonth, 
    limit: 10000 
  });
  
  const historicalTransactions = monthlyTransactionsResponse?.data || [];

  // Fetch Proyecciones para distribuir cuotas
  const { data: projectionsData = [] } = useProjections();

  // Fetch Savings Goals Reales
  const { data: savingsGoalsData } = useSavingsGoals();

  // Filtrar en memoria las transacciones que caen estrictamente en el mes calendario actual para tarjetas existentes
  const currentMonthTransactions = useMemo(() => {
    return historicalTransactions.filter(tx => tx.date >= startOfMonth && tx.date <= endOfMonth);
  }, [historicalTransactions, startOfMonth, endOfMonth]);

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
        // CRITICAL FIX: Omitir compras matrices de cuotas, se procesarán vía Proyecciones
        if (tx.description.includes(" | cuotas: ")) return;

        // Es Crédito -> Aplicar validación de ciclo (día de cierre)
        const closingDay = Number(account?.closingDay || 15); // Default 15 si no tiene

        if (dayOfMonth <= closingDay) {
          // Movimiento realizado el día de cierre o antes -> Entra en la facturación de este mes
          totalCredit += amount;
          if (dayIdx >= 0 && dayIdx < daysInMonth) {
            dailyCredit[dayIdx] += amount;
          }
        }
      }
    });

    // Integrar Proyecciones Reales (Cuotas de tarjetas de crédito que impactan ESTE MES)
    const realProjections = projectionsData?.filter(p => !p.isSimulation) || [];
    realProjections.forEach(proj => {
      const monthlyAmount = Number(proj.amount) / Number(proj.installments);
      
      // Identificar si esta proyección impacta el mes actual
      for (let i = 0; i < proj.installments; i++) {
        let currentProjMonth = proj.startMonth + i;
        let currentProjYear = proj.startYear;

        while (currentProjMonth > 12) {
          currentProjMonth -= 12;
          currentProjYear += 1;
        }

        if (currentProjMonth === currentMonthNum && currentProjYear === currentYearNum) {
          totalCredit += monthlyAmount;
          
          // Obtener día de cierre de la cuenta asociada para graficar en Sparkline
          const account = accounts.find(a => a.id === proj.accountId);
          const closingDay = Number(account?.closingDay || 15);
          const dayIdx = Math.min(closingDay, daysInMonth) - 1;
          
          if (dayIdx >= 0 && dayIdx < daysInMonth) {
            dailyCredit[dayIdx] += monthlyAmount;
          }
          break;
        }
      }
    });

    // Convertir los arrays diarios acumulativos o directos para el Sparkline de Recharts
    const sparkDebit = dailyDebit.map(val => ({ val }));
    const sparkCredit = dailyCredit.map(val => ({ val }));

    return {
      totalDebit,
      totalCredit,
      sparkDebit,
      sparkCredit
    };
  }, [expenseTransactions, accounts, currentMonthNum, currentYearNum, projectionsData]);

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

  // --- LÓGICA DINÁMICA DE GRÁFICO DE COMPARACIÓN (Últimos 6 meses) ---
  const comparisonData = useMemo(() => {
    const monthsList: { 
      key: string; 
      label: string; 
      year: number; 
      monthNum: number; 
      ingresos: number; 
      egresosDebito: number; 
      egresosCredito: number; 
    }[] = [];
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    // Construir el esqueleto de los últimos 6 meses (incluyendo el actual)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYearNum, currentMonthNum - 1 - i, 1);
      const mNum = d.getMonth() + 1; 
      const yNum = d.getFullYear();
      const key = `${yNum}-${String(mNum).padStart(2, '0')}`;
      monthsList.push({
        key,
        label: monthNames[d.getMonth()],
        year: yNum,
        monthNum: mNum,
        ingresos: 0,
        egresosDebito: 0,
        egresosCredito: 0,
      });
    }

    // Distribuir montos aplicando reglas de negocio (Cierre Crédito y Exclusión Ahorro)
    historicalTransactions.forEach(tx => {
      const amount = Number(tx.amount);
      const datePart = tx.date.split('T')[0]; 
      const [yStr, mStr, dStr] = datePart.split('-');
      const txYear = parseInt(yStr, 10);
      const txMonth = parseInt(mStr, 10);
      const txDay = parseInt(dStr, 10);

      const account = accounts.find(a => a.id === tx.accountId);
      const isCreditCard = account?.type === "TARJETA_CREDITO";

      if (tx.type === "INGRESO") {
        // Regla: Omitir ingresos dirigidos a una Cuenta de Ahorro Personal
        if (account?.isSavingsAccount) return;

        const targetKey = `${txYear}-${String(txMonth).padStart(2, '0')}`;
        const bucket = monthsList.find(m => m.key === targetKey);
        if (bucket) {
          bucket.ingresos += amount;
        }
      } else if (tx.type === "EGRESO") {
        // CRITICAL FIX: Omitir compras matrices de cuotas, se procesarán vía Proyecciones
        if (isCreditCard && tx.description.includes(" | cuotas: ")) {
          return;
        }

        let billingYear = txYear;
        let billingMonth = txMonth;

        // Regla: Tarjetas de Crédito -> Validar Cierre
        if (isCreditCard) {
          const closingDay = Number(account?.closingDay || 15);
          if (txDay > closingDay) {
            billingMonth += 1;
            if (billingMonth > 12) {
              billingMonth = 1;
              billingYear += 1;
            }
          }
        }

        const targetKey = `${billingYear}-${String(billingMonth).padStart(2, '0')}`;
        const bucket = monthsList.find(m => m.key === targetKey);
        if (bucket) {
          if (isCreditCard) {
            bucket.egresosCredito += amount;
          } else {
            bucket.egresosDebito += amount;
          }
        }
      }
    });

    // Integrar Proyecciones Reales (Parcelar las cuotas en los últimos 6 meses del gráfico)
    // Las proyecciones reales siempre provienen de tarjetas de crédito
    const realProjections = projectionsData?.filter(p => !p.isSimulation) || [];
    realProjections.forEach(proj => {
      const monthlyAmount = Number(proj.amount) / Number(proj.installments);

      for (let i = 0; i < proj.installments; i++) {
        let currentProjMonth = proj.startMonth + i;
        let currentProjYear = proj.startYear;

        while (currentProjMonth > 12) {
          currentProjMonth -= 12;
          currentProjYear += 1;
        }

        const targetKey = `${currentProjYear}-${String(currentProjMonth).padStart(2, '0')}`;
        const bucket = monthsList.find(m => m.key === targetKey);
        if (bucket) {
          bucket.egresosCredito += monthlyAmount;
        }
      }
    });

    return monthsList.map(m => ({
      month: m.label,
      ingresos: m.ingresos,
      egresosDebito: m.egresosDebito,
      egresosCredito: m.egresosCredito,
    }));
  }, [historicalTransactions, accounts, currentYearNum, currentMonthNum, projectionsData]);

  const stats = useMemo(() => {
    const currentMonthData = comparisonData[comparisonData.length - 1] || { ingresos: 0, egresosDebito: 0, egresosCredito: 0 };
    const totalEgresos = currentMonthData.egresosDebito + currentMonthData.egresosCredito;
    const savings = currentMonthData.ingresos - totalEgresos;
    const savingsPercentage = currentMonthData.ingresos > 0 ? (savings / currentMonthData.ingresos) * 100 : 0;
    
    return {
      mesActualIngresos: currentMonthData.ingresos,
      mesActualEgresos: totalEgresos,
      mesActualAhorro: savings,
      porcentajeAhorro: Math.round(savingsPercentage),
    };
  }, [comparisonData]);

  // --- CÁLCULO DE GASTOS POR CATEGORÍA (Inteligencia de Gastos) ---
  const categorizationData = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};

    // 1. Transacciones regulares de Egreso
    expenseTransactions.forEach(tx => {
      const amount = Number(tx.amount);
      const account = accounts.find(a => a.id === tx.accountId);
      const isCreditCard = account?.type === "TARJETA_CREDITO";
      const categoryName = tx.category?.name || "Otros";

      if (!isCreditCard) {
        categoryMap[categoryName] = (categoryMap[categoryName] || 0) + amount;
      } else {
        if (tx.description.includes(" | cuotas: ")) return;

        const dateStr = tx.date.split('T')[0];
        const dayOfMonth = parseInt(dateStr.split('-')[2], 10);
        const closingDay = Number(account?.closingDay || 15);

        if (dayOfMonth <= closingDay) {
          categoryMap[categoryName] = (categoryMap[categoryName] || 0) + amount;
        }
      }
    });

    // 2. Proyecciones/Cuotas vigentes este mes
    const realProjections = projectionsData?.filter(p => !p.isSimulation) || [];
    realProjections.forEach(proj => {
      const monthlyAmount = Number(proj.amount) / Number(proj.installments);
      const categoryName = proj.category?.name || "Otros";

      for (let i = 0; i < proj.installments; i++) {
        let currentProjMonth = proj.startMonth + i;
        let currentProjYear = proj.startYear;

        while (currentProjMonth > 12) {
          currentProjMonth -= 12;
          currentProjYear += 1;
        }

        if (currentProjMonth === currentMonthNum && currentProjYear === currentYearNum) {
          categoryMap[categoryName] = (categoryMap[categoryName] || 0) + monthlyAmount;
          break;
        }
      }
    });

    const totalExpenses = Object.values(categoryMap).reduce((sum, a) => sum + a, 0);

    const colorPalette = [
      "#6366f1", // Indigo
      "#f59e0b", // Amber
      "#ec4899", // Pink
      "#10b981", // Emerald
      "#3b82f6", // Blue
      "#8b5cf6", // Purple
      "#f43f5e", // Rose
      "#06b6d4", // Cyan
      "#f97316", // Orange
      "#84cc16", // Lime
    ];

    const knownColors: { [key: string]: string } = {
      "Alimentación": "#6366f1",
      "Transporte": "#f59e0b",
      "Entretenimiento": "#ec4899",
      "Compras": "#10b981",
      "Servicios": "#3b82f6",
      "Otros": "#94a3b8",
    };

    return Object.entries(categoryMap)
      .map(([name, value], index) => {
        const percentage = totalExpenses > 0 ? (value / totalExpenses) * 100 : 0;
        const color = knownColors[name] || colorPalette[index % colorPalette.length];
        return {
          name,
          value: Math.round(value),
          color,
          percentage: parseFloat(percentage.toFixed(1)),
        };
      })
      .sort((a, b) => b.value - a.value);

  }, [expenseTransactions, accounts, projectionsData, currentMonthNum, currentYearNum]);

  // --- CÁLCULO DE ÚLTIMOS MOVIMIENTOS (Últimos 30 días, máx 5) ---
  const recentTransactionsData = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const filtered = historicalTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      const isWithinLast30Days = txDate >= thirtyDaysAgo && txDate <= now;
      const isRelevantType = tx.type === "INGRESO" || tx.type === "EGRESO";
      return isWithinLast30Days && isRelevantType;
    });

    const sorted = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const top5 = sorted.slice(0, 5);

    return top5.map(tx => {
      const isIncome = tx.type === "INGRESO";
      const d = new Date(tx.date);
      
      const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear();

      let formattedDate = "";
      if (isToday) {
        formattedDate = "Hoy";
      } else if (isYesterday) {
        formattedDate = "Ayer";
      } else {
        formattedDate = d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" }).replace(".", "");
      }

      // 1. Parseo avanzado de Cuotas/Crédito del título
      let displayDesc = tx.description;
      let installmentInfo: { count: number; monthlyAmount: number } | undefined = undefined;

      if (tx.description.includes(" | cuotas: ")) {
        const parts = tx.description.split(" | cuotas: ");
        displayDesc = parts[0];
        const count = parseInt(parts[1], 10);
        if (!isNaN(count) && count > 0) {
          installmentInfo = {
            count,
            monthlyAmount: Math.round(Number(tx.amount) / count)
          };
        }
      }

      // 2. Localización de Cuenta Bancaria Asociada
      const account = accounts.find(a => a.id === tx.accountId);

      return {
        id: tx.id,
        desc: displayDesc,
        amount: isIncome ? Number(tx.amount) : -Number(tx.amount),
        date: formattedDate,
        icon: isIncome ? DollarSign : ShoppingBag,
        color: isIncome ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50",
        category: tx.category?.name || (isIncome ? "Ingresos" : "Gastos"),
        accountName: account?.name || "",
        installmentInfo,
      };
    });
  }, [historicalTransactions, accounts]);

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
          data={comparisonData}
          isPrivateMode={isPrivateMode}
        />

        <SpendingIntelligence 
          categories={categorizationData}
          total={stats.mesActualEgresos}
          isPrivateMode={isPrivateMode}
        />
      </div>

      <SavingsGoals 
        goals={(savingsGoalsData?.goals ?? []).map(g => ({
          id: g.id,
          name: g.name,
          target: g.targetAmount,
          current: g.currentAmount,
          color: g.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-500',
        }))}
        isPrivateMode={isPrivateMode}
      />

      <RecentTransactions 
        transactions={recentTransactionsData}
        isPrivateMode={isPrivateMode}
      />

    </motion.div>
  );
}

