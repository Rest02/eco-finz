"use client";

import React from "react";
import { CreditCardWidget } from "@/features/finance/components/dashboard/CreditCardWidget";
import { RecentActivityList } from "@/features/finance/components/dashboard/RecentActivityList";
import { UpcomingPayments } from "@/features/finance/components/dashboard/UpcomingPayments";

export const RightPanel = () => {
    return (
        <aside className="w-full lg:w-96 border-l border-white/5 bg-dark-sidebar p-8 lg:p-10 flex flex-col gap-10 overflow-y-auto custom-scrollbar h-screen sticky top-0">

            {/* Credit Card Widget */}
            <CreditCardWidget />

            {/* Recent Activities */}
            <RecentActivityList />

            {/* Upcoming Payments */}
            <UpcomingPayments />

        </aside>
    );
};
