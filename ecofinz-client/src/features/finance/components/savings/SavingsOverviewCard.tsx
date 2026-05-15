'use client';

import React from 'react';
import { PiggyBank, PieChart, ArrowUpRight } from 'lucide-react';
import { FormattedValue } from '@/features/finance/components/dashboard/FormattedValue';
import { cn } from '@/lib/utils';

interface SavingsOverviewCardProps {
  totalSaved: number;
  totalAllocatedPercentage: number;
  availablePercentage: number;
  goalCount: number;
  isPrivateMode: boolean;
}

export function SavingsOverviewCard({
  totalSaved,
  totalAllocatedPercentage,
  availablePercentage,
  goalCount,
  isPrivateMode,
}: SavingsOverviewCardProps) {
  return (
    <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <PiggyBank size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Ahorro Total</h2>
            <p className="text-xs text-zinc-500 font-medium">{goalCount} metas activas</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
          <ArrowUpRight size={14} />
          <span className="text-xs font-bold">{totalAllocatedPercentage}% asignado</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-4xl font-black tracking-tight text-zinc-900">
          <FormattedValue value={totalSaved} isPrivateMode={isPrivateMode} />
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500 font-medium">Distribución</span>
          <span className="text-zinc-400 text-xs font-bold">{totalAllocatedPercentage}% asignado / {availablePercentage}% disponible</span>
        </div>
        <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-indigo-500 transition-all duration-700 rounded-full"
            style={{ width: `${totalAllocatedPercentage}%` }}
          />
          <div
            className="h-full bg-zinc-200 transition-all duration-700"
            style={{ width: `${availablePercentage}%` }}
          />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-zinc-500">Asignado a metas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
            <span className="text-zinc-500">Disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
