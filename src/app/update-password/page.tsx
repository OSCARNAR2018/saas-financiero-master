"use client"

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Lock, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            })

            if (updateError) throw updateError

            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'Error al actualizar la contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
                <div className="text-center">
                    <div className="inline-flex p-3 rounded-xl bg-emerald-600/20 text-emerald-400 mb-4 border border-emerald-500/20">
                        <ShieldCheck size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight italic uppercase">Actualizar Terminal</h2>
                    <p className="mt-2 text-slate-400">Ingresa tu nueva clave de acceso de seguridad</p>
                </div>

                {success ? (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="inline-flex p-2 bg-emerald-500/20 text-emerald-400 rounded-full">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase italic tracking-tighter">¡Acceso Restaurado!</h3>
                        <p className="text-sm text-slate-400">
                            Tu contraseña ha sido actualizada. Serás redirigido al login en unos segundos...
                        </p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1 text-left">Nueva Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1 text-left">Confirmar Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                                        placeholder="••••••••"
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
                            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase italic tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-900/40 active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Actualizar Contraseña</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
