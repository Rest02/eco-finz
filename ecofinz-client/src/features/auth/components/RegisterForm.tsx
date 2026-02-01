"use client";
import { useState } from 'react';
import * as authService from '@/features/auth/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await authService.registerUser({ name, email, password });
            router.push(`/auth/verify?email=${email}`);
        } catch (err) {
            setIsSubmitting(false);
            if (axios.isAxiosError(err) && !err.response) {
                setError('Error de Red: No se pudo conectar al servidor. Por favor verifica tu conexión.');
            } else {
                setError('Error al registrarse. Por favor intenta de nuevo.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-zinc-900 ml-1">
                    Nombre Completo
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full bg-white border border-zinc-200 rounded-xl pl-12 pr-4 py-3.5 text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200"
                        required
                        disabled={isSubmitting}
                    />
                </div>
            </div>

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
                <label htmlFor="password" className="block text-sm font-bold text-zinc-900 ml-1">
                    Contraseña
                </label>
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
                {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>

            <p className="text-center text-sm font-medium text-zinc-500 pt-2">
                ¿Ya tienes cuenta?{" "}
                <Link href="/auth/login" className="text-black font-bold hover:underline underline-offset-4">
                    Inicia sesión
                </Link>
            </p>
        </form>
    );
}