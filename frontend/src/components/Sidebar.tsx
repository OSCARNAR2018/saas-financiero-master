"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    TrendingUp,
    BarChart2,
    Eye,
    Menu,
    X,
    PieChart,
    Target,
    Settings
} from 'lucide-react'

const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Big Caps', href: '/big-caps', icon: TrendingUp },
    { name: 'Mid Caps', href: '/mid-caps', icon: PieChart },
    { name: 'Small Caps', href: '/small-caps', icon: Target },
    { name: 'Opciones', href: '/opciones', icon: BarChart2 },
    { name: 'Visionarios', href: '/visionarios', icon: Eye },
    { name: 'Configuración', href: '/settings', icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <>
            <button
                className="fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-100 transform transition-transform duration-200 ease-in-out border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            SAAS Financiero
                        </h1>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
                                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                                            : 'hover:bg-slate-900 text-slate-400 hover:text-slate-100'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Estado del Sistema</p>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs text-slate-300">Conectado a Supabase</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
