import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Transaction } from "../../types/finance";
import DaySummaryTooltip from "./DaySummaryTooltip";

interface Props {
    date: Date;
    transactions: Transaction[];
    isCurrentMonth: boolean;
    isToday: boolean;
}

export const DayCell: React.FC<Props> = ({ date, transactions, isCurrentMonth, isToday }) => {

    // Calculate totals
    const summary = useMemo(() => {
        let income = 0;
        let expenses = 0;
        let savings = 0;

        transactions.forEach(t => {
            // Assuming logic based on transaction type
            if (t.type === 'INGRESO') income += t.amount;
            else if (t.type === 'EGRESO') expenses += t.amount;
            else if (t.type === 'AHORRO') savings += t.amount;
            else if (t.type === 'INVERSION') savings += t.amount; // Treat investment as savings for now
        });

        return { income, expenses, savings };
    }, [transactions]);

    const hasActivity = transactions.length > 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.03)", zIndex: 10 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            className={cn(
                "relative flex flex-col p-2 min-h-[100px] border-r border-b border-white/5 transition-colors group",
                !isCurrentMonth && "bg-neutral-900/30 text-neutral-700",
                "cursor-pointer"
            )}
        >
            {/* Date Number */}
            <div className="flex justify-between items-start">
                <span
                    className={cn(
                        "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                        isToday
                            ? "bg-amber-400 text-black shadow-lg shadow-amber-900/20"
                            : isCurrentMonth ? "text-neutral-400 group-hover:text-white" : "text-neutral-700"
                    )}
                >
                    {format(date, "d")}
                </span>
            </div>

            {/* Indicators / Content */}
            <div className="flex-1 flex flex-col justify-end gap-1.5 mt-2">
                {hasActivity && (
                    <>
                        {/* Visual Indicators (Bars/Pills) */}
                        <div className="flex gap-1 flex-wrap">
                            {summary.income > 0 && (
                                <div className="h-1.5 w-full max-w-[40%] rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
                            )}
                            {summary.expenses > 0 && (
                                <div className="h-1.5 w-full max-w-[30%] rounded-full bg-rose-400/80 shadow-[0_0_8px_rgba(251,113,133,0.3)]" />
                            )}
                            {summary.savings > 0 && (
                                <div className="h-1.5 w-full max-w-[20%] rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.3)]" />
                            )}
                        </div>

                        {/* Hover Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                            <DaySummaryTooltip
                                income={summary.income}
                                expenses={summary.expenses}
                                savings={summary.savings}
                            />
                        </div>
                    </>
                )}
            </div>


            {/* Selection Glow (Optional) */}
            <div className="absolute inset-0 border border-transparent hover:border-white/10 rounded-lg pointer-events-none" />
        </motion.div>
    );
};


