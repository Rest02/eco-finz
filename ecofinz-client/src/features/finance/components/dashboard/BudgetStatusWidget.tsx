
import { useMemo } from "react";

interface BudgetStatusWidgetProps {
    totalBudget: number;
    totalSpent: number;
    currency?: string;
}

export function BudgetStatusWidget({ totalBudget, totalSpent, currency = "$" }: BudgetStatusWidgetProps) {
    const remaining = totalBudget - totalSpent;
    const percentageSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Determine status color
    const getStatusColor = () => {
        if (percentageSpent >= 100) return "text-red-500";
        if (percentageSpent >= 80) return "text-yellow-500";
        return "text-emerald-500";
    };

    const statusColor = getStatusColor();
    const progressBarColor = percentageSpent >= 100 ? "bg-red-500" : percentageSpent >= 80 ? "bg-yellow-500" : "bg-emerald-500";

    return (
        <div className="clean-card h-full flex flex-col justify-between">
            <div>
                <h3 className="text-zinc-500 text-sm font-medium mb-1">Presupuesto Restante</h3>
                <div className="flex items-baseline space-x-2">
                    <span className={`text-4xl font-bold tracking-tight ${remaining < 0 ? "text-red-500" : "text-black"}`}>
                        {currency}{remaining.toLocaleString()}
                    </span>
                    <span className="text-zinc-400 text-sm">
                        de {currency}{totalBudget.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex justify-between text-xs font-medium mb-2 text-zinc-500">
                    <span>Gastado: {Math.min(percentageSpent, 100).toFixed(0)}%</span>
                    <span>{percentageSpent >= 100 ? "Presupuesto Excedido" : "En rango"}</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${progressBarColor}`}
                        style={{ width: `${Math.min(percentageSpent, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
