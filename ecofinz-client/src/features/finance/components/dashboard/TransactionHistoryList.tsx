"use client";

import React from "react";
import { Transaction, TransactionType } from "../../types/finance";

interface TransactionItemProps {
    name: string;
    description: string;
    amount: string;
    time: string;
    status: "Completed" | "Processing" | "Failed";
    image: string;
    isHighlighted?: boolean;
    type: TransactionType;
}

const TransactionItem = ({
    name,
    description,
    amount,
    time,
    status,
    image,
    isHighlighted,
    type
}: TransactionItemProps) => {
    const isPositive = type === 'INGRESO';

    return (
        <div className={`flex items-center justify-between p-4 rounded-xl transition-all border group ${isHighlighted
            ? "bg-gradient-to-r from-blue-900/[0.1] to-transparent border-blue-500/10 relative overflow-hidden"
            : "hover:bg-white/[0.02] border-transparent hover:border-white/5"
            }`}>
            {isHighlighted && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}

            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10 flex items-center justify-center text-lg">
                    {image.startsWith('http') ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{image}</span>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className={`text-xs ${isHighlighted ? "text-neutral-400" : "text-neutral-500"}`}>{description}</p>
                </div>
            </div>

            <div className={`hidden md:block text-xs font-mono ${isHighlighted ? "text-blue-200/70" : "text-neutral-500"}`}>
                {time}
            </div>

            <div className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-white'}`}>
                {isPositive ? '+' : '-'}{amount}
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
};

interface TransactionHistoryListProps {
    transactions: Transaction[];
}

export const TransactionHistoryList = ({ transactions }: TransactionHistoryListProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const getTransactionIcon = (type: TransactionType) => {
        switch (type) {
            case 'INGRESO': return "💰";
            case 'EGRESO': return "💸";
            case 'AHORRO': return "🏦";
            case 'INVERSION': return "📈";
            default: return "📄";
        }
    };

    const getTransactionDescription = (type: TransactionType) => {
        switch (type) {
            case 'INGRESO': return "Ingreso de fondos";
            case 'EGRESO': return "Gasto realizado";
            case 'AHORRO': return "Ahorro guardado";
            case 'INVERSION': return "Inversión realizada";
            default: return "Transacción";
        }
    };

    const mappedTransactions: TransactionItemProps[] = transactions.map((tx) => ({
        name: tx.description || "Transacción",
        description: getTransactionDescription(tx.type),
        amount: formatCurrency(tx.amount),
        time: formatDate(tx.date),
        status: "Completed",
        image: getTransactionIcon(tx.type),
        type: tx.type
    }));

    return (
        <div>
            <h3 className="text-lg font-medium text-white mb-6">Historial</h3>
            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-4 pl-1">
                Últimas transacciones realizadas
            </p>

            <div className="space-y-1">
                {mappedTransactions.length > 0 ? (
                    mappedTransactions.map((tx, index) => (
                        <TransactionItem key={index} {...tx} />
                    ))
                ) : (
                    <div className="p-8 text-center text-neutral-500 border border-dashed border-white/10 rounded-xl">
                        No hay transacciones recientes.
                    </div>
                )}
            </div>
        </div>
    );
};
