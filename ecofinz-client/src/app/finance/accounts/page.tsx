"use client";

import React, { useState } from "react";
import AccountList from "@/features/finance/components/AccountList";
import AccountForm from "@/features/finance/components/AccountForm";
import { useAccounts, useDeleteAccount } from "@/features/finance/hooks/useAccounts";
import { Account } from "@/features/finance/types/finance";
import { Wallet, Info, ArrowUpRight, TrendingUp, ShieldCheck, CreditCard } from "lucide-react";

import { BackgroundAurora } from "@/features/ui/BackgroundAurora";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";

export default function AccountsPage() {
    const { data: accounts = [], isLoading } = useAccounts();
    const deleteAccountMutation = useDeleteAccount();

    const [editingAccount, setEditingAccount] = useState<Account | null>(null);

    const handleEdit = (account: Account) => {
        setEditingAccount(account);
        // Scroll to form on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingAccount(null);
    };

    const handleDelete = async (accountId: string) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta cuenta? Esta acción no se puede deshacer.")) {
            try {
                await deleteAccountMutation.mutateAsync(accountId);
            } catch (error) {
                console.error("Error deleting account:", error);
            }
        }
    };

    const debitAccounts = accounts.filter(acc => acc.type !== "TARJETA_CREDITO");
    const creditAccounts = accounts.filter(acc => acc.type === "TARJETA_CREDITO");

    const totalDebit = debitAccounts.reduce((acc, account) => acc + Number(account.balance), 0);
    const totalCreditDebt = creditAccounts.reduce((acc, account) => acc + Math.abs(Number(account.balance)), 0);

    return (
        <>
            <BackgroundAurora />
            <motion.div
                className="p-4 lg:p-10 space-y-6 lg:space-y-8 animate-fade-in relative min-h-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Page Header & Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Header Title Section */}
                    <div className="flex flex-col justify-center gap-4 py-4">
                        <div className="flex items-center gap-3 text-black mb-1">
                            <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200">
                                <Wallet className="w-5 h-5 stroke-1" />
                            </div>
                            <span className="text-xs font-bold tracking-widest uppercase text-zinc-500">Gestión Financiera</span>
                        </div>

                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-2">
                                Mis Cuentas
                            </h1>
                            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                                Centraliza el control de tus activos. Monitorea saldos, edita detalles y mantén tu salud financiera al día.
                            </p>
                        </div>
                    </div>

                    {/* Debit Total Card */}
                    <div className="clean-card p-6 lg:p-8 flex flex-col justify-between h-full bg-white/20 border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px] rounded-2xl hover:shadow-md transition-shadow" style={{ backdropFilter: 'blur(5px)' }}>
                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                                <TrendingUp className="w-6 h-6 stroke-1" />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-100">
                                Disponible
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-zinc-400 font-medium text-xs tracking-widest uppercase mb-1">Total Débito</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-semibold text-zinc-400">$</span>
                                <span className="text-4xl font-black tracking-tight text-black">
                                    {totalDebit.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Credit Debt Card */}
                    <div className="clean-card p-6 lg:p-8 flex flex-col justify-between h-full bg-white/20 border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px] rounded-2xl hover:shadow-md transition-shadow" style={{ backdropFilter: 'blur(5px)' }}>
                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600">
                                <CreditCard className="w-6 h-6 stroke-1" />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-100">
                                Por Pagar
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-zinc-400 font-medium text-xs tracking-widest uppercase mb-1">Total Crédito (Deuda)</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-semibold text-zinc-400">$</span>
                                <span className="text-4xl font-black tracking-tight text-black">
                                    {totalCreditDebt.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">

                    {/* Account List (Left Side) */}
                    <motion.div variants={itemVariants} className="xl:col-span-8 space-y-6">
                        {isLoading ? (
                            <div className="rounded-[32px] border border-zinc-100 bg-zinc-50 p-20 flex flex-col items-center justify-center gap-4 min-h-[400px]">
                                <div className="w-10 h-10 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
                                <p className="text-zinc-400 font-medium animate-pulse">Sincronizando activos...</p>
                            </div>
                        ) : (
                            <div className="clean-card rounded-[32px] border border-white/30 bg-white/20 p-5 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px]" style={{ backdropFilter: 'blur(5px)' }}>
                                <AccountList
                                    accounts={accounts}
                                    onAccountDeleted={handleDelete}
                                    onAccountEdit={handleEdit}
                                />

                                {accounts.length > 0 && (
                                    <div className="mt-8 flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
                                        <div className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-500 shrink-0">
                                            <Info className="w-4 h-4 stroke-1" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-black">Información sobre tus cuentas</p>
                                            <p className="text-xs text-zinc-500 leading-relaxed">
                                                Las cuentas representan tus lugares físicos o digitales de almacenamiento de dinero.
                                                El saldo total se calcula automáticamente sumando el balance actual de todas las cuentas activas.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Account Form (Right Sticky Side) */}
                    <motion.div variants={itemVariants} className="xl:col-span-4 xl:sticky xl:top-6 space-y-6">
                        <div className="clean-card p-6 border border-white/30 bg-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px] rounded-[32px]" style={{ backdropFilter: 'blur(5px)' }}>
                            <AccountForm
                                isEditMode={!!editingAccount}
                                initialData={editingAccount || undefined}
                                onCancel={handleCancelEdit}
                                onAccountUpdated={() => setEditingAccount(null)}
                                onAccountCreated={() => {
                                    // Optional scroll logic
                                }}
                            />
                        </div>

                        {/* Contextual Help / Validations */}
                        {!editingAccount && (
                            <div className="px-6 py-5 rounded-[2rem] border border-zinc-200 bg-zinc-50">
                                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black mb-2">Pro Tip</p>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Para una mejor organización, intenta mantener separadas tus cuentas de <b>Ahorro</b> y <b>Gastos Diarios</b>.
                                </p>
                            </div>
                        )}
                    </motion.div>

                </div>
            </motion.div>
        </>
    );
}
