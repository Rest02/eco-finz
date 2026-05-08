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

export const MONTHS_NAMES = [
    "Mayo 2026",
    "Junio 2026",
    "Julio 2026",
    "Agosto 2026",
    "Septiembre 2026",
    "Octubre 2026"
];
