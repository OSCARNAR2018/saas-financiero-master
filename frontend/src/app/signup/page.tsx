"use client"

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Mail, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (authError) throw authError

            setSuccess(true)
            // Optional: Auto redirect after some time
            setTimeout(() => {
                router.push('/login')
            }, 5000)
        } catch (err: any) {
            setError(err.message || 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <div className="w-full max-w-md p-8 text-center space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
                    <div className="inline-flex p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">¡Registro exitoso!</h2>
                    <p className="text-slate-400">
                        Hemos enviado un correo de confirmación a <span className="text-white font-medium">{email}</span>.
                        Por favor, verifica tu bandeja de entrada.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                    >
                        Ir al Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
                <div className="text-center">
                    <div className="inline-flex p-3 rounded-xl bg-emerald-600/20 text-emerald-400 mb-4 border border-emerald-500/20">
                        <UserPlus size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Crear Cuenta</h2>
                    <p className="mt-2 text-slate-400">Únete a la plataforma de análisis financiero</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                    placeholder="Mínimo 6 caracteres"
                                    minLength={6}
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
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                <UserPlus size={20} />
                                <span>Registrarse</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-slate-400">
                        ¿Ya tienes una cuenta?{' '}
                        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
