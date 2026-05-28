"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Wallet,
    Target,
    LayoutGrid,
    Calendar,
    CreditCard,
    PiggyBank,
} from "lucide-react";

const navItems = [
    { icon: Home, href: "/finance/dashboard", label: "Dashboard" },
    { icon: Wallet, href: "/finance/accounts", label: "Cuentas" },
    { icon: PiggyBank, href: "/finance/savings", label: "Ahorros" },
    { icon: Calendar, href: "/finance/calendar", label: "Calendario" },
    { icon: Target, href: "/finance/budgets", label: "Presupuestos" },
    { icon: LayoutGrid, href: "/finance/categories", label: "Categorías" },
];

const projectionSubItems = [
    { icon: CreditCard, href: "/finance/projection", label: "Por Pagar" },
    { icon: PiggyBank, href: "/finance/projection/savings", label: "Ahorros" },
];

export const MobileNavbar = () => {
    const pathname = usePathname();
    const [projectionOpen, setProjectionOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setProjectionOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isProjectionActive =
        pathname === "/finance/projection" ||
        pathname === "/finance/projection/savings";

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
                        {!isActive && (
                            <div className="absolute w-1 h-1 bg-zinc-400 rounded-full bottom-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </Link>
                );
            })}

            {/* Proyección — Popover Trigger */}
            <div className="relative">
                <button
                    ref={triggerRef}
                    onClick={() => setProjectionOpen(!projectionOpen)}
                    className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${isProjectionActive
                        ? "bg-black text-white shadow-lg shadow-black/20"
                        : "text-zinc-500 hover:text-black active:scale-95"
                        }`}
                >
                    <CreditCard className="w-5 h-5 stroke-[1.5]" />
                    {!isProjectionActive && (
                        <div className="absolute w-1 h-1 bg-zinc-400 rounded-full bottom-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </button>

                {/* Popover — aparece arriba del navbar */}
                {projectionOpen && (
                    <div
                        ref={popoverRef}
                        className="absolute bottom-16 left-1/2 -translate-x-1/2 min-w-[150px] rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-2 space-y-1"
                    >
                        {projectionSubItems.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                                <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={() => setProjectionOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isSubActive
                                        ? "bg-black text-white"
                                        : "text-zinc-600 hover:text-black hover:bg-white/60"
                                        }`}
                                >
                                    <sub.icon className="w-4 h-4 stroke-[1.5]" />
                                    {sub.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </nav>
    );
};
