"use client";

import React, { useState } from "react";
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { TimeGrid } from "./TimeGrid";
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
    },
    // New transactions with specific times for Week/Day view testing
    {
        id: "4",
        amount: 85,
        type: "EGRESO",
        description: "Almuerzo Ejecutivo",
        date: new Date(new Date().setHours(13, 15, 0, 0)).toISOString(),
        accountId: "acc1",
        categoryId: "cat2",
        userId: "user1",
        isInflow: false
    },
    {
        id: "5",
        amount: 1200,
        type: "INGRESO",
        description: "Freelance Project",
        date: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
        accountId: "acc1",
        categoryId: "cat1",
        userId: "user1",
        isInflow: true
    }
];

export const FinancialCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [direction, setDirection] = useState(0);

    const handlePrev = () => {
        setDirection(-1);
        if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
        else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
        else if (view === 'day') setCurrentDate(subDays(currentDate, 1));
    };

    const handleNext = () => {
        setDirection(1);
        if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
        else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
        else if (view === 'day') setCurrentDate(addDays(currentDate, 1));
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

    // Calculate days for view
    const getDaysForView = () => {
        if (view === 'month') return []; // CalendarGrid handles this internally

        if (view === 'week') {
            const start = startOfWeek(currentDate, { locale: es });
            const end = endOfWeek(currentDate, { locale: es });
            return eachDayOfInterval({ start, end });
        }

        if (view === 'day') {
            return [currentDate];
        }

        return [];
    };

    return (
        <div className="w-full h-full p-6 bg-neutral-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden flex flex-col">
            <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={handlePrev}
                onNextMonth={handleNext}
                view={view}
                onViewChange={setView}
            />

            <div className="flex-1 min-h-[600px] relative overflow-hidden">
                <AnimatePresence initial={false} mode="wait" custom={direction}>
                    <motion.div
                        key={`${view}-${currentDate.toISOString()}`}
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
                        {view === 'month' ? (
                            <CalendarGrid
                                currentDate={currentDate}
                                transactions={MOCK_TRANSACTIONS}
                            />
                        ) : (
                            <TimeGrid
                                date={currentDate}
                                days={getDaysForView()}
                                transactions={MOCK_TRANSACTIONS}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
