import React from "react";
import { ChevronDown } from "lucide-react";
import { MonthlySummary } from "../../types/finance";

interface BarProps {
    label: string;
    value: number; // percentage 0-100
    isActive?: boolean;
    delay: number;
    tooltipValue?: string;
}

const Bar = ({ label, value, isActive, delay, tooltipValue }: BarProps) => (
    <div className="group flex flex-col items-center gap-2 flex-1 h-full justify-end relative">
        {isActive && (
            <>
                {/* Tooltip */}
                <div className="absolute -top-14 bg-white text-black px-3 py-1.5 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] text-xs font-bold whitespace-nowrap opacity-100 flex items-center gap-2 z-20 animate-fade-in">
                    <span>Gasto</span>
                    <span>{tooltipValue}</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                </div>
                {/* Selection Line */}
                <div className="absolute top-0 bottom-8 w-[1px] bg-white/20 border-r border-dashed border-white/30 h-[90%] pointer-events-none" />
                <div className="absolute top-[20%] w-2 h-2 rounded-full border-2 border-white bg-dark-bg z-20" />
            </>
        )}

        <div
            className={`w-full max-w-[40px] rounded-t-sm transition-all animate-grow-up ${isActive
                ? "bar-gradient shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                : "bg-white/5 group-hover:bg-white/10"
                }`}
            style={{ height: `${Math.max(value, 5)}%`, animationDelay: `${delay}ms` }}
        />
        <span className={`text-[10px] uppercase font-medium truncate w-full text-center ${isActive ? "text-white font-bold" : "text-neutral-500"}`}>
            {label}
        </span>
    </div>
);

interface BalanceChartProps {
    summary?: MonthlySummary;
}

export const BalanceChart = ({ summary }: BalanceChartProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    // Mapear categorías del resumen a los datos del gráfico
    const categories = summary?.categorySummaries || [];
    const maxSpent = Math.max(...categories.map(c => c.spent), 1000);

    const data = categories.map((cat, index) => ({
        label: cat.categoryName.substring(0, 3),
        value: (cat.spent / maxSpent) * 100,
        isActive: index === 0, // Por ahora marcamos la primera como activa
        tooltipValue: formatCurrency(cat.spent)
    }));

    // Si no hay datos, mostrar placeholders
    const displayData = data.length > 0 ? data : [
        { label: "Sin", value: 10, delay: 0 },
        { label: "Datos", value: 10, delay: 50 }
    ];

    return (
        <div className="mb-10">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-sm text-neutral-400 mb-1">Balance del Mes</p>
                    <h2 className="text-4xl font-semibold text-white tracking-tight">
                        {formatCurrency(summary?.balance || 0)}
                        <span className="text-neutral-500 text-lg font-normal ml-2">USD</span>
                    </h2>
                </div>
                <div className="flex items-center gap-2 cursor-pointer group">
                    <span className="text-xs font-medium uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300 transition-colors">
                        Este Mes
                    </span>
                    <ChevronDown className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                </div>
            </div>

            {/* Custom Bar Chart Container */}
            <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 relative px-2">
                {/* Y-Axis Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 opacity-20">
                    <div className="w-full border-t border-dashed border-white/20" />
                    <div className="w-full border-t border-dashed border-white/20" />
                    <div className="w-full border-t border-dashed border-white/20" />
                    <div className="w-full border-t border-dashed border-white/20" />
                    <div className="w-full border-t border-white/20" />
                </div>

                {/* Y-Axis Labels */}
                <div className="absolute -left-12 inset-y-0 flex flex-col justify-between text-[10px] text-neutral-500 py-1 text-right pr-2">
                    <span>{formatCurrency(maxSpent)}</span>
                    <span>{formatCurrency(maxSpent / 2)}</span>
                    <span>0</span>
                </div>

                {/* Bars */}
                <div className="relative w-full h-full flex items-end justify-between z-10 pl-2">
                    {displayData.map((item, index) => (
                        <Bar key={index} {...item as any} delay={index * 50} />
                    ))}
                </div>
            </div>
        </div>
    );
};
