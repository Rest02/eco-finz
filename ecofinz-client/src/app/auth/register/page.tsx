"use client";
import { useState } from 'react';
import * as authService from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authService.registerUser({ name, email, password });
      router.push(`/auth/verify?email=${email}`);
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        const errorMessage = 'Network Error: Could not connect to the server. Please ensure the backend is running and that CORS is configured correctly.';
        console.error(errorMessage, err);
        setError(errorMessage);
      } else {
        const errorMessage = 'Failed to register. Please check the console for more details.';
        console.error(errorMessage, err);
        setError(errorMessage);
      }
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            {/* Titles */}
            <h1 className="text-2xl font-semibold text-white tracking-tight text-center mb-2">Crea tu Cuenta</h1>
            <p className="text-base text-neutral-400 text-center mb-8 leading-relaxed">
              Únete a Ecofinz y comienza a<br />
              gestionar tus finanzas.
            </p>

            {/* Error Message */}
            {error && (
              <div className="w-full mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-300 ml-1">
                  Nombre Completo
                </label>
                <div className="relative group/input">
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre" 
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all duration-200 shadow-sm"
                    required
                  />
                  {/* Subtle border gradient on hover */}
                  <div className="absolute inset-0 rounded-lg ring-1 ring-white/0 group-hover/input:ring-white/10 pointer-events-none transition-all"></div>
                </div>
              </div>

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

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-300 ml-1">
                  Contraseña
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
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                {/* Register Button (Primary) */}
                <button 
                  type="submit" 
                  className="w-full bg-white text-black font-medium text-base py-3 px-4 rounded-lg hover:bg-neutral-200 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Crear Cuenta
                </button>
                

              </div>
            </form>

            {/* Divider */}
            <div className="relative w-full py-8 flex items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-sm text-neutral-500">O continuar con</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Social Login */}
            <button type="button" className="w-full flex items-center justify-center gap-3 bg-[#111] border border-white/10 hover:border-white/20 hover:bg-white/5 text-neutral-200 font-medium text-base py-3 px-4 rounded-lg transition-all duration-200 active:scale-[0.98] group">
              <svg className="w-5 h-5 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Google
            </button>

          </div>
          
          {/* Bottom subtle gradient inside card */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        
        {/* Footer Links */}
        <p className="mt-8 text-center text-sm text-neutral-500">
          ¿Ya tienes cuenta? <Link href="/auth/login" className="text-neutral-300 hover:text-white transition-colors underline decoration-neutral-700 underline-offset-4">Inicia sesión</Link>
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
