"use client";

import React from "react";
import { Droplet, Briefcase, Zap, Wifi } from "lucide-react";

interface ActivityItemProps {
    icon: React.ElementType;
    title: string;
    status: string;
    amount: string;
    colorClass: string;
}

const ActivityItem = ({ icon: Icon, title, status, amount, colorClass }: ActivityItemProps) => (
    <div className="flex items-center justify-between group cursor-pointer">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
                <Icon className={`w-5 h-5 text-neutral-400 group-hover:${colorClass} transition-colors stroke-[1.5]`} />
            </div>
            <div>
                <p className={`text-sm font-medium text-white group-hover:${colorClass} transition-colors`}>{title}</p>
                <p className="text-xs text-neutral-500">{status}</p>
            </div>
        </div>
        <span className={`text-sm font-medium ${amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>
            {amount}
        </span>
    </div>
);

export const RecentActivityList = () => {
    const activities: ActivityItemProps[] = [
        {
            icon: Droplet,
            title: "Water Bill",
            status: "Successfully",
            amount: "$120",
            colorClass: "text-blue-400",
        },
        {
            icon: Briefcase,
            title: "Income Salary",
            status: "Received",
            amount: "+$4,500",
            colorClass: "text-emerald-400",
        },
        {
            icon: Zap,
            title: "Electric Bill",
            status: "Successfully",
            amount: "$150",
            colorClass: "text-yellow-400",
        },
        {
            icon: Wifi,
            title: "Internet Bill",
            status: "Successfully",
            amount: "$60",
            colorClass: "text-purple-400",
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Actividad Reciente</h3>
                <button className="text-xs text-neutral-500 hover:text-white transition-colors">Ver todo</button>
            </div>

            <p className="text-xs text-neutral-600 mb-4">02 Mar 2024</p>

            <div className="space-y-6">
                {activities.map((activity, index) => (
                    <ActivityItem key={index} {...activity} />
                ))}
            </div>
        </div>
    );
};
