import Link from "next/link";
import { ReactNode } from "react";

interface AuthCardProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
            {/* Logo */}
            <Link href="/" className="mb-12 flex items-center gap-2 group transition-transform hover:scale-105">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    E
                </div>
                <span className="font-bold text-2xl tracking-tight text-black">EcoFinz</span>
            </Link>

            <div className="w-full max-w-md clean-card p-10 animate-slide-up">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-black mb-3">{title}</h1>
                    <p className="text-zinc-500 text-lg">{subtitle}</p>
                </div>

                {children}
            </div>
        </div>
    );
}
