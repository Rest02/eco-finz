"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
        <aside className="w-20 lg:w-24 border-r border-zinc-200 bg-white flex flex-col items-center py-8 z-20 flex-shrink-0 h-screen sticky top-0">
            {/* Brand Icon */}
            <div className="mb-12">
                <div className="relative w-12 h-12">
                    <Image
                        src="/logo.png"
                        alt="EcoFinz Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
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
                                ? "bg-black text-white shadow-md"
                                : "text-zinc-400 hover:text-black hover:bg-zinc-100"
                                }`}
                        >
                            <item.icon className="w-6 h-6 stroke-[1.5]" />
                            {/* Removed the side marker for a cleaner button look, 
                                but if needed for 'active' indication outside of bg color, 
                                we can re-add or adjust. 
                                The 'bg-black text-white' is a storing enough indicator per brand guide. 
                            */}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col gap-6">
                <Link
                    href="/finance/settings"
                    className="group p-3 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all"
                >
                    <Settings className="w-6 h-6 stroke-[1.5]" />
                </Link>
                <button
                    className="group p-3 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    onClick={() => {/* Implement logout logic */ }}
                >
                    <LogOut className="w-6 h-6 stroke-[1.5]" />
                </button>
            </div>
        </aside>
    );
};
