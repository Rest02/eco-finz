"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Wallet,
    Target,
    LayoutGrid,
    Calendar,
} from "lucide-react";

const navItems = [
    { icon: Home, href: "/finance/dashboard", label: "Dashboard" },
    { icon: Wallet, href: "/finance/accounts", label: "Cuentas" },
    { icon: Calendar, href: "/finance/calendar", label: "Calendario" },
    { icon: Target, href: "/finance/budgets", label: "Presupuestos" },
    { icon: LayoutGrid, href: "/finance/categories", label: "Categorías" },
];

export const MobileNavbar = () => {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-2 rounded-[28px] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] lg:hidden transition-all duration-300 animate-slide-up">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${isActive
                            ? "bg-black text-white shadow-lg shadow-black/20"
                            : "text-zinc-500 hover:text-black active:scale-95"
                            }`}
                    >
                        <item.icon className="w-5 h-5 stroke-[1.5]" />

                        {/* Subtle Active Indicator Dot for non-active items on hover (optional) */}
                        {!isActive && (
                            <div className="absolute w-1 h-1 bg-zinc-400 rounded-full bottom-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
};
