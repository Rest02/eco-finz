"use client";

import React from "react";
import {
    Cpu,
    Wifi,
    Droplet,
    Briefcase,
    Zap,
    Car,
    Home,
    ChevronRight
} from "lucide-react";

export const RightPanel = () => {
    return (
        <aside className="w-full lg:w-96 border-l border-white/5 bg-dark-sidebar p-8 lg:p-10 flex flex-col gap-10 overflow-y-auto custom-scrollbar h-screen sticky top-0">

            {/* Credit Card Widget */}
            <div className="relative w-full aspect-[1.586] rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 group cursor-pointer">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-bl from-emerald-400 to-teal-900" />
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />

                {/* Card Content */}
                <div className="relative h-full p-6 flex flex-col justify-between z-10 text-white">
                    <div className="flex justify-between items-start">
                        <Cpu className="w-8 h-8 opacity-80 stroke-1" />
                        <Wifi className="w-6 h-6 rotate-90 opacity-60" />
                    </div>

                    <div className="font-mono text-xl tracking-widest drop-shadow-md">
                        4562 1122 4595 7852
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[8px] font-bold uppercase tracking-widest opacity-70 mb-1">Card Holder</p>
                            <p className="text-sm font-medium tracking-wide">Alex Johnson</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-red-500/90" />
                                <div className="w-6 h-6 rounded-full bg-yellow-500/90 opacity-90" />
                            </div>
                            <p className="text-[8px] font-bold mt-1">Mastercard</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-white">Actividad Reciente</h3>
                    <button className="text-xs text-neutral-500 hover:text-white transition-colors">Ver todo</button>
                </div>

                <p className="text-xs text-neutral-600 mb-4">Hoy, 22 Ene 2026</p>

                <div className="space-y-6">
                    {/* Activity 1 */}
                    <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
                                <Droplet className="w-5 h-5 text-neutral-400 group-hover:text-blue-400 transition-colors stroke-[1.5]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Factura de Agua</p>
                                <p className="text-xs text-neutral-500">Completado</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-white">$120</span>
                    </div>

                    {/* Activity 2 */}
                    <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
                                <Briefcase className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400 transition-colors stroke-[1.5]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">Salario Mensual</p>
                                <p className="text-xs text-neutral-500">Recibido</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-emerald-400">+$4,500</span>
                    </div>

                    {/* Activity 3 */}
                    <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
                                <Zap className="w-5 h-5 text-neutral-400 group-hover:text-yellow-400 transition-colors stroke-[1.5]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">Factura de Luz</p>
                                <p className="text-xs text-neutral-500">Completado</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-white">$150</span>
                    </div>
                </div>
            </div>

            {/* Upcoming Payments */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-white">Próximos Pagos</h3>
                    <ChevronRight className="w-4 h-4 text-neutral-500" />
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                                <Home className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Alquiler</p>
                                <p className="text-xs text-amber-500/80">Pendiente</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-white">$1,500</span>
                    </div>

                    <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                                <Car className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Seguro Auto</p>
                                <p className="text-xs text-amber-500/80">Pendiente</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-white">$150</span>
                    </div>
                </div>
            </div>

        </aside>
    );
};
