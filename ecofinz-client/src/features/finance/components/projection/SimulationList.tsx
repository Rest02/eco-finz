import React, { useState } from "react";
import { Trash2, Plus, CreditCard, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Simulation, MONTHS_NAMES } from "./types";

interface SimulationListProps {
    simulations: Simulation[];
    cards: Card[];
    onDelete: (id: string) => void;
    onAddCard: (name: string, limit: number, digits: string) => void;
    formatCurrency: (val: number) => string;
}

export default function SimulationList({
    simulations,
    cards,
    onDelete,
    onAddCard,
    formatCurrency
}: SimulationListProps) {
    const [showAddCard, setShowAddCard] = useState(false);
    const [cardName, setCardName] = useState("");
    const [cardLimit, setCardLimit] = useState("");
    const [cardDigits, setCardDigits] = useState("");

    const handleCardSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!cardName || !cardLimit) return;

        onAddCard(cardName, parseFloat(cardLimit), cardDigits || "9999");
        setCardName("");
        setCardLimit("");
        setCardDigits("");
        setShowAddCard(false);
    };

    return (
        <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-zinc-500 font-bold">
                    <AlertCircle className="w-5 h-5 text-black" />
                    <span className="text-xs tracking-widest uppercase">Administración de Simulaciones</span>
                </div>

                <div className="space-y-3 custom-scrollbar max-h-[400px] overflow-y-auto pr-2">
                    {simulations.length === 0 ? (
                        <div className="text-center py-6 text-xs text-zinc-400 italic">No hay consumos o simulaciones activas.</div>
                    ) : (
                        simulations.map((sim: Simulation) => {
                            const matchedCard = cards.find((c: Card) => c.id === sim.cardId);
                            const isSim = sim.isSimulation !== false;
                            const startLabel = MONTHS_NAMES[sim.startMonth] || "Mes Inicio";

                            return (
                                <div
                                    key={sim.id}
                                    className={`p-4 rounded-2xl flex items-center justify-between gap-3 border transition-colors ${
                                        isSim
                                            ? "bg-violet-50/50 hover:bg-violet-50 border-violet-100"
                                            : "bg-zinc-50/50 hover:bg-zinc-50 border-zinc-100"
                                    }`}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-extrabold text-sm text-zinc-800">{sim.description}</span>
                                            {isSim && (
                                                <span className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                                    <Sparkles className="w-2.5 h-2.5" /> Simulación
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5 flex-wrap">
                                            <span>💵 {formatCurrency(sim.amount)}</span>
                                            <span>•</span>
                                            <span>📅 {sim.installments} {sim.installments === 1 ? "pago" : "cuotas"}</span>
                                            <span>•</span>
                                            <span>🚀 Inicia: {startLabel}</span>
                                            {sim.category && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 border border-amber-200/50 rounded-md font-bold">
                                                        🏷️ {sim.category}
                                                    </span>
                                                </>
                                            )}
                                            {matchedCard && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-bold">
                                                        🎴 {matchedCard.name}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {isSim && (
                                        <button
                                            onClick={() => onDelete(sim.id)}
                                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Eliminar simulación"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Fast actions / card creator trigger */}
            <div className="border-t border-zinc-100 pt-6 mt-6">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">¿Deseas simular otra Tarjeta?</span>
                    <button
                        onClick={() => setShowAddCard(!showAddCard)}
                        className="px-4 py-2 bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all"
                    >
                        {showAddCard ? "Ocultar" : "Crear Nueva Tarjeta"}
                    </button>
                </div>

                {/* Collapsible Card Creator Form */}
                <AnimatePresence>
                    {showAddCard && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleCardSubmit}
                            className="space-y-3 mt-4 overflow-hidden"
                        >
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Nombre de la Cuenta / Tarjeta</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Visa Santander, Cuenta RUT, MACH"
                                    value={cardName}
                                    onChange={e => setCardName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black/5"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Límite o Saldo ($)</label>
                                    <input
                                        type="number"
                                        placeholder="Ej. 1000000"
                                        value={cardLimit}
                                        onChange={e => setCardLimit(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black/5"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Últimos 4 Dígitos</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. 1234"
                                        maxLength={4}
                                        value={cardDigits}
                                        onChange={e => setCardDigits(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black/5"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-black hover:bg-zinc-900 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5" /> Registrar en Proyección
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
