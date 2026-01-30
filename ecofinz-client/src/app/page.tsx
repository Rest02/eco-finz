import Link from "next/link";
import { ArrowRight, Zap, BarChart3, Wallet, Activity, Shield, Lock, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-zinc-900 font-sans selection:bg-black selection:text-white">

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
      <main className="pt-40 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="max-w-xl space-y-8 animate-fade-in z-10">
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

          {/* Right Visual (Web Dashboard Showcase) */}
          <div className="relative flex items-center justify-center animate-slide-up">
            {/* Abstract Background Shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-50 rounded-full blur-3xl opacity-60 z-0"></div>

            {/* Laptop Image with Floating Animation */}
            <div className="relative z-10">
              <img
                src="/hero-visual.jpg"
                alt="EcoFinz Dashboard Interface"
                className="w-full max-w-[600px] object-contain mix-blend-multiply border border-zinc-200 rounded-2xl"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Trust Strip */}
      <section className="py-10 border-y border-zinc-50 bg-zinc-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">Seguridad Garantizada por Estándares Globales</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
            {/* Security Badges (Simulated with Icons/Text for now) */}
            <div className="flex items-center gap-2"><Shield className="w-5 h-5" /> <span className="font-bold">AES-256</span></div>
            <div className="flex items-center gap-2"><Lock className="w-5 h-5" /> <span className="font-bold">SOC2 Compliant</span></div>
            <div className="flex items-center gap-2"><Globe className="w-5 h-5" /> <span className="font-bold">ISO 27001</span></div>
            <div className="flex items-center gap-2"><Zap className="w-5 h-5" /> <span className="font-bold">Bank Grade</span></div>
          </div>
        </div>
      </section>

      {/* Feature Section (PFM Focus) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Todo lo que necesitas para crecer</h2>
            <p className="text-zinc-500 text-lg">Ecofinz te da las herramientas profesionales para gestionar tu economía doméstica o empresarial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-[32px] border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-black stroke-1" />
              </div>
              <h3 className="text-xl font-bold mb-3">Control de Movimientos</h3>
              <p className="text-zinc-500 leading-relaxed">
                Registro detallado de ingresos y gastos. Categorización automática para saber exactamente a dónde va tu dinero.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-[32px] border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Wallet className="w-7 h-7 text-black stroke-1" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cuentas Unificadas</h3>
              <p className="text-zinc-500 leading-relaxed">
                Gestiona múltiples cuentas bancarias, billeteras digitales y efectivo desde un solo panel centralizado.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-[32px] border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
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

      {/* Editorial Testimonial */}
      <section className="py-24 px-6 bg-zinc-900 text-white rounded-[40px] mx-4 lg:mx-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif italic leading-tight mb-8 text-zinc-100">
            "EcoFinz cambió radicalmente cómo entiendo mi flujo de caja. Es la herramienta que faltaba en mi arsenal financiero."
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full mb-4 border-2 border-zinc-700"></div>
            <p className="font-bold text-lg">Matias G.</p>
            <p className="text-zinc-500 text-sm">CEO, TechStart</p>
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
