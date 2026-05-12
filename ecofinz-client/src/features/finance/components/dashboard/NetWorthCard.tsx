import React from "react";
import { Wallet, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormattedValue } from "./FormattedValue";

interface AssetSource {
  name: string;
  pct: number;
  color: string;
}

interface NetWorthCardProps {
  amount: number;
  isPrivateMode: boolean;
  sources: AssetSource[];
}

export function NetWorthCard({ amount, isPrivateMode, sources }: NetWorthCardProps) {
  return (
    <div className="relative overflow-hidden bg-zinc-900 rounded-[32px] p-7 shadow-lg lg:col-span-2 flex flex-col justify-between">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">Patrimonio Neto</span>
          <h2 className="text-4xl font-black text-white mt-1.5 tracking-tighter">
            <FormattedValue value={amount} isPrivateMode={isPrivateMode} />
          </h2>
          <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
            <ArrowUpRight size={14} /> +12.5% hist.
          </div>
        </div>
        <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md hidden sm:block">
          <Wallet size={22} className="text-white" />
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-4 items-center">
         <div className="flex-1 flex h-2 w-full bg-white/10 rounded-full overflow-hidden">
            {sources.map(a => (
              <div key={a.name} style={{width: `${a.pct}%`}} className={cn("h-full", a.color)} />
            ))}
         </div>
         <div className="flex gap-3 shrink-0">
            {sources.map(a => (
              <div key={a.name} className="flex items-center gap-1">
                <div className={cn("w-1.5 h-1.5 rounded-full", a.color)} />
                <span className="text-[10px] font-bold text-zinc-300">{a.pct}% {a.name}</span>
              </div>
            ))}
         </div>
      </div>

      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-500/30 blur-[60px] rounded-full pointer-events-none"></div>
    </div>
  );
}
