import React, { useState } from "react";
import { Plus, Sliders } from "lucide-react";
import { Card, CATEGORIES, MONTHS_NAMES } from "./types";

interface SimulationFormProps {
    cards: Card[];
    selectedCardId: string;
    setSelectedCardId: (id: string) => void;
    onAddSimulation: (desc: string, amount: number, installments: number, startMonth: number, category: string) => void;
}

export default function SimulationForm({
    cards,
    selectedCardId,
    setSelectedCardId,
    onAddSimulation
}: SimulationFormProps) {
    const [desc, setDesc] = useState("");
    const [amount, setAmount] = useState("");
    const [installments, setInstallments] = useState("6");
    const [startMonth, setStartMonth] = useState("0");
    const [category, setCategory] = useState("Tecnología");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!desc || !amount) return;

        onAddSimulation(
            desc,
            parseFloat(amount),
            parseInt(installments),
            parseInt(startMonth),
            category
        );

        setDesc("");
        setAmount("");
        setCategory("Tecnología");
    };

    return (
        <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-zinc-500 font-bold">
                <Sliders className="w-5 h-5 text-black" />
                <span className="text-xs tracking-widest uppercase">Simular Nueva Compra</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Asignar a Cuenta / Tarjeta</label>
                    <select
                        value={selectedCardId}
                        onChange={e => setSelectedCardId(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    >
                        {cards.map((c: Card) => (
                            <option key={c.id} value={c.id}>
                                {c.name} (*{c.lastDigits}) [{c.type === "credit" ? "Crédito" : "Débito"}]
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Descripción del Gasto</label>
                    <input
                        type="text"
                        placeholder="Ej. Ripley-Nike, Pasajes, Supermercado..."
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Monto Total ($)</label>
                        <input
                            type="number"
                            placeholder="Monto Total"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Cuotas</label>
                        <select
                            value={installments}
                            onChange={e => setInstallments(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                        >
                            <option value="1">1 Pago / Sin cuotas</option>
                            <option value="3">3 Cuotas</option>
                            <option value="6">6 Cuotas</option>
                            <option value="12">12 Cuotas</option>
                            <option value="18">18 Cuotas</option>
                            <option value="24">24 Cuotas</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Mes de Inicio</label>
                        <select
                            value={startMonth}
                            onChange={e => setStartMonth(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                        >
                            {MONTHS_NAMES.map((m, idx) => (
                                <option key={idx} value={idx}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Categoría</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3.5 bg-black hover:bg-zinc-900 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group"
                >
                    <Plus className="w-4 h-4 transition-transform group-hover:scale-125" />
                    Agregar Gasto Proyectado
                </button>
            </form>
        </div>
    );
}
