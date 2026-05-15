'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { FormattedValue } from '@/features/finance/components/dashboard/FormattedValue';
import { Pencil, Trash2, Target, Calendar } from 'lucide-react';
import type { SavingsGoal } from '../../types/savings';

interface GoalCardProps {
  goal: SavingsGoal;
  isPrivateMode: boolean;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-indigo-500',
  COMPLETED: 'bg-emerald-500',
  CANCELLED: 'bg-zinc-300',
};

const statusLabels: Record<string, string> = {
  ACTIVE: 'Activa',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

export function GoalCard({ goal, isPrivateMode, onEdit, onDelete }: GoalCardProps) {
  return (
    <div className="bg-white rounded-[24px] p-5 border border-zinc-200/60 shadow-sm group hover:shadow-md transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', statusColors[goal.status])} />
          <h4 className="text-sm font-bold text-zinc-800">{goal.name}</h4>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              goal.status === 'COMPLETED'
                ? 'bg-emerald-500'
                : goal.status === 'CANCELLED'
                  ? 'bg-zinc-300'
                  : 'bg-indigo-500',
            )}
            style={{ width: `${Math.min(100, goal.progress)}%` }}
          />
        </div>

        <div className="flex justify-between items-end pt-1">
          <div>
            <span className="text-sm font-black text-zinc-900">
              <FormattedValue value={goal.currentAmount} isPrivateMode={isPrivateMode} />
            </span>
            <span className="text-[10px] font-medium text-zinc-400 ml-1.5">
              de <FormattedValue value={goal.targetAmount} isPrivateMode={isPrivateMode} />
            </span>
          </div>
          <span className="text-xs font-black text-zinc-500">
            {goal.progress}%
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Target size={12} />
          <span className="text-[10px] font-bold">
            {goal.allocatedPercentage}% del ahorro
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Calendar size={12} />
          <span className="text-[10px] font-bold capitalize">{statusLabels[goal.status]}</span>
        </div>
      </div>
    </div>
  );
}
