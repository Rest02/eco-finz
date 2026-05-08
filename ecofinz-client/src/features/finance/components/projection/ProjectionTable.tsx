import React from "react";
import { Sparkles } from "lucide-react";
import { Card, Simulation, MONTHS_NAMES } from "./types";

interface ProjectionTableProps {
    matrixData: Array<{
        card: Card;
        monthlyProjections: Array<{
            monthIdx: number;
            activeSims: Simulation[];
            total: number;
        }>;
    }>;
    monthGrandTotals: number[];
    formatCurrency: (val: number) => string;
}

export default function ProjectionTable({
    matrixData,
    monthGrandTotals,
    formatCurrency
}: ProjectionTableProps) {
    return (
        <div className="overflow-x-auto custom-scrollbar border border-zinc-150 rounded-2xl">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-zinc-50/80 border-b border-zinc-200">
                        <th className="p-4 text-xs font-black uppercase tracking-wider text-zinc-500 min-w-[200px]">Tarjeta / Cuenta</th>
                        {MONTHS_NAMES.map((month: string) => (
                            <th key={month} className="p-4 text-xs font-black uppercase tracking-wider text-zinc-500 text-center min-w-[180px] border-l border-zinc-150">
                                {month}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150">
                    {matrixData.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="p-8 text-center text-xs text-zinc-400 italic">
                                No hay tarjetas registradas de este tipo.
                            </td>
                        </tr>
                    ) : (
                        matrixData.map(({ card, monthlyProjections }) => (
                            <tr key={card.id} className="hover:bg-zinc-50/40 transition-colors">
                                <td className="p-4 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-sm text-zinc-900">{card.name}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded font-bold text-zinc-500">
                                            *{card.lastDigits}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 font-medium">
                                        {card.type === "credit" ? "Cupo total:" : "Saldo proyectado:"} {formatCurrency(card.limit)}
                                    </p>
                                </td>

                                {monthlyProjections.map(({ monthIdx, activeSims, total }) => (
                                    <td key={monthIdx} className="p-4 border-l border-zinc-150 align-top text-center space-y-2">
                                        {activeSims.length === 0 ? (
                                            <span className="text-xs text-zinc-300 italic block py-4">-</span>
                                        ) : (
                                            <div className="space-y-1.5 text-left">
                                                {activeSims.map((sim: Simulation) => {
                                                    const quotaAmount = sim.amount / sim.installments;
                                                    const isSim = sim.isSimulation !== false;
                                                    return (
                                                        <div
                                                            key={sim.id}
                                                            className={`p-2 rounded-xl text-[11px] font-bold flex justify-between items-center gap-1 shadow-sm hover:scale-[1.01] transition-transform border ${
                                                                isSim
                                                                    ? "bg-violet-50/70 border-violet-200 text-violet-950 border-dashed"
                                                                    : "bg-zinc-50 border-zinc-200 text-zinc-700"
                                                            }`}
                                                        >
                                                            <span className="truncate max-w-[100px] flex items-center gap-1">
                                                                {isSim && <Sparkles className="w-2.5 h-2.5 text-violet-500 shrink-0" />}
                                                                {sim.description}
                                                            </span>
                                                            <span className={`shrink-0 ${isSim ? "text-violet-600" : "text-emerald-600"}`}>
                                                                {formatCurrency(quotaAmount)}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {total > 0 && (
                                            <div className="pt-2 border-t border-dashed border-zinc-200 flex justify-between items-center text-[11px]">
                                                <span className="font-black uppercase text-zinc-400 text-[9px] tracking-wider">Subtotal:</span>
                                                <span className="font-extrabold text-zinc-900">{formatCurrency(total)}</span>
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
                <tfoot>
                    <tr className="bg-black text-white font-bold border-t-2 border-zinc-300">
                        <td className="p-5 text-xs font-black uppercase tracking-wider">Total General Proyectado</td>
                        {monthGrandTotals.map((grandTotal: number, idx: number) => (
                            <td key={idx} className="p-5 text-center text-sm font-black border-l border-white/10 tracking-tight">
                                {formatCurrency(grandTotal)}
                            </td>
                        ))}
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
