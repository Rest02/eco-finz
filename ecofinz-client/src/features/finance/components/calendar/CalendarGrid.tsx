import React, { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DayCell } from "./DayCell";
import { Transaction } from "../../types/finance";
import { cn } from "@/lib/utils";

interface Props {
    currentDate: Date;
    transactions: Transaction[];
    onSaveTransaction: (data: any) => void;
}

export const CalendarGrid: React.FC<Props> = ({ currentDate, transactions, onSaveTransaction }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: es }); // Starts on Monday usually or Sunday depending on locale
    const endDate = endOfWeek(monthEnd, { locale: es });

    const dateFormat = "d";
    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]; // Simplified for design

    return (
        <div className="flex flex-col h-full border border-white/5 rounded-2xl bg-white/[0.01] relative overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02] sticky top-0 z-10">
                {weekDays.map((day) => (
                    <div key={day} className="py-3 text-center text-sm font-medium text-neutral-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Scrollable Container */}
            <div className={cn(
                "flex-1 overflow-y-auto overflow-x-hidden",
                // Scrollbar Styles
                "[&::-webkit-scrollbar]:w-2",
                "[&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:bg-white/10",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
            )}>
                {/* Days Grid */}
                <div className="grid grid-cols-7 auto-rows-fr min-h-full">
                    {days.map((day, index) => {
                        // Filter transactions for this specific day
                        const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), day));

                        // Calculate row index (0-based)
                        const rowIndex = Math.floor(index / 7);
                        const totalRows = Math.ceil(days.length / 7);

                        // Calculate column index for left/right positioning
                        const colIndex = index % 7;

                        return (
                            <DayCell
                                key={day.toISOString()}
                                date={day}
                                transactions={dayTransactions}
                                isCurrentMonth={isSameMonth(day, monthStart)}
                                isToday={isSameDay(day, new Date())}
                                rowIndex={rowIndex}
                                totalRows={totalRows}
                                colIndex={colIndex}
                                isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
                                onSaveTransaction={onSaveTransaction}
                                onSelect={(date) => {
                                    // Toggle: if clicking the same date, close it
                                    if (selectedDate && isSameDay(date, selectedDate)) {
                                        setSelectedDate(null);
                                    } else {
                                        setSelectedDate(date);
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


