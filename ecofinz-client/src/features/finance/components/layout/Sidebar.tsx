"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    BarChart2,
    Wallet,
    Settings,
    LogOut,
    Activity,
    Target,
    LayoutGrid,
} from "lucide-react";

const navItems = [
    { icon: Home, href: "/home", label: "Dashboard" },
    { icon: BarChart2, href: "/finance/dashboard", label: "Estadísticas" },
    { icon: Wallet, href: "/finance/accounts", label: "Cuentas" },
    { icon: Target, href: "/finance/budgets", label: "Presupuestos" },
    { icon: LayoutGrid, href: "/finance/categories", label: "Categorías" },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="w-20 lg:w-24 border-r border-white/5 bg-dark-sidebar flex flex-col items-center py-8 z-20 flex-shrink-0 h-screen sticky top-0">
            {/* Brand Icon */}
            <div className="mb-12 p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/10 border border-emerald-500/20 text-emerald-400">
                <Activity className="w-6 h-6" />
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-8 w-full items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group relative p-3 rounded-xl transition-all ${isActive
                                ? "text-white bg-white/10"
                                : "text-neutral-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon className="w-6 h-6 stroke-[1.5]" />
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full -ml-[18px]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col gap-6">
                <Link
                    href="/finance/settings"
                    className="group p-3 rounded-xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all"
                >
                    <Settings className="w-6 h-6 stroke-[1.5]" />
                </Link>
                <button
                    className="group p-3 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    onClick={() => {/* Implement logout logic */ }}
                >
                    <LogOut className="w-6 h-6 stroke-[1.5]" />
                </button>
            </div>
        </aside>
    );
};
