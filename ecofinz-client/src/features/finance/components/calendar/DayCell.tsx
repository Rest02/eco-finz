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
    onSaveTransaction: (data: any) => void;
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
    onSelect,
    onSaveTransaction
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
        onSaveTransaction(data);
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
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.5)", zIndex: 10 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            onClick={handleClick}
            className={cn(
                "relative flex flex-col p-2 min-h-[100px] border-r border-b border-zinc-200 transition-colors group",
                !isCurrentMonth && "bg-zinc-50/50 text-zinc-300",
                "cursor-pointer",
                isSelected && "bg-white/40 ring-inset ring-1 ring-black/5 z-50 shadow-sm"
            )}
        >
            {/* Date Number */}
            <div className="flex justify-between items-start">
                <span
                    className={cn(
                        "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                        isToday
                            ? "bg-black text-white shadow-lg"
                            : isCurrentMonth ? "text-zinc-500 group-hover:text-black" : "text-zinc-300"
                    )}
                >
                    {format(date, "d")}
                </span>
            </div>

            {/* Indicators / Content */}
            <div className="flex-1 flex flex-col justify-start gap-1 mt-1 overflow-hidden">
                {transactions.map((t) => {
                    const colorClass =
                        t.type === 'INGRESO' ? "bg-emerald-100/80 text-emerald-800 border-emerald-200/50" :
                            t.type === 'EGRESO' ? "bg-rose-100/80 text-rose-800 border-rose-200/50" :
                                t.type === 'AHORRO' ? "bg-cyan-100/80 text-cyan-800 border-cyan-200/50" :
                                    "bg-purple-100/80 text-purple-800 border-purple-200/50";

                    return (
                        <div
                            key={t.id}
                            className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded border truncate font-bold tracking-tight",
                                colorClass
                            )}
                            title={t.description} // Tooltip nativo para ver nombre completo
                        >
                            {t.description}
                        </div>
                    );
                })}
            </div>


            {/* Selection Glow (Optional) */}
            <div className="absolute inset-0 border border-transparent hover:border-black/5 rounded-lg pointer-events-none" />

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


