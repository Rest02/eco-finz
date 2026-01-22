"use client";

import React from "react";
import { Home, Car, ChevronRight } from "lucide-react";

interface PaymentItemProps {
    icon: React.ElementType;
    title: string;
    status: string;
    amount: string;
}

const PaymentItem = ({ icon: Icon, title, status, amount }: PaymentItemProps) => (
    <div className="flex items-center justify-between group cursor-pointer">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                <Icon className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
            </div>
            <div>
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="text-xs text-amber-500/80">{status}</p>
            </div>
        </div>
        <span className="text-sm font-medium text-white">{amount}</span>
    </div>
);

export const UpcomingPayments = () => {
    const payments: PaymentItemProps[] = [
        {
            icon: Home,
            title: "Home Rent",
            status: "Pending",
            amount: "$1,500",
        },
        {
            icon: Car,
            title: "Car Insurance",
            status: "Pending",
            amount: "$150",
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Próximos Pagos</h3>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>

            <p className="text-xs text-neutral-600 mb-4">13 Mar 2024</p>

            <div className="space-y-6">
                {payments.map((payment, index) => (
                    <PaymentItem key={index} {...payment} />
                ))}
            </div>
        </div>
    );
};
