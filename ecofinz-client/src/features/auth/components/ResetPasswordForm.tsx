"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import { ArrowRight, Lock } from 'lucide-react';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error('Token no encontrado en la URL.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (success) {
      toast.success('¡Contraseña cambiada con éxito! Redirigiendo al login...');
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    if (!token) {
      toast.error('Token no válido.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/auth/reset-password', { token, password });
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'El token es inválido o ha expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {success ? (
        <div className="p-4 bg-zinc-50 border border-black/10 rounded-xl text-center">
          <p className="text-sm text-black font-bold">¡Contraseña cambiada con éxito! Redirigiendo al login...</p>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-bold text-zinc-900 ml-1">
              Nueva Contraseña
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
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-zinc-900 ml-1">
              Confirmar Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-400 group-focus-within:text-black transition-colors" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-zinc-200 rounded-xl pl-12 pr-4 py-3.5 text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!token || loading}
            className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-zinc-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="pt-2 text-center">
            <Link href="/auth/login" className="text-sm font-bold text-zinc-500 hover:text-black transition-colors">
              Volver al login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
