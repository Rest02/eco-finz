"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Subcomponents & Types
import { Card, Simulation } from "../../../features/finance/components/projection/types";
import ProjectionFilters from "../../../features/finance/components/projection/ProjectionFilters";
import ProjectionTable from "../../../features/finance/components/projection/ProjectionTable";
import SimulationForm from "../../../features/finance/components/projection/SimulationForm";
import SimulationList from "../../../features/finance/components/projection/SimulationList";

const INITIAL_CARDS: Card[] = [
    { id: "1", name: "Mastercard Black Eco", limit: 5000000, color: "from-emerald-500 to-teal-800", lastDigits: "8824", type: "credit" },
    { id: "2", name: "Visa Platinum Finz", limit: 3000000, color: "from-purple-500 to-indigo-800", lastDigits: "4512", type: "credit" },
    { id: "3", name: "Ripley Mastercard", limit: 1500000, color: "from-orange-500 to-amber-800", lastDigits: "3319", type: "credit" },
    { id: "d1", name: "Débito Santander", limit: 850000, color: "from-rose-500 to-red-700", lastDigits: "5678", type: "debit" },
    { id: "d2", name: "Débito Banco de Chile", limit: 1200000, color: "from-blue-600 to-indigo-900", lastDigits: "1092", type: "debit" },
    { id: "d3", name: "MACH Prepago", limit: 300000, color: "from-indigo-400 to-purple-600", lastDigits: "4321", type: "debit" }
];

const INITIAL_SIMULATIONS: Simulation[] = [
    { id: "s1", description: "MacBook Pro", amount: 1200000, installments: 12, startMonth: 0, cardId: "1", isSimulation: false, category: "Tecnología" },
    { id: "s2", description: "Pasajes de Avión", amount: 600000, installments: 6, startMonth: 1, cardId: "1", isSimulation: true, category: "Viajes" },
    { id: "s3", description: "Suscripción Anual Cloud", amount: 120000, installments: 3, startMonth: 2, cardId: "2", isSimulation: true, category: "Tecnología" },
    { id: "s4", description: "Ripley-Nike", amount: 80970, installments: 3, startMonth: 0, cardId: "3", isSimulation: false, category: "Ropa" },
    { id: "s5", description: "Arriendo Mensual", amount: 450000, installments: 1, startMonth: 0, cardId: "d2", isSimulation: false, category: "Otros" },
    { id: "s6", description: "Suscripción Netflix", amount: 10990, installments: 1, startMonth: 0, cardId: "d1", isSimulation: false, category: "Otros" },
    { id: "s7", description: "Spotify", amount: 4590, installments: 1, startMonth: 0, cardId: "d3", isSimulation: false, category: "Otros" }
];

const MONTHS_NAMES = [
    "Mayo 2026",
    "Junio 2026",
    "Julio 2026",
    "Agosto 2026",
    "Septiembre 2026",
    "Octubre 2026"
];

// Animation framer motion variants
const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ProjectionPage() {
    const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
    const [simulations, setSimulations] = useState<Simulation[]>(INITIAL_SIMULATIONS);
    const [selectedCardId, setSelectedCardId] = useState<string>("1");
    const [activeTab, setActiveTab] = useState<"credit" | "debit">("credit");

    // Filter states
    const [filterType, setFilterType] = useState<"all" | "real" | "simulated">("all");
    const [filterCard, setFilterCard] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");

    // Currency Formatter
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP"
        }).format(val);
    };

    // Calculate Matrix Data: Card X Month
    const matrixData = useMemo(() => {
        const filteredCards = cards
            .filter((c: Card) => c.type === activeTab)
            .filter((c: Card) => filterCard === "all" || c.id === filterCard);

        return filteredCards.map((card: Card) => {
            const monthlyProjections = MONTHS_NAMES.map((_: string, monthIdx: number) => {
                const activeSims = simulations.filter((sim: Simulation) => {
                    if (sim.cardId !== card.id) return false;
                    if (filterType === "real" && sim.isSimulation !== false) return false;
                    if (filterType === "simulated" && sim.isSimulation === false) return false;
                    if (filterCategory !== "all" && sim.category !== filterCategory) return false;

                    const start = sim.startMonth;
                    const end = start + sim.installments - 1;
                    return monthIdx >= start && monthIdx <= end;
                });

                const total = activeSims.reduce((sum: number, sim: Simulation) => {
                    return sum + (sim.amount / sim.installments);
                }, 0);

                return {
                    monthIdx,
                    activeSims,
                    total
                };
            });

            return {
                card,
                monthlyProjections
            };
        });
    }, [cards, simulations, filterType, filterCard, filterCategory, activeTab]);

    // Calculate Month Grand Totals (Sum of all cards for each month)
    const monthGrandTotals = useMemo(() => {
        return MONTHS_NAMES.map((_: string, monthIdx: number) => {
            return simulations.reduce((sum: number, sim: Simulation) => {
                const associatedCard = cards.find((c: Card) => c.id === sim.cardId);
                if (!associatedCard || associatedCard.type !== activeTab) return sum;

                if (filterCard !== "all" && sim.cardId !== filterCard) return sum;
                if (filterType === "real" && sim.isSimulation !== false) return sum;
                if (filterType === "simulated" && sim.isSimulation === false) return sum;
                if (filterCategory !== "all" && sim.category !== filterCategory) return sum;

                const start = sim.startMonth;
                const end = start + sim.installments - 1;
                if (monthIdx >= start && monthIdx <= end) {
                    return sum + (sim.amount / sim.installments);
                }
                return sum;
            }, 0);
        });
    }, [simulations, cards, filterType, filterCard, filterCategory, activeTab]);

    // Add Simulation
    const handleAddSimulation = (
        desc: string,
        amount: number,
        installments: number,
        startMonth: number,
        category: string
    ) => {
        const newSim: Simulation = {
            id: `sim-${Date.now()}`,
            description: desc,
            amount: amount,
            installments: installments,
            startMonth: startMonth,
            cardId: selectedCardId,
            isSimulation: true,
            category: category
        };

        setSimulations([...simulations, newSim]);
    };

    // Delete Simulation
    const handleDeleteSimulation = (id: string) => {
        setSimulations(simulations.filter(s => s.id !== id));
    };

    // Add Card
    const handleAddCard = (name: string, limit: number, digits: string) => {
        const colors = [
            "from-rose-500 to-red-800",
            "from-amber-500 to-orange-800",
            "from-blue-500 to-cyan-800",
            "from-pink-500 to-rose-800"
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newCard: Card = {
            id: `c-${Date.now()}`,
            name: name,
            limit: limit,
            color: randomColor,
            lastDigits: digits,
            type: activeTab
        };

        setCards([...cards, newCard]);
        setSelectedCardId(newCard.id);
    };

    return (
        <motion.div
            className="p-4 lg:p-10 space-y-8 min-h-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Dashboard */}
            <motion.div variants={itemVariants} className="flex justify-between items-start gap-4">
                <div>
                    <h2 className="text-3xl font-black text-black tracking-tight flex items-center gap-2">
                        Proyecciones <span className="text-emerald-500 flex items-center gap-1">EcoFinz <Sparkles className="w-5 h-5 fill-emerald-500" /></span>
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium">Controla, proyecta y simula tus consumos a 6 meses de forma interactiva.</p>
                </div>
            </motion.div>

            {/* Matrix Table Section */}
            <motion.div variants={itemVariants} className="bg-white border border-zinc-200 p-6 md:p-8 rounded-[2rem] shadow-sm space-y-6 overflow-hidden">
                <ProjectionFilters
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    filterCard={filterCard}
                    setFilterCard={setFilterCard}
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                    cards={cards}
                />

                <ProjectionTable
                    matrixData={matrixData}
                    monthGrandTotals={monthGrandTotals}
                    formatCurrency={formatCurrency}
                />
            </motion.div>

            {/* Simulation Controls Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={itemVariants}>
                    <SimulationForm
                        cards={cards}
                        selectedCardId={selectedCardId}
                        setSelectedCardId={setSelectedCardId}
                        onAddSimulation={handleAddSimulation}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <SimulationList
                        simulations={simulations}
                        cards={cards}
                        onDelete={handleDeleteSimulation}
                        onAddCard={handleAddCard}
                        formatCurrency={formatCurrency}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}
