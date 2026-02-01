"use client";
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Mail, Send } from 'lucide-react';

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await apiClient.post('/auth/forgot-password', { email });
            toast.success(response.data.message || 'Correo de recuperación enviado.');
            setEmail('');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Ocurrió un error al enviar el correo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleForgotPassword} className="space-y-6">
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

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-zinc-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
                {!isSubmitting && <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="pt-2">
                <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm font-bold text-zinc-500 hover:text-black transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Volver al login
                </Link>
            </div>
        </form>
    );
}
