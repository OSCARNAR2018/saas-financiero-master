"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Home,
    BarChart2,
    PieChart,
    Settings,
    Menu,
    ChevronLeft,
    Target
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: Home, label: 'Resumen', active: true },
    { icon: BarChart2, label: 'Mercado', active: false },
    { icon: Target, label: 'Visionarios', active: false },
    { icon: PieChart, label: 'Cartera', active: false },
    { icon: Settings, label: 'Configuración', active: false },
];

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <motion.div
            animate={{ width: isCollapsed ? 80 : 260 }}
            className="h-screen sticky top-0 bg-[#0F0F0F] border-r border-white/5 flex flex-col transition-all duration-300 relative z-50 flex-shrink-0"
        >
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-black tracking-tighter text-accent"
                    >
                        V-BOLSA <span className="text-white font-light">PRO</span>
                    </motion.h1>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition-colors"
                >
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <div
                        key={item.label}
                        className={cn(
                            "flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group cursor-pointer",
                            item.active
                                ? "bg-accent/10 text-accent border border-accent/20"
                                : "text-muted hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon size={22} className={cn(item.active ? "text-accent" : "group-hover:text-accent transition-colors")} />
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="font-medium"
                            >
                                {item.label}
                            </motion.span>
                        )}
                    </div>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5">
                <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
                    <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent">
                        ON
                    </div>
                    {!isCollapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate">Oscar Naranjo</p>
                            <p className="text-[10px] text-muted truncate">Plan Premium Architect</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
