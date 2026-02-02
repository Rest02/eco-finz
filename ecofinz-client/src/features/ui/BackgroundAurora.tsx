"use client";

import React from "react";

export const BackgroundAurora = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-zinc-50 transition-colors duration-500">
            {/* Orb 1: Pearl/Silver - Top Left */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-zinc-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>

            {/* Orb 2: Light Gray - Top Right */}
            <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>

            {/* Orb 3: Slate tint - Bottom Left */}
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>

            {/* Orb 4: Center floater (very subtle) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-1000"></div>
        </div>
    );
};
