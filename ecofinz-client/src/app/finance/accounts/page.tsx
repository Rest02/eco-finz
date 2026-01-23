"use client";

import React, { useState } from "react";
import AccountList from "@/features/finance/components/AccountList";
import AccountForm from "@/features/finance/components/AccountForm";
import { useAccounts, useDeleteAccount } from "@/features/finance/hooks/useAccounts";
import { Account } from "@/features/finance/types/finance";
import { Wallet, Info, ArrowUpRight } from "lucide-react";

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
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2.5rem]">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                        <Wallet className="w-5 h-5" />
                        <span className="text-sm tracking-widest uppercase">Mi Billetera</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 tracking-tight">
                        Cuentas
                    </h1>
                    <p className="text-neutral-500 text-lg max-w-md">
                        Gestiona y monitorea todos tus activos financieros en un solo lugar.
                    </p>
                </div>

                <div className="glass-card bg-emerald-500/10 border-emerald-500/20 p-6 rounded-3xl min-w-[240px]">
                    <p className="text-emerald-400/60 text-sm font-medium mb-1 uppercase tracking-wider">Balance Total</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-emerald-500 text-2xl font-bold">$</span>
                        <span className="text-4xl font-black text-white tracking-tighter">
                            {totalBalance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400/40 text-[10px] mt-2 font-medium">
                        <ArrowUpRight className="w-3 h-3" />
                        ACTUALIZADO EN TIEMPO REAL
                    </div>
                </div>
            </div>

            {/* Grid Container for Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

                {/* AccountList Section (Takes 2/3) */}
                <div className="xl:col-span-2 space-y-6 order-2 xl:order-1">
                    {isLoading ? (
                        <div className="glass-card p-20 rounded-[2rem] border border-white/5 bg-white/5 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                <p className="text-neutral-500 font-medium animate-pulse">Cargando tus activos...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-2 md:p-6 rounded-[2rem] border border-white/5 bg-white/[0.02]">
                            <AccountList
                                accounts={accounts}
                                onAccountDeleted={handleDelete}
                                onAccountEdit={handleEdit}
                            />

                            {accounts.length > 0 && (
                                <div className="mt-8 flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-neutral-500 leading-relaxed">
                                        Las cuentas representan tus lugares físicos o digitales de almacenamiento de dinero.
                                        Puedes ver las transacciones detalladas de cada cuenta haciendo clic en el botón de movimientos.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* AccountForm Section (Takes 1/3) */}
                <div className="xl:sticky xl:top-8 order-1 xl:order-2">
                    <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.03] shadow-2xl backdrop-blur-xl">
                        <AccountForm
                            isEditMode={!!editingAccount}
                            initialData={editingAccount || undefined}
                            onCancel={handleCancelEdit}
                            onAccountUpdated={() => setEditingAccount(null)}
                            onAccountCreated={() => {
                                // Optional scroll back to list on mobile
                            }}
                        />
                    </div>

                    {/* Visual Tip */}
                    {!editingAccount && (
                        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-white/5">
                            <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-bold mb-1">PRO TIP</p>
                            <p className="text-xs text-neutral-500">Puedes crear cuentas de tipo <b>Billetera Digital</b> para plataformas como Mercado Pago o PayPal.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
