"use client"

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            })

            if (resetError) throw resetError

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Error al procesar la solicitud')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors mb-6"
                    >
                        <ArrowLeft size={14} /> Volver al Login
                    </Link>
                    <div className="inline-flex p-3 rounded-xl bg-blue-600/20 text-blue-400 mb-4 border border-blue-500/20">
                        <Mail size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Recuperar Acceso</h2>
                    <p className="mt-2 text-slate-400">Te enviaremos un enlace para restablecer tu contraseña</p>
                </div>

                {success ? (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="inline-flex p-2 bg-emerald-500/20 text-emerald-400 rounded-full">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase italic tracking-tighter">¡Correo Enviado!</h3>
                        <p className="text-sm text-slate-400">
                            Revisa tu bandeja de entrada. Si no lo encuentras, verifica la carpeta de spam.
                        </p>
                        <Link
                            href="/login"
                            className="block w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                        >
                            Ir al Login
                        </Link>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleResetRequest}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1 text-left">Email registrado</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono text-sm"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Enviar enlace de recuperación</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
