import React from "react";
import { format, addHours, startOfDay, eachHourOfInterval, isSameDay, getHours, getMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Transaction } from "../../types/finance";

interface Props {
    date: Date;
    days: Date[];
    transactions: Transaction[];
}

export const TimeGrid: React.FC<Props> = ({ date, days, transactions }) => {
    // Generate hours for the side column (00:00 to 23:00)
    const dayStart = startOfDay(date);
    const dayEnd = addHours(dayStart, 23);
    const hours = eachHourOfInterval({ start: dayStart, end: dayEnd });

    // Grid config
    const PIXELS_PER_HOUR = 60;

    return (
        <div className="flex h-full border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01] relative">

            {/* Scrollable Container */}
            <div className={cn(
                "flex-1 overflow-y-auto h-full scroll-smooth",
                // Scrollbar Styles
                "[&::-webkit-scrollbar]:w-2",
                "[&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:bg-white/10",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
            )}>
                <div className="flex min-w-full relative">

                    {/* Time Column (Fixed Width) */}
                    <div className="w-16 flex-shrink-0 border-r border-white/5 bg-neutral-900/10 backdrop-blur-sm sticky left-0 z-20">
                        {/* Header Spacer */}
                        <div className="h-10 border-b border-white/5 sticky top-0 bg-neutral-900/90 z-30" />

                        {/* Hours */}
                        {hours.map((hour) => (
                            <div
                                key={hour.toISOString()}
                                className="h-[60px] border-b border-white/5 text-[10px] text-neutral-500 flex items-start justify-center pt-2 font-mono relative"
                            >
                                {format(hour, "HH:mm")}
                                {/* Horizontal Guideline */}
                                <div className="absolute right-0 top-0 w-2 border-t border-white/5" />
                            </div>
                        ))}
                    </div>

                    {/* Columns Grid */}
                    <div className="flex-1 flex flex-col min-w-0">

                        {/* Days Header */}
                        <div className="flex border-b border-white/5 sticky top-0 bg-neutral-900/90 z-30">
                            {days.map((day) => {
                                const isToday = isSameDay(day, new Date());
                                return (
                                    <div
                                        key={day.toISOString()}
                                        className="flex-1 h-10 flex items-center justify-center gap-2 border-r border-white/5 last:border-r-0"
                                    >
                                        <span className="text-neutral-500 text-xs font-medium uppercase">
                                            {format(day, "EEE", { locale: es })}
                                        </span>
                                        <span className={cn(
                                            "w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold",
                                            isToday ? "bg-amber-400 text-black" : "text-white"
                                        )}>
                                            {format(day, "d")}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Event Grid */}
                        <div className="flex flex-1 relative min-h-[1440px]"> {/* 24h * 60px */}

                            {/* Background Lines */}
                            <div className="absolute inset-0 flex">
                                {days.map((day) => (
                                    <div key={`bg-${day.toISOString()}`} className="flex-1 border-r border-white/5 last:border-r-0">
                                        {hours.map((hour) => (
                                            <div key={`line-${day.toISOString()}-${hour}`} className="h-[60px] border-b border-white/[0.02]" />
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Transactions Positioning */}
                            {days.map((day, dayIndex) => {
                                const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), day));

                                return (
                                    <div key={`col-${day.toISOString()}`} className="flex-1 relative border-r border-transparent last:border-r-0">
                                        {dayTransactions.map((t) => {
                                            const tDate = new Date(t.date);
                                            const hour = getHours(tDate);
                                            const minute = getMinutes(tDate);
                                            const topPosition = (hour * PIXELS_PER_HOUR) + ((minute / 60) * PIXELS_PER_HOUR);

                                            // Colors based on type
                                            const bgColor = t.type === 'INGRESO' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                                t.type === 'EGRESO' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                                    'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';

                                            return (
                                                <motion.div
                                                    key={t.id}
                                                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                                    whileHover={{ scale: 1.05, zIndex: 50 }}
                                                    style={{ top: `${topPosition}px` }}
                                                    className={cn(
                                                        "absolute left-1 right-1 p-2 rounded-lg border backdrop-blur-md cursor-pointer",
                                                        "text-xs font-medium flex flex-col gap-0.5 shadow-sm",
                                                        bgColor
                                                    )}
                                                >
                                                    <span className="font-bold">{t.description}</span>
                                                    <span className="opacity-80 font-mono">${t.amount.toLocaleString()}</span>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
