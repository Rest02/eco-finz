'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { toast } from 'react-hot-toast';

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
    <div className="min-h-screen flex items-center justify-center overflow-hidden antialiased selection:bg-purple-500/30 text-neutral-200 relative bg-[#050505]">
      {/* Background Atmospheric Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Purple/Blue main gradient from image (Top Left) */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
        
        {/* Blue gradient (Top Right) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-blob delay-2000 mix-blend-screen"></div>
        
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px] animate-blob delay-4000"></div>
      </div>

      {/* Main Card Container */}
      <main className="relative z-10 w-full max-w-[440px] px-4 sm:px-0">
        
        {/* Card Backdrop with specific Green/Purple glows from image */}
        <div className="relative w-full bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden group">
          
          {/* Internal Glow Effects (Green Left, Purple Right - matching image) */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-[60px] animate-glow pointer-events-none"></div>
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-[60px] animate-glow delay-2000 pointer-events-none"></div>
          
          <div className="relative p-8 sm:p-10 flex flex-col items-center">
            
            {/* Icon */}
            <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            {/* Titles */}
            <h1 className="text-2xl font-semibold text-white tracking-tight text-center mb-2">Restablecer Contraseña</h1>
            <p className="text-base text-neutral-400 text-center mb-8 leading-relaxed">
              Ingresa tu nueva contraseña para<br />
              acceder a tu cuenta.
            </p>

            {success ? (
              <div className="w-full">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-6">
                  <p className="text-sm text-emerald-400 text-center">¡Contraseña cambiada con éxito! Redirigiendo al login...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="w-full space-y-5">
                
                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-300 ml-1">
                    Nueva Contraseña
                  </label>
                  <div className="relative group/input">
                    <input 
                      type="password" 
                      id="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all duration-200 shadow-sm"
                      required
                    />
                    {/* Subtle border gradient on hover */}
                    <div className="absolute inset-0 rounded-lg ring-1 ring-white/0 group-hover/input:ring-white/10 pointer-events-none transition-all"></div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 ml-1">
                    Confirmar Contraseña
                  </label>
                  <div className="relative group/input">
                    <input 
                      type="password" 
                      id="confirmPassword" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all duration-200 shadow-sm"
                      required
                    />
                    {/* Subtle border gradient on hover */}
                    <div className="absolute inset-0 rounded-lg ring-1 ring-white/0 group-hover/input:ring-white/10 pointer-events-none transition-all"></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  {/* Reset Button (Primary) */}
                  <button 
                    type="submit" 
                    disabled={!token || loading}
                    className="w-full bg-white text-black font-medium text-base py-3 px-4 rounded-lg hover:bg-neutral-200 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                  </button>
                  
                  {/* Back to Login Button (Secondary) */}
                  <Link href="/login">
                    <button 
                      type="button" 
                      className="w-full bg-transparent border border-white/10 text-white font-medium text-base py-3 px-4 rounded-lg hover:bg-white/5 active:scale-[0.98] transition-all duration-200"
                    >
                      Volver al login
                    </button>
                  </Link>
                </div>
              </form>
            )}

          </div>
          
          {/* Bottom subtle gradient inside card */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        
        {/* Footer Links */}
        <p className="mt-8 text-center text-sm text-neutral-500">
          ¿Recuerdas tu contraseña? <Link href="/login" className="text-neutral-300 hover:text-white transition-colors underline decoration-neutral-700 underline-offset-4">Inicia sesión</Link>
        </p>

      </main>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-blob {
          animation: float 10s infinite ease-in-out;
        }
        .animate-glow {
          animation: pulse-glow 4s infinite ease-in-out;
        }
        .delay-2000 { animation-delay: 2s; }
        .delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
