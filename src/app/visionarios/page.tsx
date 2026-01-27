"use client"

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
    TrendingUp,
    TrendingDown,
    Search,
    Filter,
    RefreshCw,
    AlertCircle
} from 'lucide-react'

interface Activo {
    id: string
    simbolo: string
    nombre: string
    precio_actual: number
    cambio_porcentaje: number
    sector: string
    es_visionario: boolean
    crecimiento_yoy_ingresos?: number
    crecimiento_yoy_eps?: number
}

export default function VisionariosPage() {
    const [activos, setActivos] = useState<Activo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchVisionarios = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, error: sbError } = await supabase
                .from('activos')
                .select('*')
                .eq('es_visionario', true)
                .order('cambio_porcentaje', { ascending: false })

            if (sbError) throw sbError
            setActivos(data || [])
        } catch (err: any) {
            setError(err.message || 'Error al conectar con la base de datos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVisionarios()
    }, [])

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        Visionarios
                    </h1>
                    <p className="text-slate-400">
                        Filtro de alta rentabilidad basado en crecimiento YoY de ingresos y EPS.
                    </p>
                </div>
                <button
                    onClick={fetchVisionarios}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    <span>Actualizar</span>
                </button>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {activos.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                            <Search className="mx-auto text-slate-700 mb-4" size={48} />
                            <p className="text-slate-500">No se encontraron activos visionarios en este momento.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activos.map((activo) => (
                                <div
                                    key={activo.id}
                                    className="group bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300 rounded-2xl border border-slate-800 hover:border-blue-500/30 p-6 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                                    {activo.simbolo}
                                                </span>
                                                <p className="text-sm text-slate-500 truncate">{activo.nombre}</p>
                                            </div>
                                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${activo.cambio_porcentaje >= 0
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                {activo.cambio_porcentaje >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                {Math.abs(activo.cambio_porcentaje).toFixed(2)}%
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Crec. Ingresos</p>
                                                <p className="text-lg font-semibold text-emerald-400">+{activo.crecimiento_yoy_ingresos ?? 0}%</p>
                                            </div>
                                            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Crec. EPS</p>
                                                <p className="text-lg font-semibold text-emerald-400">+{activo.crecimiento_yoy_eps ?? 0}%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-slate-800/50 flex justify-between items-center text-sm">
                                        <span className="text-slate-400">{activo.sector}</span>
                                        <span className="font-mono text-white">${activo.precio_actual.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
