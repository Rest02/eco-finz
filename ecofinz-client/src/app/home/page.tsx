"use client";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import Link from 'next/link';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full flex flex-col antialiased selection:bg-emerald-500/30 text-neutral-300 relative overflow-x-hidden bg-[#050505]">

        {/* Background Atmospheric Effects (Global) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Purple Blob (Top Left) */}
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
          {/* Emerald Blob (Top Right) */}
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-emerald-900/10 rounded-full blur-[100px] animate-blob delay-2000 mix-blend-screen"></div>
          {/* Blue Blob (Bottom) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] bg-blue-900/10 rounded-full blur-[100px] animate-blob delay-4000"></div>
        </div>

        {/* Navigation */}
        <header className="relative z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">

              {/* Logo */}
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-400">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <span className="text-xl font-medium text-white tracking-tight">Ecofinz</span>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-8">
                <a href="#" className="text-sm font-medium text-white transition-colors">Inicio</a>
                <a href="#" className="text-sm font-normal text-neutral-400 hover:text-white transition-colors">Movimientos</a>
                <a href="#" className="text-sm font-normal text-neutral-400 hover:text-white transition-colors">Presupuestos</a>
                <a href="#" className="text-sm font-normal text-neutral-400 hover:text-white transition-colors relative group">
                  Educación
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </a>
                <a href="#" className="text-sm font-normal text-neutral-400 hover:text-white transition-colors">Tarjetas</a>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </button>
                <div className="hidden sm:flex items-center gap-2">
                  <button className="group flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                    <span className="text-xs font-medium text-neutral-300 ml-2">Mi Cuenta</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[1px]">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full rounded-full object-cover border-2 border-[#050505]" />
                    </div>
                  </button>
                </div>
                <button className="md:hidden p-2 text-neutral-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 w-full flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

          {/* Page Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-3xl md:text-5xl font-medium text-white tracking-tight leading-tight">
              Tus <span className="text-emerald-400 font-normal italic">Finanzas</span> y Novedades<br />
              del Mercado <span className="text-purple-400 font-normal italic">Global</span>
            </h1>
            <p className="text-neutral-500 max-w-xl mx-auto font-light text-lg">
              Mantente al día con análisis expertos y el estado de tu portafolio.
            </p>
          </div>

          {/* Grid Layout (Matching the Image Structure) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN: Featured Item (Approx 60-65% width) */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Tag */}
              <div className="flex items-center justify-between">
                <span className="inline-flex px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium tracking-wide uppercase">
                  Destacado del Mes
                </span>
                <button className="text-neutral-500 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <circle cx="18" cy="5" r="3"></circle>
                    <line x1="12" y1="20" x2="8" y2="5"></line>
                    <path d="M2 12a10 10 0 0 0 18.8 4.3"></path>
                  </svg>
                </button>
              </div>

              {/* Featured Card */}
              <div className="group relative w-full bg-[#0a0a0a]/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]">

                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg" alt="Finanzas Digitales" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60"></div>

                  {/* Floating Data Visual (Decoration) */}
                  <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-400">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    <span className="text-xs font-medium text-white">+12.5% Rendimiento</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight mb-4 group-hover:text-emerald-400 transition-colors">
                    El origen de la inflación y cómo proteger tus activos en 2024
                  </h2>
                  <p className="text-neutral-400 font-light leading-relaxed mb-6 text-base sm:text-lg">
                    En la sociedad moderna, entender los ciclos económicos es crucial. Analizamos las tendencias actuales del mercado y te ofrecemos estrategias prácticas para diversificar tu cartera antes del próximo cierre fiscal.
                  </p>

                  {/* Author Meta */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="Author" className="w-10 h-10 rounded-full border border-white/10" />
                      <div>
                        <p className="text-sm font-medium text-white">Carlos Mendoza</p>
                        <p className="text-xs text-neutral-500">20 Oct, 2023 · 5 min lectura</p>
                      </div>
                    </div>
                    <button className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: List Items (Approx 35-40% width) */}
            <div className="lg:col-span-5 flex flex-col space-y-8">

              {/* Item 1 */}
              <article className="group flex flex-col gap-4 p-5 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-0.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-[10px] font-medium tracking-wide uppercase">
                    Criptoactivos
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white tracking-tight group-hover:text-purple-400 transition-colors">
                    Bitcoin vs Ethereum: Análisis de volatilidad
                  </h3>
                  <p className="text-sm text-neutral-400 font-light leading-relaxed line-clamp-2">
                    Comparativa técnica sobre el comportamiento de las dos principales criptomonedas durante el último trimestre y proyecciones.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop" alt="Author" className="w-6 h-6 rounded-full border border-white/10" />
                    <span className="text-xs font-medium text-neutral-300">Elena Rojas</span>
                    <span className="text-[10px] text-neutral-600">|</span>
                    <span className="text-[10px] text-neutral-500">Hace 2 horas</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors cursor-pointer">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  </svg>
                </div>
              </article>

              <div className="w-full h-px bg-white/5"></div>

              {/* Item 2 */}
              <article className="group flex flex-col gap-4 p-5 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-medium tracking-wide uppercase">
                    Ahorro
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    La regla 50/30/20 explicada para principiantes
                  </h3>
                  <p className="text-sm text-neutral-400 font-light leading-relaxed line-clamp-2">
                    Descubre cómo dividir tus ingresos netos entre necesidades, deseos y ahorros para lograr la libertad financiera más rápido.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&auto=format&fit=crop" alt="Author" className="w-6 h-6 rounded-full border border-white/10" />
                    <span className="text-xs font-medium text-neutral-300">David Chen</span>
                    <span className="text-[10px] text-neutral-600">|</span>
                    <span className="text-[10px] text-neutral-500">3 min lectura</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors cursor-pointer">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  </svg>
                </div>
              </article>

              <div className="w-full h-px bg-white/5"></div>

              {/* Item 3 */}
              <article className="group flex flex-col gap-4 p-5 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-0.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-[10px] font-medium tracking-wide uppercase">
                    Impuestos
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white tracking-tight group-hover:text-orange-400 transition-colors">
                    Guía fiscal 2024: Cambios en la declaración
                  </h3>
                  <p className="text-sm text-neutral-400 font-light leading-relaxed line-clamp-2">
                    Todo lo que necesitas saber sobre las nuevas deducciones aplicables este año fiscal para trabajadores independientes.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Author" className="w-6 h-6 rounded-full border border-white/10" />
                    <span className="text-xs font-medium text-neutral-300">Sara Williams</span>
                    <span className="text-[10px] text-neutral-600">|</span>
                    <span className="text-[10px] text-neutral-500">8 min lectura</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors cursor-pointer">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  </svg>
                </div>
              </article>

            </div>

          </div>

        </main>

        {/* Simple Footer for Balance */}
        <footer className="w-full py-8 border-t border-white/5 mt-auto relative z-10 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs text-neutral-600">© 2024 Ecofinz Inc. Todos los derechos reservados.</p>
          </div>
        </footer>

        {/* Animations */}
        <style jsx>{`
          @keyframes float {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }

          @keyframes pulse-glow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.05); }
          }

          .animate-blob {
            animation: float 10s infinite ease-in-out;
          }
          
          .animate-glow {
            animation: pulse-glow 4s infinite ease-in-out;
          }

          .delay-2000 { animation-delay: 2s; }
          .delay-4000 { animation-delay: 4s; }
          
          /* Custom Scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #0a0a0a; 
          }
          ::-webkit-scrollbar-thumb {
            background: #333; 
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #444; 
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
