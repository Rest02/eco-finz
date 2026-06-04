"use client";

import React from "react";
import { MonthlyProjectionList } from "@/features/finance/components/monthly-projection/MonthlyProjectionList";

export default function MonthlyProjectionListPage() {
  return (
    <div className="relative min-h-screen p-6 lg:p-10 pb-20 w-full max-w-7xl mx-auto transition-all duration-500">
      <MonthlyProjectionList />
    </div>
  );
}
