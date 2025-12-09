'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      toast.success(response.data.message);
      setEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ocurrió un error al enviar el correo.');
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
                <circle cx="12" cy="12" r="1"></circle>
                <path d="M4 10.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.5"></path>
              </svg>
            </div>

            {/* Titles */}
            <h1 className="text-2xl font-semibold text-white tracking-tight text-center mb-2">Recuperar Contraseña</h1>
            <p className="text-base text-neutral-400 text-center mb-8 leading-relaxed">
              Ingresa tu correo electrónico y<br />
              te enviaremos un enlace para restablecer tu contraseña.
            </p>

            {/* Form */}
            <form onSubmit={handleForgotPassword} className="w-full space-y-5">
              
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300 ml-1">
                  Correo Electrónico
                </label>
                <div className="relative group/input">
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com" 
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all duration-200 shadow-sm"
                    required
                  />
                  {/* Subtle border gradient on hover */}
                  <div className="absolute inset-0 rounded-lg ring-1 ring-white/0 group-hover/input:ring-white/10 pointer-events-none transition-all"></div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                {/* Send Button (Primary) */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-white text-black font-medium text-base py-3 px-4 rounded-lg hover:bg-neutral-200 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
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

          </div>
          
          {/* Bottom subtle gradient inside card */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        
        {/* Footer Links */}
        <p className="mt-8 text-center text-sm text-neutral-500">
          ¿Recordaste tu contraseña? <Link href="/login" className="text-neutral-300 hover:text-white transition-colors underline decoration-neutral-700 underline-offset-4">Inicia sesión</Link>
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
