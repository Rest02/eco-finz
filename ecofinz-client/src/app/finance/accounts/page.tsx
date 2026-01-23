"use client";

import React, { useState } from "react";
import AccountList from "@/features/finance/components/AccountList";
import AccountForm from "@/features/finance/components/AccountForm";
import { useAccounts, useDeleteAccount } from "@/features/finance/hooks/useAccounts";
import { Account } from "@/features/finance/types/finance";

export default function AccountsPage() {
    // Tarea 2.1: Hook useAccounts
    const { data: accounts = [], isLoading } = useAccounts();
    const deleteAccountMutation = useDeleteAccount();

    // Tarea 2.4: Estado para modo Edición
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);

    const handleEdit = (account: Account) => {
        setEditingAccount(account);
    };

    const handleCancelEdit = () => {
        setEditingAccount(null);
    };

    // Tarea 2.5: Conectar eliminación
    const handleDelete = async (accountId: string) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta cuenta?")) {
            try {
                await deleteAccountMutation.mutateAsync(accountId);
            } catch (error) {
                console.error("Error deleting account:", error);
            }
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">
                        Mis Cuentas
                    </h1>
                    <p className="text-neutral-500 mt-2 text-lg">
                        Gestiona tus billeteras, bancos y activos financieros.
                    </p>
                </div>
            </div>

            {/* Grid Container for Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 content-start">

                {/* Tarea 2.2: Integrar AccountList (Takes 2/3) */}
                <div className="xl:col-span-2 space-y-6">
                    {isLoading ? (
                        <div className="glass-card p-12 rounded-3xl border border-white/5 bg-white/5 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                <p className="text-neutral-500 font-medium">Cargando tus cuentas...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5">
                            <AccountList
                                accounts={accounts}
                                onAccountDeleted={handleDelete}
                                onAccountEdit={handleEdit}
                            />
                        </div>
                    )}
                </div>

                {/* Tarea 2.3: Integrar AccountForm (Takes 1/3) */}
                <div className="relative">
                    <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 sticky top-8">
                        <AccountForm
                            isEditMode={!!editingAccount}
                            initialData={editingAccount || undefined}
                            onCancel={handleCancelEdit}
                            onAccountUpdated={() => setEditingAccount(null)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
