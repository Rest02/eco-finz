"use client";

import React, { useState } from "react";
import AccountList from "@/features/finance/components/AccountList";
import AccountForm from "@/features/finance/components/AccountForm";
import { useAccounts, useDeleteAccount } from "@/features/finance/hooks/useAccounts";
import { Account } from "@/features/finance/types/finance";
import { Wallet, Info, ArrowUpRight, TrendingUp, ShieldCheck } from "lucide-react";

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

    const totalBalance = accounts.reduce((acc, account) => acc + Number(account.balance), 0);

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-fade-in bg-white min-h-full">
            {/* Page Header & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Header Title Section */}
                <div className="lg:col-span-2 flex flex-col justify-center gap-4 py-4">
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
                        <p className="text-zinc-500 text-lg max-w-lg leading-relaxed">
                            Centraliza el control de tus activos. Monitorea saldos, edita detalles y mantén tu salud financiera al día.
                        </p>
                    </div>
                </div>

                {/* Total Balance Card */}
                <div className="clean-card p-8 flex flex-col justify-between h-full bg-white border border-black shadow-sm rounded-[32px] hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                            <TrendingUp className="w-6 h-6 text-black stroke-1" />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 border border-zinc-200">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            +2.4% este mes
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-zinc-400 font-medium text-sm tracking-widest uppercase mb-1">Balance Total</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-semibold text-zinc-400">$</span>
                            <span className="text-5xl md:text-6xl font-black tracking-tighter text-black">
                                {totalBalance.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                {/* Account List (Left Side) */}
                <div className="xl:col-span-8 space-y-6 order-2 xl:order-1">
                    {isLoading ? (
                        <div className="rounded-[32px] border border-zinc-100 bg-zinc-50 p-20 flex flex-col items-center justify-center gap-4 min-h-[400px]">
                            <div className="w-10 h-10 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
                            <p className="text-zinc-400 font-medium animate-pulse">Sincronizando activos...</p>
                        </div>
                    ) : (
                        <div className="rounded-[32px] border border-zinc-200 bg-white p-2 md:p-8 shadow-sm">
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
                </div>

                {/* Account Form (Right Sticky Side) */}
                <div className="xl:col-span-4 xl:sticky xl:top-6 order-1 xl:order-2 space-y-6">
                    <div className="clean-card p-6 border border-zinc-200 bg-white shadow-lg shadow-zinc-200/50 rounded-[32px]">
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
                </div>

            </div>
        </div>
    );
}
