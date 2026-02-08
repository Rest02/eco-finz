import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
    currentDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    view: 'month' | 'week' | 'day';
    onViewChange: (view: 'month' | 'week' | 'day') => void;
}

export const CalendarHeader: React.FC<Props> = ({
    currentDate,
    onPrevMonth,
    onNextMonth,
    view,
    onViewChange
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">

            {/* Month Navigation */}
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <button
                        onClick={onPrevMonth}
                        className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-black transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-semibold text-black tracking-tight capitalize w-48 text-center md:text-left">
                        {format(currentDate, "MMMM yyyy", { locale: es })}
                    </h2>
                    <button
                        onClick={onNextMonth}
                        className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-black transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* View Switcher */}
            <div className="flex bg-white/40 p-1 rounded-xl border border-white/40 shadow-sm">
                {(['month', 'week', 'day'] as const).map((v) => (
                    <button
                        key={v}
                        onClick={() => onViewChange(v)}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-sm font-bold transition-all capitalize tracking-wide",
                            view === v
                                ? "bg-black text-white shadow-md"
                                : "text-zinc-500 hover:text-zinc-800 hover:bg-white/50"
                        )}
                    >
                        {v === 'month' ? 'Mes' : v === 'week' ? 'Semana' : 'Día'}
                    </button>
                ))}
            </div>
        </div>
    );
};


