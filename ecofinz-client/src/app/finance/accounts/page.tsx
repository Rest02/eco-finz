"use client";

import React from "react";

export default function AccountsPage() {
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

                {/* Stats Summary could go here in the future */}
                <div className="flex gap-4">
                    {/* Placeholder for total balance or similar */}
                </div>
            </div>

            {/* Grid Container for Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left/Main Column: List (Takes 2/3) */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 min-h-[400px] flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                                <span className="text-2xl text-emerald-400">🏦</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white">Próximamente: Lista de Cuentas</h3>
                            <p className="text-neutral-500 max-w-xs mx-auto mt-2">
                                Aquí aparecerán todas tus cuentas integradas con el diseño glassmorphism.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form (Takes 1/3) */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 min-h-[400px] flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                <span className="text-2xl text-blue-400">➕</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white">Próximamente: Formulario</h3>
                            <p className="text-neutral-500 max-w-xs mx-auto mt-2">
                                Panel para crear y editar cuentas de forma dinámica.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
