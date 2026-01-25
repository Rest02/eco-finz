"use client";

import React, { useState } from "react";
import { addMonths, subMonths } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { Transaction } from "../../types/finance";

// --- MOCK DATA FOR DEVELOPMENT ---
const MOCK_TRANSACTIONS: Transaction[] = [
    // Current month transactions (assuming mostly current date for verifying)
    {
        id: "1",
        amount: 1500,
        type: "INGRESO",
        description: "Salario",
        date: new Date().toISOString(),
        accountId: "acc1",
        categoryId: "cat1",
        userId: "user1",
        isInflow: true
    },
    {
        id: "2",
        amount: 50,
        type: "EGRESO",
        description: "Café",
        date: new Date().toISOString(),
        accountId: "acc1",
        categoryId: "cat2",
        userId: "user1",
        isInflow: false
    },
    {
        id: "3",
        amount: 200,
        type: "AHORRO",
        description: "Fondo de Emergencia",
        date: new Date().toISOString(),
        accountId: "acc1",
        categoryId: "cat3",
        userId: "user1",
        isInflow: false
    }
];



export const FinancialCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [direction, setDirection] = useState(0);

    const handlePrevMonth = () => {
        setDirection(-1);
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setDirection(1);
        setCurrentDate(addMonths(currentDate, 1));
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <div className="w-full h-full p-6 bg-neutral-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden flex flex-col">
            <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                view={view}
                onViewChange={setView}
            />

            <div className="flex-1 min-h-[600px] relative overflow-hidden">
                <AnimatePresence initial={false} mode="wait" custom={direction}>
                    {view === 'month' && (
                        <motion.div
                            key={currentDate.toISOString()}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2 }
                            }}
                            className="h-full w-full"
                        >
                            <CalendarGrid
                                currentDate={currentDate}
                                transactions={MOCK_TRANSACTIONS}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {view !== 'month' && (
                    <div className="flex items-center justify-center h-full text-neutral-500">
                        Vista en construcción
                    </div>
                )}
            </div>
        </div>
    );
};


