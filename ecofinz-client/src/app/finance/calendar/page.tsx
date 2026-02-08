"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { FinancialCalendar } from "@/features/finance/components/calendar/FinancialCalendar";

export default function CalendarPage() {
    const { containerVariants, itemVariants } = require("@/lib/animations");


    return (
        <motion.div
            className="p-4 lg:p-10 space-y-6 lg:space-y-8 h-[calc(100vh-80px)]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col h-full gap-8">
                <motion.div variants={itemVariants} className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-black mb-1">
                        <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200">
                            <CalendarDays className="w-5 h-5 stroke-1" />
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase text-zinc-500">Planificación</span>
                    </div>

                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-2">
                            Calendario Financiero
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
                            Visualiza tus ingresos, egresos y ahorros día a día para mantener un control total de tu flujo de efectivo.
                        </p>
                    </div>
                </motion.div>

                <motion.div className="flex-1 min-h-0 w-full" variants={itemVariants}>
                    <FinancialCalendar />
                </motion.div>
            </div>
        </motion.div>
    );
}
