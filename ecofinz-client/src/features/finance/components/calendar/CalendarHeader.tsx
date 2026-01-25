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
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <button
                        onClick={onPrevMonth}
                        className="p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-semibold text-white tracking-tight capitalize w-48 text-center md:text-left">
                        {format(currentDate, "MMMM yyyy", { locale: es })}
                    </h2>
                    <button
                        onClick={onNextMonth}
                        className="p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* View Switcher */}
            <div className="flex bg-neutral-900/50 p-1 rounded-xl border border-white/5">
                {(['month', 'week', 'day'] as const).map((v) => (
                    <button
                        key={v}
                        onClick={() => onViewChange(v)}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                            view === v
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-neutral-500 hover:text-neutral-300"
                        )}
                    >
                        {v === 'month' ? 'Mes' : v === 'week' ? 'Semana' : 'Día'}
                    </button>
                ))}
            </div>
        </div>
    );
};


