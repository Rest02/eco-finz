"use client";

import React from "react";
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
} from "lucide-react";

const navItems = [
    { icon: Home, href: "/finance/dashboard", label: "Dashboard" },
    { icon: Wallet, href: "/finance/accounts", label: "Cuentas" },
    { icon: Calendar, href: "/finance/calendar", label: "Calendario" },
    { icon: Target, href: "/finance/budgets", label: "Presupuestos" },
    { icon: LayoutGrid, href: "/finance/categories", label: "Categorías" },
];

export const Sidebar = () => {
    const pathname = usePathname();

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

                            {/* Active Indicator Hover Effect */}
                            {!isActive && (
                                <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/50 transition-colors pointer-events-none" />
                            )}
                        </Link>
                    );
                })}
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
                    onClick={() => {/* Implement logout logic */ }}
                >
                    <LogOut className="w-5 h-5 stroke-[1.5]" />
                </button>
            </div>
        </aside>
    );
};
