import React from "react";
import { CreditCard, CalendarDays } from "lucide-react";
import { Card, CATEGORIES } from "./types";

interface ProjectionFiltersProps {
    activeTab: "credit" | "debit";
    setActiveTab: (tab: "credit" | "debit") => void;
    filterType: "all" | "real" | "simulated";
    setFilterType: (type: "all" | "real" | "simulated") => void;
    filterCard: string;
    setFilterCard: (card: string) => void;
    filterCategory: string;
    setFilterCategory: (category: string) => void;
    cards: Card[];
}

export default function ProjectionFilters({
    activeTab,
    setActiveTab,
    filterType,
    setFilterType,
    filterCard,
    setFilterCard,
    filterCategory,
    setFilterCategory,
    cards
}: ProjectionFiltersProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-black tracking-tight flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-emerald-500" /> Mapa de Proyección Multitarjeta
                    </h3>
                    <p className="text-xs text-zinc-500">Distribución mensualizada de compras y cuotas activas</p>
                </div>

                {/* Credit / Debit Switch */}
                <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 self-start sm:self-center">
                    <button
                        onClick={() => {
                            setActiveTab("credit");
                            setFilterCard("all");
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeTab === "credit"
                                ? "bg-black text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-900"
                        }`}
                    >
                        <CreditCard className="w-3.5 h-3.5" /> Crédito
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("debit");
                            setFilterCard("all");
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeTab === "debit"
                                ? "bg-black text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-900"
                        }`}
                    >
                        <CreditCard className="w-3.5 h-3.5" /> Débito
                    </button>
                </div>
            </div>

            {/* Filters Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tipo de Gasto</label>
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value as "all" | "real" | "simulated")}
                        className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5"
                    >
                        <option value="all">🔍 Todos los consumos</option>
                        <option value="real">💳 Solo consumos reales</option>
                        <option value="simulated">✨ Solo simulaciones</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Filtrar por Tarjeta</label>
                    <select
                        value={filterCard}
                        onChange={e => setFilterCard(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5"
                    >
                        <option value="all">🎴 Todas las tarjetas</option>
                        {cards
                            .filter((c: Card) => c.type === activeTab)
                            .map((c: Card) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} (*{c.lastDigits})
                                </option>
                            ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Categoría</label>
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5"
                    >
                        <option value="all">🏷️ Todas las categorías</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>🏷️ {cat}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
