"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TransactionList from "@/features/finance/components/TransactionList";
import Pagination from "@/features/finance/components/Pagination";
import TransactionForm from "@/features/finance/components/TransactionForm";
import TransactionFilters from "@/features/finance/components/TransactionFilters";
import PayCreditCardForm from "@/features/finance/components/PayCreditCardForm";
import { useTransactions, useDeleteTransaction } from "@/features/finance/hooks/useTransactions";
import { useAccount } from "@/features/finance/hooks/useAccounts";
import { useProjections } from "@/features/finance/hooks/useProjections";
import { getBillingPeriod, getNextBillingPeriod, getBilledAmountWithProjections, getUnbilledAmountWithProjections } from "@/features/finance/utils/creditCardUtils";
import { Transaction, TransactionType, AccountType } from "@/features/finance/types/finance";
import Link from "next/link";
import {
  ChevronLeft,
  ArrowUpRight,
  Wallet,
  Landmark,
  Banknote,
  CreditCard,
  History,
  PlusCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";

interface FilterValues {
  type?: TransactionType | "";
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

const getAccountIcon = (type: AccountType) => {
  switch (type) {
    case "BANCO": return <Landmark className="w-6 h-6" />;
    case "BILLETERA_DIGITAL": return <Wallet className="w-6 h-6" />;
    case "EFECTIVO": return <Banknote className="w-6 h-6" />;
    case "TARJETA_CREDITO": return <CreditCard className="w-6 h-6" />;
    default: return <Wallet className="w-6 h-6" />;
  }
};

const getAccountColor = (type: AccountType) => {
  // Ultra-Clean Neutral Style (Matches AccountList)
  return "bg-zinc-100 border border-zinc-200 text-black";
};

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [page, setPage] = useState(1);
  const [showPayForm, setShowPayForm] = useState(false);

  const { data: account, isLoading: isLoadingAccount } = useAccount(accountId);
  const { data: transactionResponse, isLoading: isLoadingTransactions } = useTransactions({
    accountId,
    type: filterValues.type || undefined,
    categoryId: filterValues.categoryId || undefined,
    startDate: filterValues.startDate || undefined,
    endDate: filterValues.endDate || undefined,
    page,
    limit: 10,
  });

  const { data: calcResponse } = useTransactions({ accountId, limit: 10000 });

  const { data: allProjections = [] } = useProjections();
  const deleteTransactionMutation = useDeleteTransaction();
  const transactions = transactionResponse?.data || [];
  const allAccountTransactions = calcResponse?.data || [];

  const isCreditCard = account?.type === "TARJETA_CREDITO";
  const totalDeuda = Math.abs(Number(account?.balance || 0));
  
  const closingDay = Number(account?.closingDay || 15);
  const accountProjections = allProjections.filter(p => p.accountId === accountId);
  const deudaPeriodoActual = getBilledAmountWithProjections(allAccountTransactions, accountProjections, closingDay, accountId);
  const deudaPeriodoSiguiente = getUnbilledAmountWithProjections(allAccountTransactions, accountProjections, closingDay, accountId);
  const { start: periodStart, end: periodEnd } = getBillingPeriod(closingDay);
  const { start: nextPeriodStart } = getNextBillingPeriod(closingDay);

  const totalPagos = allAccountTransactions.reduce(
    (sum, tx) => tx.type === "INGRESO" ? sum + Number(tx.amount) : sum, 0
  );

  const cupoDisponible = isCreditCard
    ? Number(account?.creditLimit || 0) - totalDeuda
    : Number(account?.balance || 0);

  const handleTransactionEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta transacción?")) {
      await deleteTransactionMutation.mutateAsync(transactionId);
    }
  };

  if (isLoadingAccount) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="p-8 text-center text-zinc-500">
        Cuenta no encontrada. <Link href="/finance/accounts" className="text-emerald-500 font-bold">Volver</Link>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 lg:p-10 space-y-8 min-h-full animate-fade-in"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Header & Back Button */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
        
        {/* Left Section (xl:col-span-2) */}
        <div className="xl:col-span-2 flex flex-col md:flex-row md:items-stretch justify-between gap-6 w-full">
          <div className="space-y-4 flex flex-col justify-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Volver a Cuentas</span>
            </button>

            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getAccountColor(account.type)}`}>
                {getAccountIcon(account.type)}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                  {account.name}
                </h1>
                <p className="text-zinc-500 text-sm font-medium tracking-wide">
                  Detalle de Movimientos
                </p>
              </div>
            </div>
          </div>

          {/* New Deuda Actual Card - Placed in the highlighted section of the image */}
          {isCreditCard && (
            <div className="group relative bg-white/20 border border-white/30 p-6 lg:p-8 rounded-2xl min-w-[280px] md:min-w-[320px] overflow-hidden transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px] flex flex-col h-full"
              style={{ backdropFilter: 'blur(5px)' }}>
              <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-1 relative z-10">Deuda Total Utilizada</p>

              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-red-400 text-2xl font-bold">$</span>
                <span className="text-4xl font-bold text-black tracking-tight">
                  {totalDeuda.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-zinc-200/40 space-y-1.5 relative z-10 text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                <div className="flex justify-between items-center">
                  <span>Facturado ({periodStart.getDate()} {periodStart.toLocaleDateString('es-ES', { month: 'short' })} → {periodEnd.getDate()} {periodEnd.toLocaleDateString('es-ES', { month: 'short' })}):</span>
                  <span className="text-red-600 font-extrabold">
                    ${deudaPeriodoActual.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                {account?.dueDay && (
                  <div className="flex justify-between items-center text-[9px] text-zinc-400 -mt-0.5">
                    <span>Vence el {account.dueDay} de {periodEnd.toLocaleDateString('es-ES', { month: 'long' })}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Próximo ({nextPeriodStart.getDate()} {nextPeriodStart.toLocaleDateString('es-ES', { month: 'short' })} en adelante):</span>
                  <span className="text-zinc-600 font-extrabold">
                    ${deudaPeriodoSiguiente.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-200/40 pt-1.5 mt-1.5">
                  <span className="text-emerald-600">Pagos realizados:</span>
                  <span className="text-emerald-600 font-extrabold">
                    -${totalPagos.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <div className="absolute top-0 right-0 p-12 bg-red-100/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          )}
        </div>

        {/* Right Section (xl:col-span-1) - stretches to match the sidebar form exactly! */}
        <div className="xl:col-span-1 w-full h-full">
          <div className="group relative bg-white/20 border border-white/30 p-6 lg:p-8 rounded-2xl w-full h-full flex flex-col overflow-hidden transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px]"
            style={{ backdropFilter: 'blur(5px)' }}>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1 relative z-10">
              {isCreditCard ? "Cupo Disponible" : "Balance Disponible"}
            </p>

            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-zinc-400 text-2xl font-bold">$</span>
              <span className="text-4xl font-bold text-black tracking-tight">
                {cupoDisponible.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] mt-auto pt-4 font-bold tracking-widest uppercase relative z-10">
              <ArrowUpRight className="w-3 h-3" />
              {isCreditCard 
                ? `Cupo Total: $${Number(account.creditLimit || 0).toLocaleString('es-CL', { maximumFractionDigits: 0 })}`
                : "Actualizado en tiempo real"
              }
            </div>

            {/* Subtle shine effect instead of colored glow */}
            <div className="absolute top-0 right-0 p-12 bg-white/40 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

         {/* Main Section (List & Filters) */}
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-6">
          <TransactionFilters onFilterChange={(f) => { setFilterValues(f); setPage(1); }} isCreditCard={isCreditCard} />

          <div className="bg-white/20 border border-white/30 p-6 rounded-[2rem] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px]" style={{ backdropFilter: 'blur(5px)' }}>
            <div className="flex items-center gap-3 mb-6">
              <History className="w-5 h-5 text-zinc-600" />
              <h2 className="text-lg font-bold text-black uppercase tracking-widest">
                Historial de Movimientos
              </h2>
            </div>

            {isLoadingTransactions ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-zinc-600 text-sm animate-pulse">Obteniendo transacciones...</p>
              </div>
            ) : (
              <>
                <TransactionList
                  transactions={transactions}
                  onEdit={handleTransactionEdit}
                  onDelete={handleDeleteTransaction}
                />
                {transactionResponse?.meta && (
                  <Pagination
                    page={transactionResponse.meta.page}
                    lastPage={transactionResponse.meta.lastPage}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Sidebar Section (Form) */}
        <motion.div variants={itemVariants} className="xl:sticky xl:top-8">
          <div className="bg-white/20 border border-white/30 p-8 rounded-[2rem] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px]" style={{ backdropFilter: 'blur(5px)' }}>
            <div className="flex items-center gap-3 mb-6 text-zinc-500">
              <PlusCircle className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Registrar Acción</span>
            </div>

            <TransactionForm
              accountId={accountId}
              isCreditCard={isCreditCard}
              initialData={editingTransaction || undefined}
              isEditMode={!!editingTransaction}
              onCancel={() => setEditingTransaction(null)}
              onTransactionUpdated={() => setEditingTransaction(null)}
            />
          </div>

          {/* Pay Credit Card Section */}
          {isCreditCard && (
            <div className="mt-4 bg-white/20 border border-white/30 p-8 rounded-[2rem] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px]" style={{ backdropFilter: 'blur(5px)' }}>
              {showPayForm ? (
                <PayCreditCardForm
                  creditCardAccountId={accountId}
                  creditCardName={account.name}
                  debtAmount={totalDeuda}
                  billedAmount={deudaPeriodoActual}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Pago de Tarjeta</span>
                  </div>
                  <button
                    onClick={() => setShowPayForm(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]"
                  >
                    Pagar Tarjeta
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hint Card */}
          <div className="mt-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1">Dato Útil</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Registrar tus gastos e ingresos diariamente te ayuda a tener un control total de tu economía <b>¡No dejes pasar ninguno!</b>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
