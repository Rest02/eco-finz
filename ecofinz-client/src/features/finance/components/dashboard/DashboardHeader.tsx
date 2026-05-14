import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  isPrivateMode: boolean;
  onTogglePrivateMode: () => void;
  isFullWidth: boolean;
  onToggleFullWidth: () => void;
}

export function DashboardHeader({
  isPrivateMode,
  onTogglePrivateMode,
  isFullWidth,
  onToggleFullWidth,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 text-sm font-medium mt-1">Resumen de tus finanzas personales</p>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleFullWidth} 
          className="flex items-center justify-center p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm transition-all"
          title={isFullWidth ? "Reducir ancho" : "Expandir ancho"}
        >
          {isFullWidth ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
        
        <button 
          onClick={onTogglePrivateMode} 
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border shadow-sm transition-all",
            isPrivateMode 
              ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
              : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
          )}
        >
          {isPrivateMode ? <EyeOff size={16} /> : <Eye size={16} />}
          {isPrivateMode ? "Mostrar Montos" : "Privacidad"}
        </button>
        <div className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2.5 rounded-xl shadow-sm text-zinc-700 text-sm font-bold">
          <Calendar size={16} className="text-zinc-400" />
          {format(new Date(), "MMMM yyyy", { locale: es })}
        </div>
      </div>
    </header>
  );
}
