import Link from "next/link";
import { ArrowRight, Zap, BarChart3, Wallet, Activity, Shield, Lock, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-zinc-900 font-sans selection:bg-black selection:text-white">

      {/* Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-white/90 backdrop-blur-md border border-zinc-200/80 rounded-full px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">

          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="EcoFinz Logo" className="w-8 h-8 object-contain" />
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

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16 px-4">
            <div className="flex justify-center lg:justify-start">
              <img
                src="/notion-testimonials-v2.png"
                alt="EcoFinz Community Illustration"
                className="w-full max-w-[500px] object-contain mix-blend-multiply"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Lo que dicen quienes <br /> ya confían en <span className="text-zinc-400">EcoFinz.</span>
              </h2>
              <p className="text-zinc-500 text-lg leading-relaxed max-w-md">
                Únete a miles de personas que están transformando su relación con el dinero a través de una gestión inteligente y visual.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="clean-card p-10 flex flex-col justify-between h-full group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div>
                <div className="flex gap-1 mb-8 text-black">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Zap key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-600 text-lg leading-relaxed italic mb-8">
                  "EcoFinz cambió radicalmente cómo entiendo mi flujo de caja. Es la herramienta que faltaba en mi arsenal financiero."
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-zinc-100 pt-8">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-400 border border-zinc-200">
                  MG
                </div>
                <div>
                  <p className="font-bold text-zinc-900">Matias G.</p>
                  <p className="text-xs text-zinc-500 font-medium">CEO, TechStart</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="clean-card p-10 flex flex-col justify-between h-full group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div>
                <div className="flex gap-1 mb-8 text-black">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Zap key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-600 text-lg leading-relaxed italic mb-8">
                  "La simplicidad del diseño y la rapidez para registrar gastos es lo que más valoro. Por fin tengo un ahorro real."
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-zinc-100 pt-8">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-400 border border-zinc-200">
                  LR
                </div>
                <div>
                  <p className="font-bold text-zinc-900">Lucía R.</p>
                  <p className="text-xs text-zinc-500 font-medium">Product Manager</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="clean-card p-10 flex flex-col justify-between h-full group animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div>
                <div className="flex gap-1 mb-8 text-black">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Zap key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-600 text-lg leading-relaxed italic mb-8">
                  "Visualizar mis metas financieras me motiva a seguir adelante. Una experiencia de usuario impecable y profesional."
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-zinc-100 pt-8">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-400 border border-zinc-200">
                  CM
                </div>
                <div>
                  <p className="font-bold text-zinc-900">Carlos M.</p>
                  <p className="text-xs text-zinc-500 font-medium">Freelance Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Selecciona el plan que <br /> impulse tu <span className="text-zinc-400">crecimiento.</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto mb-10">
              Cada paquete incluye herramientas personalizadas para garantizar que tomes las mejores decisiones financieras.
            </p>

            {/* Billing Toggle (Visual Only) */}
            <div className="flex items-center justify-center gap-1 bg-zinc-100 p-1.5 rounded-full w-fit mx-auto border border-zinc-200">
              <button className="px-6 py-2 bg-black text-white rounded-full text-sm font-semibold shadow-lg">Mensual</button>
              <button className="px-6 py-2 text-zinc-500 hover:text-black rounded-full text-sm font-semibold transition-colors">Anual (20% Off)</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* Starter Plan */}
            <div className="clean-card p-10 flex flex-col h-fit">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Plan Inicial</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Perfecto para quienes comienzan a organizar sus finanzas personales.</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-zinc-400 text-sm">/ al mes</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {['Registro de gastos', 'Categorización automática', 'Reportes básicos', '1 Cuenta conectada', 'Soporte vía email'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white fill-current" />
                    </div>
                    <span className="text-sm text-zinc-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 bg-zinc-100 text-zinc-900 font-bold rounded-2xl hover:bg-zinc-200 transition-colors">
                Elegir Plan
              </button>
            </div>

            {/* Growth Plan (Highlighted) */}
            <div className="bg-zinc-900 rounded-[32px] p-10 flex flex-col h-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative z-10 scale-105 border border-white/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full font-bold">
                Más Popular
              </div>

              <div className="mb-8 font-bold">
                <h3 className="text-xl font-bold text-white mb-2">Plan Crecimiento</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Ideal para quienes buscan llevar su ahorro al siguiente nivel.</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-white">$49</span>
                <span className="text-zinc-500 text-sm">/ al mes</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {['Todo lo del plan Inicial', 'Presupuestos avanzados', 'Análisis predictivo de gastos', 'Cuentas ilimitadas', 'Seguridad reforzada'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                      <Zap className="w-3 h-3 text-black fill-current" />
                    </div>
                    <span className="text-sm text-zinc-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-colors shadow-xl">
                Elegir Plan
              </button>
            </div>

            {/* Business Plan */}
            <div className="clean-card p-10 flex flex-col h-fit">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Plan Business</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Control total para empresas o carteras de inversión complejas.</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-zinc-400 text-sm">/ al mes</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {['Todo lo del plan Crecimiento', 'Gestión de inversiones', 'Integración con APIs', 'Soporte VIP 24/7', 'Reportes de auditoría'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white fill-current" />
                    </div>
                    <span className="text-sm text-zinc-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 bg-zinc-100 text-zinc-900 font-bold rounded-2xl hover:bg-zinc-200 transition-colors">
                Elegir Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="pt-12 pb-24 px-6 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-zinc-200/60 rounded-[40px] p-12 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
              {/* Brand Section */}
              <div className="lg:col-span-4 space-y-8">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="EcoFinz Logo" className="w-10 h-10 object-contain" />
                  <span className="font-bold text-2xl tracking-tight">EcoFinz</span>
                </div>
                <p className="text-zinc-500 leading-relaxed max-w-sm">
                  EcoFinz empodera a personas y equipos para transformar sus datos financieros en decisiones claras y estrategias ganadoras.
                </p>
                <div className="flex gap-5 text-zinc-400">
                  <span className="hover:text-black transition-colors cursor-pointer"><Activity className="w-5 h-5" /></span>
                  <span className="hover:text-black transition-colors cursor-pointer"><Activity className="w-5 h-5" /></span>
                  <span className="hover:text-black transition-colors cursor-pointer"><Activity className="w-5 h-5" /></span>
                  <span className="hover:text-black transition-colors cursor-pointer"><Activity className="w-5 h-5" /></span>
                </div>
              </div>

              {/* Links Sections */}
              <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                <div className="space-y-6">
                  <h4 className="font-bold text-zinc-900">Producto</h4>
                  <ul className="space-y-4 text-sm text-zinc-500">
                    <li className="hover:text-black transition-colors cursor-pointer">Funcionalidades</li>
                    <li className="hover:text-black transition-colors cursor-pointer">Precios</li>
                    <li className="hover:text-black transition-colors cursor-pointer">Integraciones</li>
                    <li className="hover:text-black transition-colors cursor-pointer">Changelog</li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="font-bold text-zinc-900">Recursos</h4>
                  <ul className="space-y-4 text-sm text-zinc-500">
                    <li className="hover:text-black transition-colors cursor-pointer">Documentación</li>
                    <li className="hover:text-black transition-colors cursor-pointer">Tutoriales</li>
                    <li className="hover:text-black transition-colors cursor-pointer">Blog</li>
                    <li className="hover:text-black transition-colors cursor-pointer">Soporte</li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="font-bold text-zinc-900">Compañía</h4>
                  <ul className="space-y-4 text-sm text-zinc-500">
                    <li className="hover:text-black transition-colors cursor-pointer">Sobre nosotros</li>
                    <li className="hover:text-black transition-colors cursor-pointer">Carreras</li>
                    <li className="hover:text-black transition-colors cursor-pointer">Contacto</li>
                    <li className="hover:text-black transition-colors cursor-pointer">Partners</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-zinc-100 flex flex-col md:row justify-between items-center gap-6">
              <p className="text-sm text-zinc-400">
                © 2026 EcoFinz. Todos los derechos reservados.
              </p>
              <div className="flex gap-8 text-sm font-medium text-zinc-500">
                <a href="#" className="hover:text-black transition-colors underline decoration-zinc-200 underline-offset-4">Privacy Policy</a>
                <a href="#" className="hover:text-black transition-colors underline decoration-zinc-200 underline-offset-4">Terms of Service</a>
                <a href="#" className="hover:text-black transition-colors underline decoration-zinc-200 underline-offset-4">Cookies Settings</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
