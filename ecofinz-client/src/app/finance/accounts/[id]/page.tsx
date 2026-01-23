"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TransactionList from "@/features/finance/components/TransactionList";
import TransactionForm from "@/features/finance/components/TransactionForm";
import TransactionFilters from "@/features/finance/components/TransactionFilters";
import { useTransactions, useDeleteTransaction } from "@/features/finance/hooks/useTransactions";
import { useAccount } from "@/features/finance/hooks/useAccounts";
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
  switch (type) {
    case "BANCO": return "bg-blue-500/20 text-blue-400 glow-blue-500";
    case "BILLETERA_DIGITAL": return "bg-emerald-500/20 text-emerald-400 glow-emerald-500";
    case "EFECTIVO": return "bg-amber-500/20 text-amber-400 glow-amber-500";
    case "TARJETA_CREDITO": return "bg-purple-500/20 text-purple-400 glow-purple-500";
    default: return "bg-neutral-500/20 text-neutral-400 glow-neutral-500";
  }
};

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  const { data: account, isLoading: isLoadingAccount } = useAccount(accountId);
  const { data: transactionResponse, isLoading: isLoadingTransactions } = useTransactions({
    accountId,
    type: filterValues.type || undefined,
    categoryId: filterValues.categoryId || undefined,
    startDate: filterValues.startDate || undefined,
    endDate: filterValues.endDate || undefined
  });

  const deleteTransactionMutation = useDeleteTransaction();
  const transactions = transactionResponse?.data || [];

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
      <div className="p-8 text-center text-neutral-500">
        Cuenta no encontrada. <Link href="/finance/accounts" className="text-emerald-400">Volver</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">

      {/* Header & Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Volver a Cuentas</span>
          </button>

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getAccountColor(account.type).split(' glow-')[0]}`}>
              {getAccountIcon(account.type)}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
                {account.name}
              </h1>
              <p className="text-neutral-500 text-sm font-medium tracking-widest uppercase">
                Detalle de Movimientos
              </p>
            </div>
          </div>
        </div>

        {/* Account Balance Card (Redesigned StatCard Style) */}
        <div className="group relative glass-card p-6 md:p-8 rounded-3xl min-w-[280px] overflow-hidden transition-all duration-300">
          <p className="text-xs font-semibold text-emerald-400/60 uppercase tracking-widest mb-1 relative z-10">Balance Disponible</p>

          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-emerald-500 text-2xl font-bold">$</span>
            <span className="text-4xl font-black text-white tracking-tighter">
              {account.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400/30 text-[10px] mt-4 font-bold tracking-widest uppercase relative z-10">
            <ArrowUpRight className="w-3 h-3" />
            Actualizado en tiempo real
          </div>

          {/* Glow effect based on account color */}
          <div className={`absolute -bottom-6 -right-6 w-32 h-32 blur-[50px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity ${account.type === 'BANCO' ? 'bg-blue-500' :
            account.type === 'BILLETERA_DIGITAL' ? 'bg-emerald-500' :
              account.type === 'EFECTIVO' ? 'bg-amber-500' :
                'bg-purple-500'
            }`} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

        {/* Main Section (List & Filters) */}
        <div className="xl:col-span-2 space-y-6">
          <TransactionFilters onFilterChange={setFilterValues} />

          <div className="glass-card bg-white/[0.01] p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <History className="w-5 h-5 text-neutral-600" />
              <h2 className="text-lg font-bold text-white/90 uppercase tracking-widest">
                Historial de Movimientos
              </h2>
            </div>

            {isLoadingTransactions ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-neutral-600 text-sm animate-pulse">Obteniendo transacciones...</p>
              </div>
            ) : (
              <TransactionList
                transactions={transactions}
                onEdit={handleTransactionEdit}
                onDelete={handleDeleteTransaction}
              />
            )}
          </div>
        </div>

        {/* Sidebar Section (Form) */}
        <div className="xl:sticky xl:top-8">
          <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.03] shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 text-neutral-400">
              <PlusCircle className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Registrar Acción</span>
            </div>

            <TransactionForm
              accountId={accountId}
              initialData={editingTransaction || undefined}
              isEditMode={!!editingTransaction}
              onCancel={() => setEditingTransaction(null)}
              onTransactionUpdated={() => setEditingTransaction(null)}
            />
          </div>

          {/* Hint Card */}
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-white/5">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black mb-1">Dato Útil</p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Registrar tus gastos e ingresos diariamente te ayuda a tener un control total de tu economía <b>¡No dejes pasar ninguno!</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
