'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { GoalCard } from './GoalCard';
import type { SavingsGoal } from '../../types/savings';

interface GoalListProps {
  goals: SavingsGoal[];
  isPrivateMode: boolean;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export function GoalList({
  goals,
  isPrivateMode,
  onEdit,
  onDelete,
  onNew,
}: GoalListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-zinc-900 text-lg">Mis Metas de Ahorro</h3>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
        >
          <Plus size={14} />
          Nueva Meta
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-zinc-200/60 shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4 text-zinc-300">
            <Plus size={28} />
          </div>
          <h4 className="text-sm font-bold text-zinc-500 mb-1">
            No tienes metas de ahorro
          </h4>
          <p className="text-xs text-zinc-400 font-medium">
            Crea tu primera meta para empezar a trackear tu progreso
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isPrivateMode={isPrivateMode}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
