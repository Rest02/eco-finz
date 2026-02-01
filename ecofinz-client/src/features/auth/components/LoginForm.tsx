"use client";
import { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login({ email, password });
            router.push('/finance/dashboard');
        } catch (error) {
            console.error('Failed to login', error);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-zinc-900 ml-1">
                    Correo Electrónico
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full bg-white border border-zinc-200 rounded-xl pl-12 pr-4 py-3.5 text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200"
                        required
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label htmlFor="password" className="block text-sm font-bold text-zinc-900">
                        Contraseña
                    </label>
                    <Link href="/auth/forgot-password" title="Olvidaste tu contraseña" className="text-sm font-medium text-zinc-500 hover:text-black transition-colors">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-zinc-200 rounded-xl pl-12 pr-4 py-3.5 text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200"
                        required
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-zinc-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Iniciando sesión...' : 'Entrar'}
                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>

            <p className="text-center text-sm font-medium text-zinc-500 pt-2">
                ¿No tienes una cuenta?{" "}
                <Link href="/auth/register" className="text-black font-bold hover:underline underline-offset-4">
                    Crea una ahora
                </Link>
            </p>
        </form>
    );
}
