"use client";

import React from "react";

interface TransactionItemProps {
    name: string;
    description: string;
    amount: string;
    time: string;
    status: "Completed" | "Processing" | "Failed";
    image: string;
    isHighlighted?: boolean;
}

const TransactionItem = ({
    name,
    description,
    amount,
    time,
    status,
    image,
    isHighlighted
}: TransactionItemProps) => (
    <div className={`flex items-center justify-between p-4 rounded-xl transition-all border group ${isHighlighted
            ? "bg-gradient-to-r from-blue-900/[0.1] to-transparent border-blue-500/10 relative overflow-hidden"
            : "hover:bg-white/[0.02] border-transparent hover:border-white/5"
        }`}>
        {isHighlighted && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}

        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <div>
                <p className="text-sm font-medium text-white">{name}</p>
                <p className={`text-xs ${isHighlighted ? "text-neutral-400" : "text-neutral-500"}`}>{description}</p>
            </div>
        </div>

        <div className={`hidden md:block text-xs font-mono ${isHighlighted ? "text-blue-200/70" : "text-neutral-500"}`}>
            {time}
        </div>

        <div className="text-sm font-medium text-white">
            {amount}
        </div>

        <div className={`hidden sm:block px-2.5 py-1 rounded-full text-[10px] font-medium border ${status === "Completed"
                ? "bg-neutral-900 text-neutral-400 border-neutral-800"
                : status === "Processing"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
            {status}
        </div>
    </div>
);

export const TransactionHistoryList = () => {
    const transactions: TransactionItemProps[] = [
        {
            name: "Car Insurance",
            description: "Insurance ID #2938",
            amount: "$350.00",
            time: "10:42:23 AM",
            status: "Completed",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
            name: "Préstamo Personal",
            description: "Pago mensual",
            amount: "$1,200.00",
            time: "10:42:23 AM",
            status: "Processing",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            isHighlighted: true,
        },
        {
            name: "Online Payment",
            description: "Amazon Marketplace",
            amount: "$154.00",
            time: "10:42:23 AM",
            status: "Completed",
            image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    ];

    return (
        <div>
            <h3 className="text-lg font-medium text-white mb-6">Historial</h3>
            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-4 pl-1">
                Transacciones de los últimos 6 meses
            </p>

            <div className="space-y-1">
                {transactions.map((tx, index) => (
                    <TransactionItem key={index} {...tx} />
                ))}
            </div>
        </div>
    );
};
