"use client";

import React from "react";
import { RecentActivityList } from "@/features/finance/components/dashboard/RecentActivityList";
import { UpcomingPayments } from "@/features/finance/components/dashboard/UpcomingPayments";
import { Account, Transaction } from "../../types/finance";

interface RightPanelProps {
    accounts: Account[];
    transactions: Transaction[];
}

export const RightPanel = ({ accounts, transactions }: RightPanelProps) => {
    const mainAccount = accounts[0]; // Usamos la primera cuenta como principal para el widget

    return (
        <aside className="w-full lg:w-96 border-l border-white/5 bg-dark-sidebar p-8 lg:p-10 flex flex-col gap-10 overflow-y-auto custom-scrollbar h-screen sticky top-0">


            {/* Recent Activities */}
            <RecentActivityList transactions={transactions} />

            {/* Upcoming Payments */}
            <UpcomingPayments />

        </aside>
    );
};
