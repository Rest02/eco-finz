"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { FinancialCalendar } from "@/features/finance/components/calendar/FinancialCalendar";

export default function CalendarPage() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    return (
        <motion.div
            className="container mx-auto px-4 py-8 h-[calc(100vh-80px)]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col h-full gap-6">
                <motion.div variants={itemVariants}>
                    <h1 className="text-3xl font-bold text-white mb-2">Calendario Financiero</h1>
                    <p className="text-neutral-400">Visualiza tus ingresos, egresos y ahorros día a día.</p>
                </motion.div>

                <motion.div className="flex-1 min-h-0" variants={itemVariants}>
                    <FinancialCalendar />
                </motion.div>
            </div>
        </motion.div>
    );
}
