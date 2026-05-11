"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign, 
  ArrowUpRight, 
  ShoppingBag,
  Car,
  Calendar,
  Eye,
  EyeOff,
  ChevronRight,
  Maximize2,
  Minimize2
} from "lucide-react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

const COMPARISON_DATA = [
  { month: "Ene", ingresos: 1200000, egresos: 850000 },
  { month: "Feb", ingresos: 1350000, egresos: 920000 },
  { month: "Mar", ingresos: 1150000, egresos: 880000 },
  { month: "Abr", ingresos: 1400000, egresos: 950000 },
  { month: "May", ingresos: 1250000, egresos: 780000 },
  { month: "Jun", ingresos: 1600000, egresos: 1050000 },
];

const SAVINGS_GOALS = [
  { id: 1, name: "✈️ Viaje a Japón", target: 3000000, current: 1800000, color: "bg-rose-500" },
  { id: 2, name: "🚗 Nuevo Auto", target: 8000000, current: 2400000, color: "bg-indigo-500" },
  { id: 3, name: "🛡️ Fondo Emergencia", target: 4000000, current: 3200000, color: "bg-emerald-500" },
];

// Sparkline Mock Data (Last 7 units)
const SPARK_DATA_EGRESOS = [
  { val: 20000 }, { val: 15000 }, { val: 45000 }, { val: 10000 }, { val: 35000 }, { val: 12000 }, { val: 8000 }
];
const SPARK_DATA_AHORRO = [
  { val: 10 }, { val: 15 }, { val: 12 }, { val: 20 }, { val: 25 }, { val: 32 }, { val: 34 }
];

const EXPENSE_CATEGORIES = [
  { name: "Alimentación", value: 320000, color: "#6366F1", change: +5 },
  { name: "Transporte", value: 85000, color: "#F59E0B", change: -2 },
  { name: "Entretenimiento", value: 120000, color: "#EC4899", change: +15 },
  { name: "Compras", value: 250000, color: "#10B981", change: -8 },
  { name: "Servicios", value: 145000, color: "#3B82F6", change: 0 },
];

const RECENT_TRANSACTIONS = [
  { id: "tx1", desc: "Supermercado Jumbo", amount: -85200, date: "Hoy", icon: ShoppingBag, color: "text-indigo-600 bg-indigo-50", category: "Alimentación" },
  { id: "tx2", desc: "Transferencia Sueldo", amount: 1600000, date: "Ayer", icon: DollarSign, color: "text-emerald-600 bg-emerald-50", category: "Ingresos" },
  { id: "tx3", desc: "Carga Bip", amount: -10000, date: "Ayer", icon: Car, color: "text-amber-600 bg-amber-50", category: "Transporte" },
  { id: "tx4", desc: "Netflix", amount: -9900, date: "08 May", icon: ShoppingBag, color: "text-rose-600 bg-rose-50", category: "Servicios" },
];

const ASSET_SOURCES = [
  { name: "Banco", pct: 50, color: "bg-indigo-400" },
  { name: "Inversión", pct: 40, color: "bg-emerald-400" },
  { name: "Caja", pct: 10, color: "bg-zinc-400" },
];

export default function FinanceDashboardPage() {
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(true);

  const stats = useMemo(() => {
    const currentMonthData = COMPARISON_DATA[COMPARISON_DATA.length - 1];
    const savings = currentMonthData.ingresos - currentMonthData.egresos;
    const savingsPercentage = (savings / currentMonthData.ingresos) * 100;
    return {
      patrimonioNeto: 12450800, 
      mesActualIngresos: currentMonthData.ingresos,
      mesActualEgresos: currentMonthData.egresos,
      mesActualAhorro: savings,
      porcentajeAhorro: Math.round(savingsPercentage),
    };
  }, []);

  const formatVal = (val: number) => {
    const txt = new Intl.NumberFormat("es-CL", {
      style: "currency", currency: "CLP", maximumFractionDigits: 0,
    }).format(val);
    return (
      <span className={cn("transition-all duration-300 select-none inline-block", 
        isPrivateMode && "blur-md saturate-0 opacity-50 pointer-events-none"
      )}>
        {txt}
      </span>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={cn(
        "relative min-h-screen p-6 lg:p-10 pb-20 space-y-8 w-full transition-all duration-500 ease-in-out",
        !isFullWidth && "max-w-7xl mx-auto"
      )}
    >
      
      {/* ---------------- HEADER ---------------- */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">Dashboard</h1>
          <p className="text-zinc-500 text-sm font-medium mt-1">Resumen de tus finanzas personales</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFullWidth(!isFullWidth)} 
            className="flex items-center justify-center p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm transition-all"
            title={isFullWidth ? "Reducir ancho" : "Expandir ancho"}
          >
            {isFullWidth ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          
          <button 
            onClick={() => setIsPrivateMode(!isPrivateMode)} 
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

      {/* ---------------- TOP KPI ROW ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* PATRIMONIO NETO CON DESGLOSE */}
        <div className="relative overflow-hidden bg-zinc-900 rounded-[32px] p-7 shadow-lg lg:col-span-2 flex flex-col justify-between">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">Patrimonio Neto</span>
              <h2 className="text-4xl font-black text-white mt-1.5 tracking-tighter">
                {formatVal(stats.patrimonioNeto)}
              </h2>
              <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight size={14} /> +12.5% hist.
              </div>
            </div>
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md hidden sm:block">
              <Wallet size={22} className="text-white" />
            </div>
          </div>

          {/* Desglose de Fuentes (Idea 1) */}
          <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-4 items-center">
             <div className="flex-1 flex h-2 w-full bg-white/10 rounded-full overflow-hidden">
                {ASSET_SOURCES.map(a => (
                  <div key={a.name} style={{width: `${a.pct}%`}} className={cn("h-full", a.color)} />
                ))}
             </div>
             <div className="flex gap-3 shrink-0">
                {ASSET_SOURCES.map(a => (
                  <div key={a.name} className="flex items-center gap-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full", a.color)} />
                    <span className="text-[10px] font-bold text-zinc-300">{a.pct}% {a.name}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-500/30 blur-[60px] rounded-full pointer-events-none"></div>
        </div>

        {/* GASTO NETO MES CON SPARKLINE */}
        <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm flex flex-col overflow-hidden">
          <div className="p-7 flex-1 flex flex-col justify-center pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wide">Egresos Mes</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><TrendingDown size={18}/></div>
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 tracking-tight">
              {formatVal(stats.mesActualEgresos)}
            </h3>
            <p className="text-[10px] font-bold text-emerald-600 mt-1 bg-emerald-50 inline-block w-fit px-2 py-0.5 rounded-md">
              -4.2%
            </p>
          </div>
          {/* Micro Sparkline */}
          <div className="h-10 w-full opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPARK_DATA_EGRESOS}>
                <defs>
                  <linearGradient id="gradSparkE" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fb7185" stopOpacity={0.2}/><stop offset="100%" stopColor="#fb7185" stopOpacity={0}/></linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#fb7185" strokeWidth={2} fill="url(#gradSparkE)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CAPACIDAD DE AHORRO CON SPARKLINE */}
        <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm flex flex-col overflow-hidden">
          <div className="p-7 flex-1 flex flex-col justify-center pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wide">Ahorro Mensual</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={18}/></div>
            </div>
            <h3 className="text-2xl font-extrabold text-indigo-600 mt-1 tracking-tight">
              {formatVal(stats.mesActualAhorro)}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1.5 bg-indigo-50 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{width: `${stats.porcentajeAhorro}%`}} />
              </div>
              <span className="text-[11px] font-black text-indigo-700">{stats.porcentajeAhorro}%</span>
            </div>
          </div>
          {/* Micro Sparkline */}
          <div className="h-10 w-full opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPARK_DATA_AHORRO}>
                <defs>
                  <linearGradient id="gradSparkA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="100%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={2} fill="url(#gradSparkA)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ---------------- CHARTS GRID ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART: INGRESOS VS EGRESOS */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-zinc-200/60 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Ingresos vs Egresos</h3>
              <p className="text-zinc-500 text-xs font-medium">Histórico mensual</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"/> Ingresos</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-rose-400 rounded-sm"/> Egresos</div>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPARISON_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                  dy={8}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10}} 
                  tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 8}}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-900 text-white p-3 rounded-xl shadow-xl border border-zinc-800 text-xs font-medium">
                          <p className="text-zinc-400 mb-2 font-bold">{payload[0].payload.month}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-4"><span className="text-indigo-300">Ingresos:</span> <b>{formatVal(payload[0].value as number)}</b></div>
                            <div className="flex justify-between gap-4"><span className="text-rose-300">Egresos:</span> <b>{formatVal(payload[1].value as number)}</b></div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="ingresos" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="egresos" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INTELLIGENCE OF SPENDING (PIE) */}
        <div className="bg-white rounded-[32px] p-8 border border-zinc-200/60 shadow-sm flex flex-col h-full">
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Inteligencia de Gastos</h3>
          <p className="text-zinc-500 text-xs font-medium mb-6">Categorización</p>
          
          <div className="relative h-[150px] flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={EXPENSE_CATEGORIES} innerRadius={45} outerRadius={60} paddingAngle={6} dataKey="value">
                  {EXPENSE_CATEGORIES.map((entry, index) => <Cell key={`c-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Total</span>
              <span className="text-base font-black text-zinc-800 tracking-tight">{formatVal(stats.mesActualEgresos)}</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
            {EXPENSE_CATEGORIES.map(cat => (
              <div key={cat.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: cat.color}}/>
                  <span className="text-xs font-semibold text-zinc-600">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-900">{formatVal(cat.value)}</span>
                  <span className={cn("text-[9px] font-bold px-1.5 rounded-md", cat.change > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")}>
                    {cat.change > 0 ? '+' : ''}{cat.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ---------------- NUEVA IDEA 2: METAS DE AHORRO ---------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-zinc-900 text-lg">Metas de Ahorro</h3>
          <button className="text-xs font-bold text-indigo-600">Administrar</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAVINGS_GOALS.map(goal => {
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
                    <span className="text-sm font-black text-zinc-900">{formatVal(goal.current)}</span>
                    <span className="text-[10px] font-medium text-zinc-400">meta {formatVal(goal.target)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- BOTTOM ROW: MOVEMENTS ---------------- */}
      <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-sm overflow-hidden">
        <div className="p-6 md:px-8 border-b border-zinc-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
          <h3 className="font-bold text-zinc-900 text-lg">Últimos Movimientos</h3>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <div className="p-2 md:p-4">
          <div className="space-y-1">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 md:px-4 rounded-2xl hover:bg-zinc-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", tx.color)}>
                    <tx.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{tx.desc}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-zinc-400 font-medium">{tx.date}</p>
                      <span className="w-1 h-1 rounded-full bg-zinc-200"/>
                      <p className="text-[11px] text-zinc-500">{tx.category}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm md:text-base font-extrabold tracking-tight", 
                    tx.amount > 0 ? "text-emerald-600" : "text-zinc-900"
                  )}>
                    {tx.amount > 0 ? '+' : ''}{formatVal(tx.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  );
}
