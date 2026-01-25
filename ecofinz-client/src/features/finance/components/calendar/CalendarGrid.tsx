import React from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DayCell } from "./DayCell";
import { Transaction } from "../../types/finance";
import { cn } from "@/lib/utils";

interface Props {
    currentDate: Date;
    transactions: Transaction[];
}

export const CalendarGrid: React.FC<Props> = ({ currentDate, transactions }) => {
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
        <div className="flex flex-col h-full border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02]">
                {weekDays.map((day) => (
                    <div key={day} className="py-3 text-center text-sm font-medium text-neutral-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                {days.map((day) => {
                    // Filter transactions for this specific day
                    const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), day));

                    return (
                        <DayCell
                            key={day.toISOString()}
                            date={day}
                            transactions={dayTransactions}
                            isCurrentMonth={isSameMonth(day, monthStart)}
                            isToday={isSameDay(day, new Date())}
                        />
                    );
                })}
            </div>
        </div>
    );
};


