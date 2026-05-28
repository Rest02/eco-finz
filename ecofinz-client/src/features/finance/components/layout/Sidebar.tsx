"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Home,
    Wallet,
    Settings,
    LogOut,
    Target,
    LayoutGrid,
    Calendar,
    CreditCard,
    PiggyBank,
    ChevronRight,
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

export const Sidebar = () => {
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
        <aside className="hidden lg:flex flex-col items-center py-8 z-50 flex-shrink-0 h-[calc(100vh-2rem)] sticky top-4 ml-4 my-4 w-24 rounded-[32px] bg-white/60 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            {/* Brand Icon */}
            <div className="mb-10">
                <div className="relative w-11 h-11 transition-transform duration-500 hover:scale-110">
                    <Image
                        src="/logo.png"
                        alt="EcoFinz Logo"
                        fill
                        className="object-contain drop-shadow-sm"
                        priority
                    />
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-5 w-full items-center px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${isActive
                                ? "bg-black text-white shadow-lg shadow-black/20 scale-105"
                                : "text-zinc-500 hover:text-black hover:bg-white/80"
                                }`}
                        >
                            <item.icon className="w-5 h-5 stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />

                            {!isActive && (
                                <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/50 transition-colors pointer-events-none" />
                            )}
                        </Link>
                    );
                })}

                {/* Proyección — Popover Trigger */}
                <div className="relative">
                    <button
                        ref={triggerRef}
                        onClick={() => setProjectionOpen(!projectionOpen)}
                        className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${isProjectionActive
                            ? "bg-black text-white shadow-lg shadow-black/20 scale-105"
                            : "text-zinc-500 hover:text-black hover:bg-white/80"
                            }`}
                    >
                        <CreditCard className="w-5 h-5 stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
                        {!isProjectionActive && (
                            <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/50 transition-colors pointer-events-none" />
                        )}
                    </button>

                    {/* Popover */}
                    {projectionOpen && (
                        <div
                            ref={popoverRef}
                            className="absolute left-16 top-0 min-w-[160px] rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-2 space-y-1"
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

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col gap-4 px-4 pb-2">
                <Link
                    href="/finance/settings"
                    className="group flex items-center justify-center w-12 h-12 rounded-2xl text-zinc-400 hover:text-black hover:bg-white/80 transition-all duration-300"
                >
                    <Settings className="w-5 h-5 stroke-[1.5] transition-transform group-hover:rotate-90" />
                </Link>
                <button
                    className="group flex items-center justify-center w-12 h-12 rounded-2xl text-zinc-400 hover:text-red-500 hover:bg-red-50/80 transition-all duration-300"
                    onClick={() => { }}
                >
                    <LogOut className="w-5 h-5 stroke-[1.5]" />
                </button>
            </div>
        </aside>
    );
};
