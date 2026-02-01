import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-6 relative">
            {/* Back to Home - Top Left Corner */}
            <Link
                href="/"
                className="absolute top-8 left-8 p-3 bg-white border border-zinc-200 rounded-full text-zinc-500 hover:text-black hover:border-zinc-300 transition-all shadow-sm hover:shadow-md group"
                aria-label="Volver al inicio"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </Link>

            <div className="w-full max-w-[480px]">
                {/* Main Card */}
                <div className="bg-white border border-zinc-200 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 animate-fade-in">
                    {/* Logo Inside Card */}
                    <div className="flex justify-center mb-6">
                        <Link href="/">
                            <img src="/logo.png" alt="EcoFinz" className="w-16 h-16 object-contain hover:scale-105 transition-transform" />
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">{title}</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed">{subtitle}</p>
                    </div>

                    {children}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-zinc-400 font-medium">
                        © 2026 EcoFinz Inc. <span className="mx-2">•</span>
                        <Link href="#" className="hover:text-black transition-colors">Privacidad</Link>
                        <span className="mx-2">•</span>
                        <Link href="#" className="hover:text-black transition-colors">Términos</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
