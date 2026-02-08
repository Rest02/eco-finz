
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface CashFlowWidgetProps {
    income: number;
    expense: number;
}

export function CashFlowWidget({ income, expense }: CashFlowWidgetProps) {
    const data = [
        { name: "Ingresos", value: income, color: "#10b981" }, // Emerald 500
        { name: "Gastos", value: expense, color: "#ef4444" },  // Red 500
    ];

    const savings = income - expense;

    return (
        <div className="clean-card h-full p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-zinc-900 font-bold">Flujo de Caja</h3>
                    <p className="text-sm text-zinc-500">Comparativa mensual</p>
                </div>
                <div className={`text-right ${savings >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Ahorro Neto</p>
                    <p className="text-xl font-bold">{savings >= 0 ? "+" : "-"}${Math.abs(savings).toLocaleString()}</p>
                </div>
            </div>

            <div className="w-full h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" barSize={20}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#71717a" }}
                            width={60}
                        />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
