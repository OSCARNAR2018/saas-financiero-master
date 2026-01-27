"use client"

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
    Settings,
    Shield,
    Cpu,
    Hand,
    Zap,
    Target,
    Bell,
    Save,
    RefreshCw,
    CheckCircle,
    AlertCircle
} from 'lucide-react'

export default function SettingsPage() {
    const [autoMode, setAutoMode] = useState(false)
    const [riskProfile, setRiskProfile] = useState('conservador')
    const [notifications, setNotifications] = useState(true)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('configuracion')
                    .select('*')
                    .limit(1)
                    .single()

                if (error) {
                    if (error.code === 'PGRST116') {
                        // No rows found, we can stay with defaults
                        console.log("No se encontró configuración previa, usando valores por defecto.")
                    } else {
                        throw error
                    }
                }

                if (data) {
                    setAutoMode(data.modo_automatico)
                    setRiskProfile(data.perfil_riesgo)
                    setNotifications(data.alertas_activas)
                }
            } catch (err: any) {
                console.error("Error al cargar configuración:", err.message)
                setStatus({ type: 'error', msg: "No se pudo cargar la configuración. ¿Has creado la tabla en Supabase?" })
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setStatus(null)
        try {
            // Check if record exists to update or insert
            const { data: existing } = await supabase.from('configuracion').select('id').limit(1)

            let result;
            if (existing && existing.length > 0) {
                result = await supabase
                    .from('configuracion')
                    .update({
                        modo_automatico: autoMode,
                        perfil_riesgo: riskProfile,
                        alertas_activas: notifications,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing[0].id)
            } else {
                result = await supabase
                    .from('configuracion')
                    .insert({
                        modo_automatico: autoMode,
                        perfil_riesgo: riskProfile,
                        alertas_activas: notifications
                    })
            }

            if (result.error) throw result.error

            setStatus({ type: 'success', msg: "Configuración guardada correctamente." })
            setTimeout(() => setStatus(null), 3000)
        } catch (err: any) {
            console.error("Error al guardar:", err.message)
            setStatus({ type: 'error', msg: `Error al guardar: ${err.message}` })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <RefreshCw size={48} className="text-blue-500 animate-spin" />
                <p className="text-slate-400 font-mono">Sincronizando con Supabase...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <header>
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                        <Settings size={32} className="text-blue-400" />
                        Configuración del Sistema
                    </h1>
                    {status && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                            {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {status.msg}
                        </div>
                    )}
                </div>
                <p className="text-slate-400">
                    Personaliza el comportamiento del bot y la gestión de riesgos.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {/* Modo de Operación */}
                <section className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${autoMode ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                                {autoMode ? <Cpu size={24} /> : <Hand size={24} />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Modo de Operación</h3>
                                <p className="text-sm text-slate-400">Define si el sistema ejecuta órdenes automáticamente.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setAutoMode(!autoMode)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${autoMode ? 'bg-blue-600' : 'bg-slate-700'}`}
                        >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${autoMode ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                        <div className={`p-4 rounded-2xl border transition-all ${!autoMode ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-950/30 border-slate-800'}`}>
                            <h4 className="font-bold text-white mb-1">Modo Manual</h4>
                            <p className="text-xs text-slate-500 text-balance">El sistema genera señales y alertas, pero tú decides cuándo entrar o salir.</p>
                        </div>
                        <div className={`p-4 rounded-2xl border transition-all ${autoMode ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-950/30 border-slate-800'}`}>
                            <h4 className="font-bold text-white mb-1">Modo Automático</h4>
                            <p className="text-xs text-slate-500 text-balance text-blue-400/80">IA Ejecución: El bot opera según los criterios de riesgo seleccionados.</p>
                        </div>
                    </div>
                </section>

                {/* Perfil de Riesgo */}
                <section className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Perfil de Riesgo</h3>
                            <p className="text-sm text-slate-400">Ajusta la agresividad de las entradas y el tamaño de posición.</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <button
                            onClick={() => setRiskProfile('conservador')}
                            className={`flex-1 p-6 rounded-2xl border transition-all text-left ${riskProfile === 'conservador' ? 'bg-emerald-600/10 border-emerald-500/30 ring-1 ring-emerald-500/20' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-white">Conservador</span>
                                {riskProfile === 'conservador' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                            </div>
                            <p className="text-xs text-slate-500">Stop Loss corto (3-5%), posiciones pequeñas (1-2% capital), alta probabilidad.</p>
                        </button>

                        <button
                            onClick={() => setRiskProfile('agresivo')}
                            className={`flex-1 p-6 rounded-2xl border transition-all text-left ${riskProfile === 'agresivo' ? 'bg-amber-600/10 border-amber-500/30 ring-1 ring-amber-500/20' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-white">Agresivo</span>
                                {riskProfile === 'agresivo' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                            </div>
                            <p className="text-xs text-slate-500">Stop Loss dinámico, posiciones mayores (5-8% capital), captura de tendencias volátiles.</p>
                        </button>
                    </div>
                </section>

                {/* Notificaciones y Otros */}
                <section className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Alertas Push / Telegram</h3>
                                <p className="text-sm text-slate-400">Recibe avisos críticos de ejecución.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${notifications ? 'bg-blue-600' : 'bg-slate-700'}`}
                        >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                        {saving ? "Guardando..." : "Guardar Configuración"}
                    </button>
                </div>
            </div>
        </div>
    )
}
