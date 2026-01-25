"use client";

import React from "react";
import { Droplet, Briefcase, Zap, Wifi, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Transaction } from "../../types/finance";

interface ActivityItemProps {
    icon: React.ElementType;
    title: string;
    status: string;
    amount: string;
    colorClass: string;
}

const ActivityItem = ({ icon: Icon, title, status, amount, colorClass }: ActivityItemProps) => (
    <div className="flex items-center justify-between group cursor-pointer">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
                <Icon className={`w-5 h-5 text-neutral-400 group-hover:${colorClass} transition-colors stroke-[1.5]`} />
            </div>
            <div>
                <p className={`text-sm font-medium text-white group-hover:${colorClass} transition-colors`}>{title}</p>
                <p className="text-xs text-neutral-500">{status}</p>
            </div>
        </div>
        <span className={`text-sm font-medium ${amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>
            {amount}
        </span>
    </div>
);

interface RecentActivityListProps {
    transactions: Transaction[];
}

export const RecentActivityList = ({ transactions }: RecentActivityListProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const mappedActivities = transactions.map((tx) => ({
        icon: tx.type === 'INGRESO' ? ArrowUpRight : ArrowDownLeft,
        title: tx.description || "Transacción",
        status: "Completado",
        amount: (tx.type === 'INGRESO' ? '+' : '-') + formatCurrency(tx.amount),
        colorClass: tx.type === 'INGRESO' ? "text-emerald-400" : "text-rose-400",
    }));

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Actividad Reciente</h3>
                <button className="text-xs text-neutral-500 hover:text-white transition-colors">Ver todo</button>
            </div>

            <div className="space-y-6">
                {mappedActivities.length > 0 ? (
                    mappedActivities.map((activity, index) => (
                        <ActivityItem key={index} {...activity} />
                    ))
                ) : (
                    <p className="text-sm text-neutral-600">No hay actividad reciente.</p>
                )}
            </div>
        </div>
    );
};
