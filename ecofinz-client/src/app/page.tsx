'use client';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen w-full flex flex-col antialiased selection:bg-white/20 relative overflow-x-hidden text-neutral-300 bg-[#030303]">

      {/* Background Atmospheric Effects (Subtle Fog) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] left-[20%] w-[60vw] h-[60vw] rounded-full blur-[150px] animate-blob bg-white/[0.03]"></div>
        <div className="absolute top-[20%] right-0 w-[40vw] h-[40vw] rounded-full blur-[120px] animate-blob delay-2000 bg-blue-900/[0.05]"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full blur-[120px] animate-blob delay-4000 bg-neutral-800/[0.05]"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-50 w-full border-b bg-[#030303]/70 backdrop-blur-xl sticky top-0 border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-2 rounded-lg border group-hover:bg-white/5 transition-colors bg-white/[0.02] border-white/10 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                </svg>
              </div>
              <span className="text-lg font-medium tracking-tight text-white">Ecofinz</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium transition-colors text-white">Producto</a>
              <a href="#" className="text-sm font-normal transition-colors text-neutral-500 hover:text-white">Cómo funciona</a>
              <a href="#" className="text-sm font-normal transition-colors text-neutral-500 hover:text-white">Precios</a>
              <a href="#" className="text-sm font-normal transition-colors text-neutral-500 hover:text-white">Soporte</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-xs font-medium mr-2 tracking-wide text-neutral-500">1-800-ECO-FINZ</span>
              <Link href="/login">
                <button className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium transition-all text-white hover:bg-white/10 hover:border-white/20">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-5 py-2 rounded-full bg-white text-sm font-semibold transition-all flex items-center gap-2 text-black hover:bg-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                  Comenzar
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full z-10 relative">

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col gap-8">
              {/* Trust Badge (Minimalist) */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-center gap-2">
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-white"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300">Institucional</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05] text-white">
                Visualiza tu dinero <br />
                con <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-600">claridad absoluta</span>.
              </h1>

              <p className="leading-relaxed text-lg font-light text-neutral-400 max-w-xl">Herramientas de Finanzas personales con diseño de precisión. Sin ruido visual, solo los datos esenciales que impulsan tu crecimiento financiero.</p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button className="px-8 py-3.5 rounded-full bg-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] text-black hover:bg-neutral-100">
                  Explorar Funciones
                </button>
                <button className="px-8 py-3.5 rounded-full border text-sm font-medium transition-all flex items-center gap-2 group border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] backdrop-blur-sm">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors bg-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 fill-current ml-0.5">
                      <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path>
                    </svg>
                  </div>
                  Ver Demo
                </button>
              </div>

              {/* Minimalist Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t mt-4 border-white/5">
                <div>
                  <p className="text-2xl font-medium text-white tracking-tight">4.9<span className="text-neutral-500">/5</span></p>
                  <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Valoración</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-white tracking-tight">10k<span className="text-neutral-500">+</span></p>
                  <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Inversores</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-white tracking-tight">24<span className="text-neutral-500">/7</span></p>
                  <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Soporte</p>
                </div>
              </div>
            </div>

            {/* Right Visual (Abstract Geometric Glass) */}
            <div className="relative h-[500px] flex items-center justify-center">
              {/* Floating Glass Card 1 */}
              <div className="z-20 animate-blob bg-neutral-900/60 w-64 border-white/10 border rounded-xl pt-5 pr-5 pb-5 pl-5 absolute top-20 left-0 shadow-2xl backdrop-blur-xl">
                <div className="flex gap-4 mb-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Encriptación y Seguridad</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wide">AES-256 Bit</p>
                  </div>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[90%] rounded-full shadow-[0_0_10px_white]"></div>
                </div>
              </div>

              {/* Floating Glass Card 2 */}
              <div className="absolute z-30 bottom-24 -right-4 p-5 rounded-xl bg-neutral-900/60 border backdrop-blur-xl shadow-2xl animate-blob delay-2000 border-white/10 w-64">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wide mb-1">Retorno Anual</p>
                    <p className="text-2xl font-medium text-white">+18.5%</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white mb-1">
                    <path d="M16 7h6v6"></path>
                    <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                  </svg>
                </div>
                <div className="flex gap-1 h-8 items-end">
                  <div className="w-full bg-white/10 rounded-sm h-[40%]"></div>
                  <div className="w-full bg-white/10 rounded-sm h-[60%]"></div>
                  <div className="w-full bg-white/10 rounded-sm h-[30%]"></div>
                  <div className="w-full bg-white/10 rounded-sm h-[80%]"></div>
                  <div className="w-full bg-white rounded-sm h-[100%] shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                </div>
              </div>

              {/* Central Core (Monochrome Radar) */}
              <div className="flex z-0 absolute top-0 right-0 bottom-0 left-0 items-center justify-center">
                <div className="w-[250px] h-[250px] rounded-full border animate-radar border-white/[0.05]"></div>
                <div className="w-[250px] h-[250px] rounded-full border animate-radar delay-1000 border-white/[0.05]"></div>
                
                {/* Center Core */}
                <div className="relative w-48 h-48 rounded-full bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 backdrop-blur-md flex items-center justify-center z-10">
                  <div className="w-28 h-28 rounded-full bg-[#030303] border border-white/20 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.05)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-white">
                      <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"></path>
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    </svg>
                  </div>
                  {/* Orbiting Dot */}
                  <div className="animate-spin duration-[15s] linear opacity-50 w-full h-full absolute">
                    <div className="w-2 h-2 rounded-full bg-white absolute -top-1 left-1/2 -translate-x-1/2 shadow-[0_0_15px_white]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-20">
            <div className="h-20 w-[1px] bg-gradient-to-b to-transparent from-white/10"></div>
          </div>
        </section>

        {/* FEATURES BENTO GRID (Glass & Dark) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Tecnología</span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-medium tracking-tight text-white">
              Finanzas, <span className="text-neutral-500">reinventadas.</span>
            </h2>
            <p className="mt-6 text-lg max-w-2xl font-light text-neutral-400">
              Combinamos décadas de experiencia financiera con una interfaz minimalista para eliminar la fricción entre tú y tu patrimonio.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
            
            {/* Large Vertical Card (Left) */}
            <div className="lg:col-span-1 lg:row-span-2 group relative p-8 rounded-3xl bg-[#080808] border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/20">
              <div className="absolute top-0 right-0 p-40 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white">
                    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                    <path d="M9 13a4.5 4.5 0 0 0 3-4"></path>
                    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                    <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                    <path d="M12 13h4"></path>
                    <path d="M12 18h6a2 2 0 0 1 2 2v1"></path>
                    <path d="M12 8h8"></path>
                    <path d="M16 8V5a2 2 0 0 1 2-2"></path>
                    <circle cx="16" cy="13" r=".5"></circle>
                    <circle cx="18" cy="3" r=".5"></circle>
                    <circle cx="20" cy="21" r=".5"></circle>
                    <circle cx="20" cy="8" r=".5"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3 text-white">Inteligencia Artificial</h3>
                  <p className="text-sm font-light leading-relaxed text-neutral-400">
                    Algoritmos predictivos analizan tus patrones de gasto e inversión en tiempo real, ofreciendo sugerencias proactivas.
                  </p>
                </div>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="group relative p-8 rounded-3xl bg-[#080808] border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/20">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Seguridad Bancaria</h3>
              <p className="text-xs font-light text-neutral-400">
                Infraestructura protegida y encriptada de extremo a extremo.
              </p>
            </div>

            {/* Small Card 2 */}
            <div className="group relative p-8 rounded-3xl bg-[#080808] border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/20">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Tiempo Real</h3>
              <p className="text-xs font-light text-neutral-400">
                Sincronización instantánea con más de 3,000 instituciones globales.
              </p>
            </div>

            {/* Wide Card (Bottom Right) */}
            <div className="lg:col-span-2 group relative p-8 rounded-3xl bg-[#080808] border border-white/5 overflow-hidden transition-all duration-500 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-white/20">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white">
                  <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">Soporte Concierge</h3>
                <p className="text-sm font-light leading-relaxed max-w-md text-neutral-400">
                  Acceso directo a especialistas financieros humanos. Sin bots, sin esperas, solo soluciones profesionales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION (Monochrome & Professional) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Suscripción</span>
              <h2 className="mt-4 text-4xl font-medium tracking-tight text-white">
                Planes transparentes. 
                <span className="text-neutral-500">Sin comisiones ocultas.</span>
              </h2>
            </div>
            <div className="flex items-end pb-2">
              <p className="font-light text-sm max-w-sm text-neutral-400">
                Elige la potencia que necesitas. Cambia o cancela en cualquier momento.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-[#080808] border border-white/5 flex flex-col transition-colors hover:border-white/10">
              <div className="w-fit px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-wider mb-6 text-neutral-400">
                Personal
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-medium text-white">$0</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  Conexión bancaria básica
                </li>
                <li className="flex items-center gap-3 text-sm text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  Reportes mensuales
                </li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-white/10 bg-white/[0.02] text-sm font-medium transition-all text-white hover:bg-white/5">
                Empezar Gratis
              </button>
            </div>

            {/* Card 2 (Highlighted) */}
            <div className="relative p-8 rounded-2xl bg-[#080808] border border-white/20 flex flex-col shadow-[0_0_40px_rgba(255,255,255,0.03)] md:-translate-y-4">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"></div>
              </div>
              <div className="w-fit px-3 py-1 rounded-full bg-white text-black text-[10px] uppercase font-bold tracking-wider mb-6">
                Profesional
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-medium text-white">$12</span>
                <span className="text-sm text-neutral-500">/mes</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  Todo en Personal
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  Sincronización Ilimitada
                </li>
              </ul>

              <button className="w-full py-3 rounded-lg bg-white text-sm font-semibold transition-all text-black hover:bg-neutral-200">
                Seleccionar Pro
              </button>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-[#080808] border border-white/5 flex flex-col transition-colors hover:border-white/10">
              <div className="w-fit px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-wider mb-6 text-neutral-400">
                Empresa
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-medium text-white">$29</span>
                <span className="text-sm text-neutral-500">/mes</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  Todo en Profesional
                </li>
                <li className="flex items-center gap-3 text-sm text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  API Access
                </li>
              </ul>

              <button className="w-full py-3 rounded-lg border border-white/10 bg-white/[0.02] text-sm font-medium transition-all text-white hover:bg-white/5">
                Contactar Ventas
              </button>
            </div>
          </div>
        </section>

        {/* STEPS (Minimalist Lines) */}
        <section className="sm:px-6 lg:px-8 max-w-7xl mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Step 1 */}
            <div className="relative group text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <span className="font-medium text-white">1</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-white">Conecta</h3>
              <p className="text-sm font-light leading-relaxed text-neutral-500 max-w-xs mx-auto">
                Vincula tus cuentas bancarias de forma segura en segundos.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative group text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0a0a0a] border border-white/30 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <span className="font-medium text-white">2</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-white">Analiza</h3>
              <p className="text-sm font-light leading-relaxed text-neutral-500 max-w-xs mx-auto">
                Nuestro motor procesa tus datos y detecta oportunidades.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative group text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center mb-6 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <span className="font-bold text-black">3</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-white">Crece</h3>
              <p className="text-sm font-light leading-relaxed text-neutral-500 max-w-xs mx-auto">
                Recibe tu plan personalizado y comienza a optimizar.
              </p>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS (Monochrome) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="flex justify-center gap-1 mb-8 opacity-50">
            {[...Array(6)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white fill-white">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
              </svg>
            ))}
          </div>

          <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-10 text-white tracking-tight">
            "La interfaz más limpia que he usado en fintech. Sin distracciones, sin colores innecesarios. Simplemente funciona y me da los datos que necesito para mi cartera."
          </blockquote>

          <div className="flex flex-col items-center gap-1">
            <div className="text-sm font-medium text-white">Carlos R.</div>
            <div className="text-xs text-neutral-500 uppercase tracking-widest">Director Financiero</div>
          </div>
        </section>

        {/* CTA FOOTER BANNER (Black & White) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="rounded-3xl bg-neutral-900 border border-white/10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Subtle Glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px]"></div>

            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-medium mb-4 text-white">Control total. Diseño exquisito.</h2>
              <p className="font-light text-neutral-400">Únete a la plataforma financiera diseñada para quienes valoran la claridad.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <button className="px-8 py-3.5 rounded-full bg-white text-sm font-semibold transition-all whitespace-nowrap text-black hover:bg-neutral-200">
                Abrir Cuenta Gratis
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t bg-[#030303] pt-16 pb-8 border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                </svg>
                <span className="text-lg font-medium tracking-tight text-white">Ecofinz</span>
              </div>
              <p className="text-sm text-neutral-500 max-w-xs mb-6">
                Tecnología financiera de precisión.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-neutral-500 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
                <a href="#" className="text-neutral-500 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg></a>
                <a href="#" className="text-neutral-500 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-6 text-white text-sm">Producto</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><a href="#" className="transition-colors hover:text-white">Características</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Seguridad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-6 text-white text-sm">Empresa</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><a href="#" className="transition-colors hover:text-white">Nosotros</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Carreras</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-6 text-white text-sm">Contacto</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li>hello@ecofinz.com</li>
                <li>Madrid, ES</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-white/5">
            <p className="text-[10px] text-neutral-600 uppercase tracking-wider">© 2024 Ecofinz Inc.</p>
            <div className="flex gap-6 text-[10px] uppercase tracking-wider text-neutral-600">
              <a href="#" className="transition-colors hover:text-white">Privacidad</a>
              <a href="#" className="transition-colors hover:text-white">Términos</a>
            </div>
          </div>
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

        @keyframes radar {
          0% { transform: scale(0.8); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: scale(2); opacity: 0; }
        }

        .animate-blob {
          animation: float 12s infinite ease-in-out;
        }
        
        .animate-radar {
          animation: radar 3s infinite ease-out;
        }
        
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
        .delay-4000 { animation-delay: 4s; }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #030303; 
        }
        ::-webkit-scrollbar-thumb {
          background: #262626; 
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #404040; 
        }
      `}</style>
    </div>
  );
}
