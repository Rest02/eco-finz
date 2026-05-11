export interface Simulation {
    id: string;
    description: string;
    amount: number;
    installments: number;
    startMonth: number; // 0 = Mayo, 1 = Junio, etc.
    cardId: string;
    isSimulation?: boolean;
    category?: string;
}

export interface Card {
    id: string;
    name: string;
    limit: number;
    color: string;
    lastDigits: string;
    type: "credit" | "debit";
}

export const CATEGORIES = ["Tecnología", "Viajes", "Ropa", "Supermercado", "Otros"];

const currentDate = new Date();

export const MONTHS_NAMES = Array.from({ length: 6 }, (_, i) => {
    const tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthName = tempDate.toLocaleString("es-ES", { month: "long" });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const year = tempDate.getFullYear();
    return `${capitalizedMonth} ${year}`;
});

