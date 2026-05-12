import React from "react";
import { cn } from "@/lib/utils";
import { FormattedValue } from "./FormattedValue";

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  color: string;
}

interface SavingsGoalsProps {
  goals: Goal[];
  isPrivateMode: boolean;
}

export function SavingsGoals({ goals, isPrivateMode }: SavingsGoalsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-bold text-zinc-900 text-lg">Metas de Ahorro</h3>
        <button className="text-xs font-bold text-indigo-600">Administrar</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map(goal => {
          const percent = Math.min(100, (goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="bg-white rounded-[24px] p-5 border border-zinc-200/60 shadow-sm group hover:shadow-md transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-bold text-zinc-800">{goal.name}</h4>
                <span className="text-[10px] font-black text-zinc-400">{Math.round(percent)}%</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", goal.color)} style={{width: `${percent}%`}} />
                </div>
                <div className="flex justify-between items-end pt-1">
                  <span className="text-sm font-black text-zinc-900">
                    <FormattedValue value={goal.current} isPrivateMode={isPrivateMode} />
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400 whitespace-nowrap flex items-center gap-1">
                    meta <FormattedValue value={goal.target} isPrivateMode={isPrivateMode} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
