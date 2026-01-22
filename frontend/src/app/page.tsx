import Link from 'next/link'
import {
  TrendingUp,
  BarChart2,
  Eye,
  Zap,
  Target,
  PieChart,
  ChevronRight
} from 'lucide-react'

const features = [
  { name: 'Visionarios', desc: 'Crecimiento explosivo YoY.', href: '/visionarios', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Eye },
  { name: 'Big Caps', desc: 'Líderes de mercado estables.', href: '/big-caps', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: TrendingUp },
  { name: 'Small Caps', desc: 'Alto potencial de retorno.', href: '/small-caps', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Target },
  { name: 'Opciones', desc: 'Trading de volatilidad.', href: '/opciones', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: BarChart2 },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 py-10 lg:py-16">
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse">
          <Zap size={14} fill="currentColor" />
          Terminal de Grado Institucional
        </div>
        <h1 className="text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl">
          <span className="bg-gradient-to-r from-blue-100 via-blue-400 to-emerald-500 bg-clip-text text-transparent">
            Domina el Mercado
          </span>
        </h1>
        <p className="text-xl text-slate-400 text-balance">
          Análisis avanzado de activos financieros para inversionistas modernos.
          De Big Caps estables a contratos de opciones volátiles.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/visionarios" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-900/30">
            Comenzar Análisis
          </Link>
          <Link href="/settings" className="px-8 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all">
            Configurar Robot
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <Link
            key={f.name}
            href={f.href}
            className="group p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1"
          >
            <div className={`p-3 rounded-2xl ${f.bg} ${f.color} w-fit mb-6 transition-transform group-hover:scale-110`}>
              <f.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{f.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{f.desc}</p>
            <div className={`flex items-center gap-1 text-sm font-bold ${f.color}`}>
              Explorar <ChevronRight size={16} />
            </div>
          </Link>
        ))}
      </div>

      <div className="p-1 gap-1 rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-slate-950/80 p-8 lg:p-12 rounded-[2.4rem] backdrop-blur-xl flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-3xl bg-emerald-500/10 text-emerald-400">
            <PieChart size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white">Próximo Hito: Trading Automático</h2>
          <p className="max-w-2xl text-slate-400">
            La infraestructura está lista. Muy pronto podrás conectar tu broker para ejecutar las señales de los Visionarios directamente desde este Dashboard.
          </p>
          <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            SISTEMA DE EJECUCIÓN V.1.0 READY
          </div>
        </div>
      </div>
    </div>
  )
}
