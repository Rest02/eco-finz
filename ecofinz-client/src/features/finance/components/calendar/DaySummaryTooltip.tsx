import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
    income: number;
    expenses: number;
    savings: number;
}

const DaySummaryTooltip: React.FC<Props> = ({ income, expenses, savings }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={cn(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50",
                "w-48 p-3 rounded-xl",
                "bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-xl",
                "flex flex-col gap-2 pointer-events-none"
            )}
        >
            {/* Income */}
            <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Ingresos</span>
                <span className="font-medium text-emerald-400">+${income.toLocaleString()}</span>
            </div>

            {/* Expenses */}
            <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Egresos</span>
                <span className="font-medium text-rose-400">-${expenses.toLocaleString()}</span>
            </div>

            {/* Savings */}
            <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Ahorros</span>
                <span className="font-medium text-cyan-400">${savings.toLocaleString()}</span>
            </div>

            {/* Triangle Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900/90" />
        </motion.div>
    );
};

export default DaySummaryTooltip;
