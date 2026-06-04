"use client";

import React from "react";
import { useParams } from "next/navigation";
import { MonthlyProjectionDetail } from "@/features/finance/components/monthly-projection/MonthlyProjectionDetail";

export default function MonthlyProjectionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="relative min-h-screen p-6 lg:p-10 pb-20 w-full max-w-7xl mx-auto transition-all duration-500">
      <MonthlyProjectionDetail id={id} />
    </div>
  );
}
