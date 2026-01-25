import React from "react";
import { CreditCard, ArrowLeftRight, Landmark, FileCheck, MoreVertical } from "lucide-react";
import { Account, MonthlySummary } from "../../types/finance";

interface StatCardProps {
    title: string;
    amount: string;
    icon: React.ElementType;
    colorClass: string;
    glowClass: string;
}

const StatCard = ({ title, amount, icon: Icon, colorClass, glowClass }: StatCardProps) => (
    <div className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <MoreVertical className="w-5 h-5 text-neutral-500" />
        </div>
        <div className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 stroke-[1.5]" />
        </div>
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{title}</p>
        <h3 className="text-2xl font-semibold text-white tracking-tight">{amount}</h3>
        {/* Glow effect */}
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${glowClass} blur-[40px] rounded-full transition-colors`} />
    </div>
);

interface StatsGridProps {
    accounts: Account[];
    summary?: MonthlySummary;
}

export const StatsGrid = ({ accounts, summary }: StatsGridProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const stats = [
        {
            title: "Saldo Total",
            amount: formatCurrency(accounts.reduce((acc, curr) => acc + curr.balance, 0)),
            icon: CreditCard,
            colorClass: "bg-indigo-500/10 text-indigo-400",
            glowClass: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
        },
        {
            title: "Ingresos Mes",
            amount: formatCurrency(summary?.totalIncome || 0),
            icon: ArrowLeftRight,
            colorClass: "bg-emerald-500/10 text-emerald-400",
            glowClass: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
        },
        {
            title: "Gastos Mes",
            amount: formatCurrency(summary?.totalExpenses || 0),
            icon: FileCheck,
            colorClass: "bg-rose-500/10 text-rose-400",
            glowClass: "bg-rose-500/10 group-hover:bg-rose-500/20",
        },
        {
            title: "Cuentas Activas",
            amount: accounts.length.toString(),
            icon: Landmark,
            colorClass: "bg-amber-500/10 text-amber-400",
            glowClass: "bg-amber-500/10 group-hover:bg-amber-500/20",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};
