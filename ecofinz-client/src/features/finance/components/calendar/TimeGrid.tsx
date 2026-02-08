import React, { useState, useEffect } from "react";
import { format, addHours, startOfDay, eachHourOfInterval, isSameDay, getHours, getMinutes, addDays, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Transaction } from "../../types/finance";
import { TransactionFloatingWidget } from "./TransactionFloatingWidget";

interface Props {
    date: Date;
    days: Date[];
    transactions: Transaction[];
    onSaveTransaction: (data: any) => void;
}

export const TimeGrid: React.FC<Props> = ({ date, days, transactions, onSaveTransaction }) => {
    // Selection state for creating new transaction
    const [selectedSlot, setSelectedSlot] = useState<{ date: Date, hour: number } | null>(null);

    // Current time state for the red line indicator
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Generate hours for the side column (00:00 to 23:00)
    const dayStart = startOfDay(date);
    const dayEnd = addHours(dayStart, 23);
    const hours = eachHourOfInterval({ start: dayStart, end: dayEnd });

    // Grid config
    const PIXELS_PER_HOUR = 60;

    const handleSlotClick = (day: Date, hour: number) => {
        if (selectedSlot && isSameDay(selectedSlot.date, day) && selectedSlot.hour === hour) {
            setSelectedSlot(null); // Deselect if clicking same
        } else {
            setSelectedSlot({ date: day, hour });
        }
    };

    const handleSaveTransaction = (data: any) => {
        onSaveTransaction(data);
        setSelectedSlot(null);
    };

    return (
        <div className="flex h-full border border-zinc-200 rounded-2xl overflow-hidden bg-white/40 relative">

            {/* Scrollable Container */}
            <div className={cn(
                "flex-1 overflow-y-auto h-full scroll-smooth",
                "relative",
                // Scrollbar Styles
                "[&::-webkit-scrollbar]:w-2",
                "[&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:bg-zinc-200",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-300"
            )}>
                <div className="flex min-w-full relative">

                    {/* Time Column (Fixed Width) */}
                    <div className="w-16 flex-shrink-0 border-r border-zinc-200 bg-white/40 backdrop-blur-sm sticky left-0 z-20">
                        {/* Header Spacer */}
                        <div className="h-10 border-b border-zinc-200 sticky top-0 bg-white/95 z-30" />

                        {/* Hours */}
                        {hours.map((hour) => (
                            <div
                                key={hour.toISOString()}
                                className="h-[60px] border-b border-zinc-100 text-[10px] text-zinc-400 flex items-start justify-center pt-2 font-mono relative"
                            >
                                {format(hour, "HH:mm")}
                                {/* Horizontal Guideline */}
                                <div className="absolute right-0 top-0 w-2 border-t border-zinc-200" />
                            </div>
                        ))}
                    </div>

                    {/* Columns Grid */}
                    <div className="flex-1 flex flex-col min-w-0">

                        {/* Days Header */}
                        <div className="flex border-b border-zinc-200 sticky top-0 bg-zinc-100/95 z-30 backdrop-blur-sm">
                            {days.map((day) => {
                                const isToday = isSameDay(day, new Date());
                                return (
                                    <div
                                        key={day.toISOString()}
                                        className="flex-1 h-10 flex items-center justify-center gap-2 border-r border-zinc-200 last:border-r-0"
                                    >
                                        <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                            {format(day, "EEE", { locale: es })}
                                        </span>
                                        <span className={cn(
                                            "w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold",
                                            isToday ? "bg-black text-white" : "text-black"
                                        )}>
                                            {format(day, "d")}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Event Grid */}
                        <div className="flex flex-1 relative min-h-[1440px]"> {/* 24h * 60px */}

                            {/* Background Lines & Interaction Layer */}
                            <div className="absolute inset-0 flex">
                                {days.map((day) => (
                                    <div key={`bg-${day.toISOString()}`} className="flex-1 border-r border-zinc-100 last:border-r-0 relative">
                                        {hours.map((hour) => {
                                            const hourNum = getHours(hour);
                                            const isSelected = selectedSlot && isSameDay(selectedSlot.date, day) && selectedSlot.hour === hourNum;

                                            // Determine Widget Position logic
                                            // If it's the last column, maybe show it on left? For now default: next column (right)
                                            // We render widget INSIDE the slot but position it absolutely to overflow

                                            return (
                                                <div
                                                    key={`slot-${day.toISOString()}-${hourNum}`}
                                                    onClick={() => handleSlotClick(day, hourNum)}
                                                    className={cn(
                                                        "h-[60px] border-b border-zinc-100 cursor-pointer transition-colors relative",
                                                        "hover:bg-zinc-50",
                                                        isSelected && "bg-white ring-inset ring-1 ring-black/5 shadow-sm z-10"
                                                    )}
                                                >
                                                    {isSelected && (() => {
                                                        // Detectar si es sábado (6) o domingo (0)
                                                        const dayOfWeek = getDay(day);
                                                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                                                        // Posicionar a la izquierda si es fin de semana, a la derecha si no
                                                        const widgetStyle = isWeekend ? {
                                                            top: -10,
                                                            right: "100%", // A la izquierda del slot
                                                            marginRight: "10px"
                                                        } : {
                                                            top: -10,
                                                            left: "100%", // A la derecha del slot
                                                            marginLeft: "10px"
                                                        };

                                                        return (
                                                            <AnimatePresence>
                                                                <TransactionFloatingWidget
                                                                    date={day}
                                                                    hour={hourNum}
                                                                    onClose={() => setSelectedSlot(null)}
                                                                    onSave={handleSaveTransaction}
                                                                    style={widgetStyle}
                                                                />
                                                            </AnimatePresence>
                                                        );
                                                    })()}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                            {/* Transactions Positioning (Read-only layer) */}
                            {days.map((day, dayIndex) => {
                                const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), day));

                                return (
                                    <div key={`col-${day.toISOString()}`} className="flex-1 relative border-r border-transparent last:border-r-0 pointer-events-none">
                                        {dayTransactions.map((t) => {
                                            const tDate = new Date(t.date);
                                            const hour = getHours(tDate);
                                            const minute = getMinutes(tDate);
                                            const topPosition = (hour * PIXELS_PER_HOUR) + ((minute / 60) * PIXELS_PER_HOUR);

                                            const bgColor = t.type === 'INGRESO' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                                t.type === 'EGRESO' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                                    t.type === 'AHORRO' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                                                        'bg-purple-500/20 text-purple-300 border-purple-500/30'; // INVERSIÓN

                                            return (
                                                <motion.div
                                                    key={t.id}
                                                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                                    whileHover={{ scale: 1.05, zIndex: 50 }}
                                                    style={{ top: `${topPosition}px` }}
                                                    className={cn(
                                                        "absolute left-1 right-1 p-2 rounded-lg border backdrop-blur-md pointer-events-auto",
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

                            {/* Current Time Indicator (Red Line) */}
                            {(() => {
                                // Find if today is in the visible days
                                const todayIndex = days.findIndex(day => isSameDay(day, currentTime));

                                if (todayIndex === -1) return null; // Today is not in the current week

                                const currentHour = getHours(currentTime);
                                const currentMinute = getMinutes(currentTime);
                                const topPosition = (currentHour * PIXELS_PER_HOUR) + ((currentMinute / 60) * PIXELS_PER_HOUR);

                                return (
                                    <div
                                        key="current-time-indicator"
                                        className="absolute pointer-events-none"
                                        style={{
                                            top: `${topPosition}px`,
                                            left: 0,
                                            right: 0,
                                            zIndex: 40
                                        }}
                                    >
                                        {/* Red Line crossing entire calendar */}
                                        <div className="relative flex items-center">
                                            {/* Dot at the current day position */}
                                            <div
                                                className="absolute w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50 z-10"
                                                style={{
                                                    left: `${((todayIndex + 0.5) / days.length) * 100}%`,
                                                    transform: 'translateX(-50%)'
                                                }}
                                            />
                                            {/* Line crossing entire width */}
                                            <div className="w-full h-[2px] bg-red-500/80 shadow-lg shadow-red-500/30" />
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
