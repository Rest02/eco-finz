"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";

// Subcomponents & Types
import { Card, Simulation, MONTHS_NAMES } from "../../../features/finance/components/projection/types";
import ProjectionFilters from "../../../features/finance/components/projection/ProjectionFilters";
import ProjectionTable from "../../../features/finance/components/projection/ProjectionTable";
import SimulationForm from "../../../features/finance/components/projection/SimulationForm";
import SimulationList from "../../../features/finance/components/projection/SimulationList";

// Hooks & Utilities
import { useAccounts, useCreateAccount } from "../../../features/finance/hooks/useAccounts";
import { useProjections, useCreateProjection, useDeleteProjection, useSyncProjections } from "../../../features/finance/hooks/useProjections";
import { useTransactions } from "../../../features/finance/hooks/useTransactions";
import { accountToCard, getRelativeMonthIndex } from "../../../features/finance/utils/projectionUtils";


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
    // Real Data Hooks
    const { data: accountsData, isLoading: isLoadingAccounts, isError: isErrorAccounts } = useAccounts();
    const { data: projectionsData, isLoading: isLoadingProjections, isError: isErrorProjections } = useProjections();
    const { data: transactionsResponse, isLoading: isLoadingTransactions, isError: isErrorTransactions } = useTransactions();
    
    const createProjectionMutation = useCreateProjection();
    const deleteProjectionMutation = useDeleteProjection();
    const createAccountMutation = useCreateAccount();
    const syncProjectionsMutation = useSyncProjections();

    const [selectedCardId, setSelectedCardId] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"credit" | "debit">("credit");

    // Filter states
    const [filterType, setFilterType] = useState<"all" | "real" | "simulated">("all");
    const [filterCard, setFilterCard] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");

    // Convert real accounts to Card components
    const cards = useMemo(() => {
        if (!accountsData) return [];
        return accountsData.map(accountToCard);
    }, [accountsData]);

    // Active cards for current tab
    const activeCards = useMemo(() => {
        return cards.filter((c: Card) => c.type === activeTab);
    }, [cards, activeTab]);

    // Set first card as default selected when switching tabs
    useEffect(() => {
        if (activeCards.length > 0) {
            const isValid = activeCards.some(c => c.id === selectedCardId);
            if (!isValid) {
                setSelectedCardId(activeCards[0].id);
            }
        } else {
            setSelectedCardId("");
        }
    }, [activeCards, selectedCardId]);

    // Map database projections and real transactions to frontend Simulations
    const simulations = useMemo(() => {
        const list: Simulation[] = [];

        // 1. Map simulations/projections from DB
        if (projectionsData) {
            projectionsData.forEach((p) => {
                const relIndex = getRelativeMonthIndex(p.startMonth, p.startYear, MONTHS_NAMES);
                list.push({
                    id: p.id,
                    description: p.description,
                    amount: Number(p.amount),
                    installments: p.installments,
                    startMonth: relIndex,
                    cardId: p.accountId,
                    isSimulation: p.isSimulation,
                    category: p.category?.name || "Otros"
                });
            });
        }

        // 2. Map actual transactions as 1-payment real projections
        if (transactionsResponse?.data) {
            transactionsResponse.data.forEach((tx) => {
                const txDate = new Date(tx.date);
                
                // Using UTC methods is essential since dates from the DB are stored as ISO UTC,
                // preventing timezone shifts where a day boundary could be miscalculated.
                let txMonth = txDate.getUTCMonth() + 1; // 1-12
                let txYear = txDate.getUTCFullYear();
                const txDay = txDate.getUTCDate();

                // Only treat EGRESO (expenses) as active projections, ignoring those with installments
                if (tx.type === "EGRESO" && !tx.description.includes(" | cuotas:")) {
                    // Find corresponding account to check its closing day
                    const account = accountsData?.find(a => a.id === tx.accountId);
                    // For non-credit cards it defaults to current month logic or simple day-less cycle, 
                    // but let's apply it specifically to credit cards or simply use fallback.
                    if (account?.type === "TARJETA_CREDITO") {
                        const closingDay = Number(account.closingDay || 15);
                        if (txDay > closingDay) {
                            txMonth += 1;
                            if (txMonth > 12) {
                                txMonth = 1;
                                txYear += 1;
                            }
                        }
                    }

                    const relIndex = getRelativeMonthIndex(txMonth, txYear, MONTHS_NAMES);

                    list.push({
                        id: tx.id,
                        description: tx.description,
                        amount: Number(tx.amount),
                        installments: 1, // standard transaction is a single payment
                        startMonth: relIndex,
                        cardId: tx.accountId,
                        isSimulation: false, // real movement
                        category: tx.category?.name || "Otros"
                    });
                }
            });
        }

        return list;
    }, [projectionsData, transactionsResponse, accountsData, MONTHS_NAMES]);

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
                    if (sim.startMonth === -1) return false; // out of scope
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
                if (sim.startMonth === -1) return sum; // out of scope

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

    // Add Simulation (DB Persistence)
    const handleAddSimulation = (
        desc: string,
        amount: number,
        installments: number,
        startMonthIdx: number,
        category: string
    ) => {
        if (!selectedCardId) return;

        const currentDate = new Date();
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + startMonthIdx, 1);
        const startMonth = targetDate.getMonth() + 1; // 1-12
        const startYear = targetDate.getFullYear();

        createProjectionMutation.mutate({
            description: desc,
            amount: amount,
            installments: installments,
            startMonth: startMonth,
            startYear: startYear,
            accountId: selectedCardId,
            isSimulation: true
        });
    };

    // Delete Simulation (DB Persistence)
    const handleDeleteSimulation = (id: string) => {
        deleteProjectionMutation.mutate(id);
    };

    // Add Real Card/Account (DB Persistence)
    const handleAddCard = (name: string, limit: number, digits: string) => {
        const colors = [
            "from-rose-500 to-red-800",
            "from-amber-500 to-orange-800",
            "from-blue-500 to-cyan-800",
            "from-pink-500 to-rose-800"
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        createAccountMutation.mutate({
            name: name,
            type: activeTab === "credit" ? "TARJETA_CREDITO" : "BANCO",
            creditLimit: activeTab === "credit" ? limit : undefined,
            balance: activeTab === "credit" ? 0 : limit,
            lastDigits: digits,
            color: randomColor
        });
    };

    // Loading skeleton loader
    if (isLoadingAccounts || isLoadingProjections || isLoadingTransactions) {
        return (
            <div className="p-4 lg:p-10 min-h-[60vh] flex flex-col justify-center items-center gap-4">
                <div className="relative flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-solid"></div>
                    <Sparkles className="w-6 h-6 text-emerald-500 absolute animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-black text-black">Cargando Proyecciones</h3>
                    <p className="text-xs text-zinc-500 mt-1">Conectando con EcoFinz Backend...</p>
                </div>
            </div>
        );
    }

    // Error states
    if (isErrorAccounts || isErrorProjections || isErrorTransactions) {
        return (
            <div className="p-4 lg:p-10 min-h-[60vh] flex flex-col justify-center items-center gap-4">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 max-w-md">
                    <AlertCircle className="w-8 h-8 shrink-0 text-rose-600" />
                    <div>
                        <h4 className="font-extrabold text-sm">Error de Conexión</h4>
                        <p className="text-xs text-rose-700 mt-0.5">No pudimos conectar con los servicios de proyección. Por favor, reintenta más tarde.</p>
                    </div>
                </div>
            </div>
        );
    }

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
                    <p className="text-xs text-zinc-500 font-medium">Controla, proyecta y simula tus consumos a 6 meses en tiempo real.</p>
                </div>
                <button
                    onClick={() => syncProjectionsMutation.mutate()}
                    disabled={syncProjectionsMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all duration-300 hover:border-emerald-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncProjectionsMutation.isPending ? 'animate-spin text-emerald-600' : 'text-zinc-500'}`} />
                    {syncProjectionsMutation.isPending ? "Sincronizando..." : "Sincronizar"}
                </button>
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
                        cards={activeCards}
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
