"use client";

import React from "react";
import { Search, Calendar, Bell } from "lucide-react";

export const DashboardHeader = () => {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
                <h1 className="text-3xl font-semibold text-white tracking-tight">Dashboard</h1>
                <p className="text-sm text-neutral-500 mt-1">Actualizaciones de pagos y análisis.</p>
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full md:w-64 pl-10 pr-3 py-2.5 border border-white/10 rounded-full leading-5 bg-white/[0.03] text-neutral-300 placeholder-neutral-600 focus:outline-none focus:bg-white/[0.08] focus:border-white/20 transition-all sm:text-sm"
                        placeholder="Buscar transacción..."
                    />
                </div>

                {/* Actions */}
                <button className="p-2.5 rounded-full border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                    <Calendar className="w-5 h-5 stroke-[1.5]" />
                </button>

                <button className="p-2.5 rounded-full border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/10 transition-all relative">
                    <Bell className="w-5 h-5 stroke-[1.5]" />
                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </button>

                {/* Profile */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-600 border border-white/10 overflow-hidden relative cursor-pointer ring-2 ring-transparent hover:ring-white/20 transition-all">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-dark-bg rounded-full" />
                </div>
            </div>
        </header>
    );
};
