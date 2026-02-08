"use client";

import React from "react";
import { Budget } from "../types/finance";
import { Tag, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface Props {
    budget: Budget;
}

const BudgetCard: React.FC<Props> = ({ budget }) => {
    const { name, amount, spent = 0, category } = budget;

    // Calculate percentage
    const percentage = Math.min(100, Math.max(0, (spent / amount) * 100));
    const remaining = amount - spent;
    const isOverBudget = spent > amount;

    // Determine colors based on percentage
    let progressBarColor = "bg-emerald-500";
    let textColor = "text-emerald-400";
    let icon = <CheckCircle className="w-5 h-5 text-emerald-400" />;

    if (percentage >= 100) {
        progressBarColor = "bg-red-500";
        textColor = "text-red-400";
        icon = <AlertTriangle className="w-5 h-5 text-red-400" />;
    } else if (percentage >= 75) {
        progressBarColor = "bg-amber-500";
        textColor = "text-amber-400";
        icon = <TrendingUp className="w-5 h-5 text-amber-400" />;
    }

    const formatCurrency = (val: number) =>
        val.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    return (
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 space-y-4 hover:shadow-md transition-all group">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-black font-bold text-lg">{name}</h3>
                    {category && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 uppercase tracking-wider font-medium">
                            <Tag className="w-3 h-3" />
                            <span>{category.name}</span>
                        </div>
                    )}
                </div>
                <div className={`p-2 rounded-xl bg-zinc-50 border border-zinc-100 ${isOverBudget ? 'animate-pulse' : ''}`}>
                    {icon}
                </div>
            </div>

            {/* Amounts */}
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Gastado</p>
                    <p className={`text-2xl font-bold ${textColor}`}>
                        ${formatCurrency(spent)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Total</p>
                    <p className="text-lg font-bold text-black">
                        ${formatCurrency(amount)}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                    <span className={textColor}>{percentage.toFixed(0)}%</span>
                    <span className="text-zinc-500">
                        {isOverBudget
                            ? `Excedido por $${formatCurrency(Math.abs(remaining))}`
                            : `Quedan $${formatCurrency(remaining)}`
                        }
                    </span>
                </div>
                <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-100">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${progressBarColor} ${isOverBudget ? 'w-full' : ''}`}
                        style={{ width: isOverBudget ? '100%' : `${percentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default BudgetCard;
