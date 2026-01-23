"use client";

import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { TransactionType } from "../types/finance";
import { Search, RotateCcw, Filter, Calendar, Tag, Layers } from "lucide-react";

interface FilterValues {
    type?: TransactionType | "";
    categoryId?: string;
    startDate?: string;
    endDate?: string;
}

interface Props {
    onFilterChange: (filters: FilterValues) => void;
}

const TransactionFilters: React.FC<Props> = ({ onFilterChange }) => {
    const { data: categories = [] } = useCategories();
    const [filters, setFilters] = useState<FilterValues>({
        type: "",
        categoryId: "",
        startDate: "",
        endDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        onFilterChange({ ...filters });
    };

    const handleReset = () => {
        const resetFilters: FilterValues = {
            type: "",
            categoryId: "",
            startDate: "",
            endDate: "",
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="glass-card bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-neutral-400">
                <Filter className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Filtros Avanzados</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-tighter ml-1">
                        <Layers className="w-3 h-3" /> Tipo de Movimiento
                    </label>
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-neutral-900">Todos los tipos</option>
                        <option value="INGRESO" className="bg-neutral-900">Ingresos</option>
                        <option value="EGRESO" className="bg-neutral-900">Egresos</option>
                    </select>
                </div>

                {/* Category Filter */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-tighter ml-1">
                        <Tag className="w-3 h-3" /> Categoría
                    </label>
                    <select
                        name="categoryId"
                        value={filters.categoryId}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-neutral-900">Cualquier categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-neutral-900">{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-tighter ml-1">
                        <Calendar className="w-3 h-3" /> Desde
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 [color-scheme:dark]"
                    />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-tighter ml-1">
                        <Calendar className="w-3 h-3" /> Hasta
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 [color-scheme:dark]"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all outline-none"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Limpiar
                </button>
                <button
                    onClick={handleApplyFilters}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/20 shadow-transparent"
                >
                    <Search className="w-3.5 h-3.5" />
                    Aplicar
                </button>
            </div>
        </div>
    );
};

export default TransactionFilters;
