"use client"

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) throw authError

            router.push('/')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
                <div className="text-center">
                    <div className="inline-flex p-3 rounded-xl bg-blue-600/20 text-blue-400 mb-4 border border-blue-500/20">
                        <LogIn size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Bienvenido</h2>
                    <p className="mt-2 text-slate-400">Ingresa a tu cuenta para continuar</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="flex justify-between items-center mb-1 ml-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contraseña</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
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
                                <LogIn size={20} />
                                <span>Iniciar Sesión</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-slate-400">
                        ¿No tienes una cuenta?{' '}
                        <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
