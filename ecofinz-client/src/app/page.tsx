import Link from "next/link";
import { ArrowRight, Zap, BarChart3, Wallet, Activity, ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">

      {/* Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-white/90 backdrop-blur-md border border-zinc-200/80 rounded-full px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="font-bold text-lg tracking-tight">EcoFinz</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors hidden sm:block">
              Iniciar Sesión
            </Link>
            <Link href="/auth/register">
              <button className="text-sm font-semibold bg-black text-white px-5 py-2 rounded-full hover:bg-zinc-800 transition-all hover:scale-105 shadow-md">
                Crear Cuenta
              </button>
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="max-w-xl space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Tu Libertad <br />
              Financiera, <br />
              <span className="text-zinc-400">Visualizada.</span>
            </h1>

            <p className="text-lg text-zinc-500 leading-relaxed max-w-md">
              Toma el control absoluto de tus ingresos, gastos y metas.
              Una plataforma inteligente diseñada para tu tranquilidad.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Link href="/auth/register">
                <button className="px-8 py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200 flex items-center gap-2 group">
                  Empezar Gratis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-8 py-3.5 border border-zinc-200 text-black font-semibold rounded-xl hover:bg-zinc-50 transition-colors">
                  Ver Demo
                </button>
              </Link>
            </div>
          </div>

          {/* Right Visual (Abstract Interface) */}
          <div className="relative bg-zinc-50 rounded-[40px] p-12 min-h-[500px] flex items-center justify-center border border-zinc-100/50 animate-slide-up">
            {/* Abstract Simplified Dashboard */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-zinc-100 p-6 overflow-hidden">

              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="h-2 w-24 bg-zinc-200 rounded-full mb-2"></div>
                  <div className="h-2 w-16 bg-zinc-100 rounded-full"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-50"></div>
              </div>

              {/* Balance */}
              <div className="mb-8">
                <div className="text-sm text-zinc-400 font-medium mb-1">Balance Total</div>
                <div className="text-4xl font-bold tracking-tight text-black">$24,500.00</div>
                <div className="inline-flex items-center gap-1 mt-2 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> +12.5%
                </div>
              </div>

              {/* Graph Area */}
              <div className="flex items-end gap-3 h-32 w-full mt-auto">
                <div className="flex-1 bg-zinc-100 rounded-lg h-[40%]" />
                <div className="flex-1 bg-zinc-100 rounded-lg h-[60%]" />
                <div className="flex-1 bg-black rounded-lg h-[80%]" />
                <div className="flex-1 bg-zinc-100 rounded-lg h-[50%]" />
                <div className="flex-1 bg-zinc-100 rounded-lg h-[70%]" />
              </div>

            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 animate-bounce delay-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Suscripción</div>
                  <div className="text-sm font-bold">-$12.99</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Feature Section (PFM Focus) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Todo lo que necesitas para crecer</h2>
            <p className="text-zinc-500 text-lg">Ecofinz te da las herramientas profesionales para gestionar tu economía doméstica o empresarial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Feature 1: Transactions */}
            <div className="group p-8 rounded-[32px] border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-black stroke-1" />
              </div>
              <h3 className="text-xl font-bold mb-3">Control de Movimientos</h3>
              <p className="text-zinc-500 leading-relaxed">
                Registro detallado de ingresos y gastos. Categorización automática para saber exactamente a dónde va tu dinero.
              </p>
            </div>

            {/* Feature 2: Accounts */}
            <div className="group p-8 rounded-[32px] border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Wallet className="w-7 h-7 text-black stroke-1" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cuentas Unificadas</h3>
              <p className="text-zinc-500 leading-relaxed">
                Gestiona múltiples cuentas bancarias, billeteras digitales y efectivo desde un solo panel centralizado.
              </p>
            </div>

            {/* Feature 3: Status */}
            <div className="group p-8 rounded-[32px] border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-black stroke-1" />
              </div>
              <h3 className="text-xl font-bold mb-3">Salud Financiera</h3>
              <p className="text-zinc-500 leading-relaxed">
                Diagnósticos en tiempo real y reportes visuales para entender tu patrimonio neto y mejorar tu futuro.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-black">EcoFinz</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black">Privacidad</a>
            <a href="#" className="hover:text-black">Términos</a>
            <a href="#" className="hover:text-black">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
