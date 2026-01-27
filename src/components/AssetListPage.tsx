"use client"

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
    TrendingUp,
    TrendingDown,
    RefreshCw,
    AlertCircle,
    Table as TableIcon
} from 'lucide-react'

interface Activo {
    id: string
    simbolo: string
    nombre: string
    precio_actual: number
    cambio_porcentaje: number
    sector: string
    categoria?: string
}

export default function AssetListPage({ title, category }: { title: string, category: string }) {
    const [activos, setActivos] = useState<Activo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAssets = async () => {
        setLoading(true)
        setError(null)
        try {
            // In a real scenario we might filter by category column
            // For now we simulate the view
            const { data, error: sbError } = await supabase
                .from('activos')
                .select('*')
                .order('simbolo', { ascending: true })

            if (sbError) throw sbError
            setActivos(data || [])
        } catch (err: any) {
            setError(err.message || 'Error al conectar con la base de datos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAssets()
    }, [])

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        {title}
                    </h1>
                    <p className="text-slate-400">
                        Listado completo de activos en la categoría {title}.
                    </p>
                </div>
                <button
                    onClick={fetchAssets}
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

            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Símbolo</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cambio</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-full"></div></td>
                                </tr>
                            ))
                        ) : (
                            activos.map((activo) => (
                                <tr key={activo.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-blue-400">{activo.simbolo}</td>
                                    <td className="px-6 py-4 text-slate-300">{activo.nombre}</td>
                                    <td className="px-6 py-4 font-mono text-white">${activo.precio_actual.toFixed(2)}</td>
                                    <td className={`px-6 py-4 font-medium ${activo.cambio_porcentaje >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {activo.cambio_porcentaje >= 0 ? '+' : ''}{activo.cambio_porcentaje.toFixed(2)}%
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-slate-400 hover:text-white transition-colors">Ver Detalles</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
