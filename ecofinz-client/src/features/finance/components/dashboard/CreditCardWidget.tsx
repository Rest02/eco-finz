"use client";

import React from "react";
import { Cpu, Wifi } from "lucide-react";

interface CreditCardWidgetProps {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    type?: "Mastercard" | "Visa";
}

export const CreditCardWidget = ({
    cardNumber = "4562 1122 4595 7852",
    cardHolder = "Alex Johnson",
    type = "Mastercard"
}: CreditCardWidgetProps) => {
    return (
        <div className="relative w-full aspect-[1.586] rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 group cursor-pointer">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-bl from-emerald-400 to-teal-900" />
            {/* Noise Texture Overlay */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
            />

            {/* Card Content */}
            <div className="relative h-full p-6 flex flex-col justify-between z-10 text-white">
                <div className="flex justify-between items-start">
                    <Cpu className="w-8 h-8 opacity-80 stroke-1" />
                    <Wifi className="w-6 h-6 rotate-90 opacity-60" />
                </div>

                <div className="font-mono text-xl tracking-widest drop-shadow-md">
                    {cardNumber}
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest opacity-70 mb-1">Card Holder</p>
                        <p className="text-sm font-medium tracking-wide">{cardHolder}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-red-500/90" />
                            <div className="w-6 h-6 rounded-full bg-yellow-500/90 opacity-90" />
                        </div>
                        <p className="text-[8px] font-bold mt-1">{type}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
