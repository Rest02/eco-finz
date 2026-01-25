import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
    date: Date;
    hour: number;
    onClose: () => void;
    onSave: (data: any) => void;
    style?: React.CSSProperties;
}

export const TransactionFloatingWidget: React.FC<Props> = ({ date, hour, onClose, onSave, style }) => {
    const [type, setType] = useState<'INGRESO' | 'EGRESO' | 'AHORRO' | 'INVERSIÓN'>('EGRESO');
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [selectedHour, setSelectedHour] = useState(hour.toString().padStart(2, '0'));
    const [selectedMinute, setSelectedMinute] = useState('00');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalHour = parseInt(selectedHour);
        const finalMinute = parseInt(selectedMinute);
        onSave({
            amount: Number(amount),
            type,
            description,
            date: new Date(date).setHours(finalHour, finalMinute, 0, 0),
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
            style={style}
            className="absolute z-[100] w-[320px] bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Nueva Transacción
                    </span>
                    <span className="text-sm font-semibold text-white">
                        {format(date, "EEEE d", { locale: es })}, {hour}:00
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 mx-4 mt-4 bg-black/20 rounded-lg">
                {(['INGRESO', 'EGRESO', 'AHORRO', 'INVERSIÓN'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setType(t)}
                        className={cn(
                            "py-1.5 text-xs font-medium rounded-md transition-all",
                            type === t
                                ? t === 'INGRESO' ? "bg-emerald-500/20 text-emerald-400 shadow-sm" :
                                    t === 'EGRESO' ? "bg-rose-500/20 text-rose-400 shadow-sm" :
                                        t === 'AHORRO' ? "bg-cyan-500/20 text-cyan-400 shadow-sm" :
                                            "bg-purple-500/20 text-purple-400 shadow-sm"
                                : "text-neutral-500 hover:text-white"
                        )}
                    >
                        {t === 'INGRESO' ? 'Ingreso' : t === 'EGRESO' ? 'Gasto' : t === 'AHORRO' ? 'Ahorro' : 'Inversión'}
                    </button>
                ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                {/* Amount */}
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">$</span>
                    <input
                        type="number"
                        autoFocus
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-neutral-800/50 border border-white/5 rounded-xl py-3 pl-7 pr-4 text-2xl font-bold text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                    />
                </div>

                {/* Description */}
                <input
                    type="text"
                    placeholder="Descripción (ej: Almuerzo)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-800/50 border border-white/5 rounded-xl py-2 px-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                />

                {/* Time Selector */}
                <div className="flex gap-2 items-center">
                    <label className="text-xs text-neutral-400 font-medium">Hora:</label>
                    <select
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        className="flex-1 bg-neutral-800/50 border border-white/5 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                    >
                        {Array.from({ length: 24 }, (_, i) => i).map(h => (
                            <option key={h} value={h.toString().padStart(2, '0')}>
                                {h.toString().padStart(2, '0')}
                            </option>
                        ))}
                    </select>
                    <span className="text-neutral-500">:</span>
                    <select
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                        className="flex-1 bg-neutral-800/50 border border-white/5 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                    >
                        {['00', '15', '30', '45'].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="mt-2 w-full bg-white text-black font-semibold py-2.5 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                    <Check className="w-4 h-4" />
                    Guardar
                </button>
            </form>
        </motion.div>
    );
};
