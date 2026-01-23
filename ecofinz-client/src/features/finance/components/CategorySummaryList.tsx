"use client";

import React from "react";
import { SummaryCategory } from "../types/finance";
import { PieChart, AlertCircle, CheckCircle2 } from "lucide-react";

interface CategorySummaryListProps {
    categorySummaries: SummaryCategory[];
}

const CategorySummaryList: React.FC<CategorySummaryListProps> = ({
    categorySummaries,
}) => {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getProgressPercentage = (spent: number, budgeted: number): number => {
        if (budgeted === 0) return 0;
        return Math.min((spent / budgeted) * 100, 100);
    };

    if (categorySummaries.length === 0) {
        return (
            <div className="text-center py-10 bg-white/[0.02] border border-white/5 rounded-3xl">
                <p className="text-neutral-500 text-sm italic">No hay categorías con presupuesto definido.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-neutral-400 mb-2">
                <PieChart className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Ejecución Presupuestaria</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySummaries.map((category) => {
                    const progressPercentage = getProgressPercentage(
                        category.spent,
                        category.budgeted
                    );
                    const isOverBudget = category.remaining < 0;

                    return (
                        <div
                            key={category.categoryId}
                            className={`glass-card p-5 rounded-2xl border transition-all duration-300 hover:bg-white/[0.05] ${isOverBudget ? 'border-red-500/20' : 'border-white/5'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-tight">{category.categoryName}</h4>
                                {isOverBudget ? (
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                    <span className="text-neutral-500">Gastado / Total</span>
                                    <span className="text-white">
                                        {formatCurrency(category.spent)} / {formatCurrency(category.budgeted)}
                                    </span>
                                </div>

                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 rounded-full ${isOverBudget ? 'bg-red-500' : progressPercentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`}
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-1">
                                    <span className="text-neutral-600">Restante</span>
                                    <span className={isOverBudget ? 'text-red-400' : 'text-emerald-400'}>
                                        {formatCurrency(category.remaining)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySummaryList;
