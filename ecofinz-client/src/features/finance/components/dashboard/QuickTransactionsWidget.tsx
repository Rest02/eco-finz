
import { Transaction } from "@/features/finance/types/finance";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface QuickTransactionsWidgetProps {
    transactions: Transaction[];
}

export function QuickTransactionsWidget({ transactions }: QuickTransactionsWidgetProps) {
    if (transactions.length === 0) {
        return (
            <div className="clean-card h-full p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-zinc-900 font-bold mb-2">Últimos Movimientos</h3>
                <p className="text-zinc-400 text-sm">No hay transacciones recientes.</p>
            </div>
        );
    }

    return (
        <div className="clean-card h-full p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-zinc-900 font-bold">Últimos Movimientos</h3>
                <button className="text-xs font-medium text-zinc-500 hover:text-black transition-colors">
                    Ver todo
                </button>
            </div>

            <div className="space-y-4">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "INGRESO" ? "bg-emerald-50 text-emerald-600" : "bg-zinc-50 text-zinc-600"
                                }`}>
                                {tx.type === "INGRESO" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-900 group-hover:text-black transition-colors truncate max-w-[150px]">
                                    {tx.description}
                                </p>
                                <p className="text-xs text-zinc-500 capitalize">
                                    {format(new Date(tx.date), "dd MMM", { locale: es })} • {tx.category?.name || "General"}
                                </p>
                            </div>
                        </div>
                        <span className={`text-sm font-bold ${tx.type === "INGRESO" ? "text-emerald-600" : "text-zinc-900"
                            }`}>
                            {tx.type === "INGRESO" ? "+" : "-"}${tx.amount.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
