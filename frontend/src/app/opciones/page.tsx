"use client"

import React, { useState } from 'react'
import {
    BarChart2,
    Search,
    Info,
    TrendingUp,
    Activity
} from 'lucide-react'

const sampleOptions = [
    { id: 1, under: 'AAPL', type: 'CALL', strike: 195, exp: '2026-03-20', price: 12.45, delta: 0.65, iv: '24%' },
    { id: 2, under: 'TSLA', type: 'PUT', strike: 210, exp: '2026-02-15', price: 8.30, delta: -0.42, iv: '48%' },
    { id: 3, under: 'NVDA', type: 'CALL', strike: 600, exp: '2026-06-19', price: 45.10, delta: 0.78, iv: '35%' },
    { id: 4, under: 'MSFT', type: 'CALL', strike: 420, exp: '2026-04-17', price: 15.20, delta: 0.55, iv: '18%' },
]

export default function OpcionesPage() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        Opciones Financieras
                    </h1>
                    <p className="text-slate-400">
                        Monitor de contratos, volatilidad implícita y griegas en tiempo real.
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar ticker..."
                        className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 text-sm w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3 text-blue-400 mb-2">
                        <Activity size={20} />
                        <h3 className="font-bold">Volatilidad Media</h3>
                    </div>
                    <p className="text-3xl font-mono text-white">28.4%</p>
                    <p className="text-xs text-slate-500 mt-1">S&P 500 Implied Vol</p>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3 text-emerald-400 mb-2">
                        <TrendingUp size={20} />
                        <h3 className="font-bold">Put/Call Ratio</h3>
                    </div>
                    <p className="text-3xl font-mono text-white">0.74</p>
                    <p className="text-xs text-slate-500 mt-1">Sentimiento Alcista</p>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3 text-amber-400 mb-2">
                        <Info size={20} />
                        <h3 className="font-bold">Contratos Activos</h3>
                    </div>
                    <p className="text-3xl font-mono text-white">1,248</p>
                    <p className="text-xs text-slate-500 mt-1">Bajo Seguimiento</p>
                </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subyacente</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Strike</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vencimiento</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">IV</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {sampleOptions.map((opt) => (
                            <tr key={opt.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">{opt.under}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${opt.type === 'CALL' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {opt.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-300 font-mono">${opt.strike}</td>
                                <td className="px-6 py-4 text-slate-400 text-sm">{opt.exp}</td>
                                <td className="px-6 py-4 font-mono text-blue-400">${opt.price}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-300">{opt.iv}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
