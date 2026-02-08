
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MonthSelectorProps {
    currentDate: Date;
    onMonthChange: (date: Date) => void;
}

export function MonthSelector({ currentDate, onMonthChange }: MonthSelectorProps) {
    const handlePreviousMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        onMonthChange(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        onMonthChange(newDate);
    };

    return (
        <div className="flex items-center space-x-4 bg-white rounded-full px-4 py-2 border border-zinc-200 shadow-sm">
            <button
                onClick={handlePreviousMonth}
                className="p-1 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500 hover:text-black"
            >
                <ChevronLeft size={20} />
            </button>

            <span className="text-sm font-medium w-32 text-center capitalize text-zinc-900">
                {format(currentDate, "MMMM yyyy", { locale: es })}
            </span>

            <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500 hover:text-black"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
