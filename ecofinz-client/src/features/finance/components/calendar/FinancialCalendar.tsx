import React, { useState } from "react";
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { TimeGrid } from "./TimeGrid";
import { Transaction } from "../../types/finance";
import { useTransactions, useCreateTransaction } from "../../hooks/useTransactions";



export const FinancialCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [direction, setDirection] = useState(0);

    // Calculate start and end date based on view
    let startDate: Date;
    let endDate: Date;

    if (view === 'month') {
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
    } else if (view === 'week') {
        startDate = startOfWeek(currentDate, { locale: es });
        endDate = endOfWeek(currentDate, { locale: es });
    } else {
        startDate = currentDate;
        endDate = currentDate; // Same day
    }

    const { data: transactions } = useTransactions({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
    });

    const createTransactionMutation = useCreateTransaction();

    const handleSaveTransaction = (data: any) => {
        createTransactionMutation.mutate({
            description: data.description,
            amount: Number(data.amount),
            type: data.type,
            date: new Date(data.date).toISOString(),
            accountId: data.accountId,
            categoryId: data.categoryId,
        });
    };

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
                                transactions={transactions?.data || []}
                                onSaveTransaction={handleSaveTransaction}
                            />
                        ) : (
                            <TimeGrid
                                date={currentDate}
                                days={getDaysForView()}
                                transactions={transactions?.data || []}
                                onSaveTransaction={handleSaveTransaction}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
