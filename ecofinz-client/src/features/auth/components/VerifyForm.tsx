"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as authService from '@/features/auth/services/authService';
import axios from 'axios';
import { ArrowRight, Mail, Key } from 'lucide-react';

export default function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [verifyPin, setVerifyPin] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const emailFromUrl = searchParams.get('email');
        if (emailFromUrl) {
            setEmail(emailFromUrl);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsSubmitting(true);
        try {
            await authService.verifyUser({ email, verifyPin });
            setMessage('¡Verificación exitosa! Redirigiendo...');
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (err) {
            setIsSubmitting(false);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Error de verificación. Verifica el PIN e intenta de nuevo.');
            } else {
                setError('Ocurrió un error inesperado.');
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
            {message && (
                <div className="p-4 bg-zinc-50 border border-black/10 rounded-xl">
                    <p className="text-sm text-black font-bold text-center">{message}</p>
                </div>
            )}

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
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-12 pr-4 py-3.5 text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200"
                        required
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="pin" className="block text-sm font-bold text-zinc-900 ml-1">
                    PIN de Verificación
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <input
                        type="text"
                        id="pin"
                        value={verifyPin}
                        onChange={(e) => setVerifyPin(e.target.value)}
                        placeholder="Introduce tu PIN"
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
                {isSubmitting ? 'Verificando...' : 'Verificar Cuenta'}
                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>

            <p className="text-center text-sm font-medium text-zinc-500 pt-2">
                ¿No recibiste el código?{" "}
                <button type="button" className="text-black font-bold hover:underline underline-offset-4">
                    Reenviar
                </button>
            </p>
        </form>
    );
}
