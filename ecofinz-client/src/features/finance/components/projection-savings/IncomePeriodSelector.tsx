"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface IncomePeriodSelectorProps {
  period: "current" | "3m" | "6m";
  onChange: (period: "current" | "3m" | "6m") => void;
}

const periods = [
  { value: "current" as const, label: "Mes Actual" },
  { value: "3m" as const, label: "3 Meses" },
  { value: "6m" as const, label: "6 Meses" },
];

export function IncomePeriodSelector({ period, onChange }: IncomePeriodSelectorProps) {
  return (
    <div className="flex gap-2">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
            period === p.value
              ? "bg-black text-white shadow-lg shadow-black/20 scale-105"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
