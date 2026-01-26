import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Transaction } from "../../types/finance";
import DaySummaryTooltip from "./DaySummaryTooltip";
import { TransactionFloatingWidget } from "./TransactionFloatingWidget";

interface Props {
    date: Date;
    transactions: Transaction[];
    isCurrentMonth: boolean;
    isToday: boolean;
    rowIndex?: number; // Para determinar si está en las últimas filas
    totalRows?: number;
    colIndex?: number; // Para determinar posicionamiento izquierda/derecha
    isSelected?: boolean; // Controlado externamente
    onSelect?: (date: Date) => void; // Handler para selección
}

export const DayCell: React.FC<Props> = ({
    date,
    transactions,
    isCurrentMonth,
    isToday,
    rowIndex = 0,
    totalRows = 6,
    colIndex = 0,
    isSelected = false,
    onSelect
}) => {

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

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onSelect) {
            onSelect(date);
        }
    };

    const handleSaveTransaction = (data: any) => {
        console.log("Saving transaction:", data);
        // Here you would call an API or prop function
        if (onSelect) {
            onSelect(date); // This will close it via parent
        }
    };

    // Determine widget position based on column (day of week)
    // colIndex: 0=Lun, 1=Mar, 2=Mié, 3=Jue, 4=Vie, 5=Sáb, 6=Dom
    const isWeekend = colIndex === 5 || colIndex === 6; // Sábado o Domingo

    // Widget se abre al mismo nivel vertical del cuadrante
    // A la derecha para días normales, a la izquierda para fin de semana
    const widgetStyle = isWeekend ? {
        top: 0,
        right: "100%",
        marginRight: "10px"
    } : {
        top: 0,
        left: "100%",
        marginLeft: "10px"
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.03)", zIndex: 10 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            onClick={handleClick}
            className={cn(
                "relative flex flex-col p-2 min-h-[100px] border-r border-b border-white/5 transition-colors group",
                !isCurrentMonth && "bg-neutral-900/30 text-neutral-700",
                "cursor-pointer",
                isSelected && "bg-white/[0.05] ring-inset ring-1 ring-white/10 z-50"
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

            {/* Floating Widget */}
            {isSelected && (
                <AnimatePresence>
                    <TransactionFloatingWidget
                        date={date}
                        hour={9} // Default hour for month view
                        onClose={() => onSelect && onSelect(date)}
                        onSave={handleSaveTransaction}
                        style={widgetStyle}
                    />
                </AnimatePresence>
            )}
        </motion.div>
    );
};


