
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface ExpenseDistributionWidgetProps {
    data: {
        name: string;
        value: number;
        color?: string;
    }[];
}

const COLORS = ["#000000", "#52525b", "#a1a1aa", "#d4d4d8", "#f4f4f5"];

export function ExpenseDistributionWidget({ data }: ExpenseDistributionWidgetProps) {
    const hasData = data.length > 0 && data.some((item) => item.value > 0);

    if (!hasData) {
        return (
            <div className="clean-card h-full flex items-center justify-center p-6 text-zinc-400">
                <p>No hay gastos registrados</p>
            </div>
        );
    }

    return (
        <div className="clean-card h-full p-6 flex flex-col">
            <h3 className="text-zinc-900 font-bold mb-4">Distribución de Gastos</h3>
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, "Gasto"]}
                            contentStyle={{ borderRadius: "12px", border: "1px solid #e4e4e7", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
                {data.slice(0, 4).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-zinc-600 truncate max-w-[120px]">{entry.name}</span>
                        </div>
                        <span className="font-medium text-zinc-900">${entry.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
