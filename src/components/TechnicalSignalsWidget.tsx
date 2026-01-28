"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    ChevronRight,
    Zap,
    AlertCircle,
    Clock,
    CheckCircle2
} from 'lucide-react';

interface Signal {
    id: string;
    ticker: string;
    signal_date: string;
    pattern_detected: string;
    confidence_level: string;
    analysis_summary: string;
}

export const TechnicalSignalsWidget = () => {
    const [signals, setSignals] = useState<Signal[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchSignals = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('technical_signals')
                    .select('*')
                    .order('signal_date', { ascending: false })
                    .limit(5);

                if (error) throw error;
                setSignals(data || []);
            } catch (err) {
                console.error('Error fetching signals:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSignals();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 w-full bg-card/50 animate-pulse rounded-2xl border border-white/5" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Zap className="text-accent" size={20} />
                    Oportunidades de Mercado
                </h2>
                <span className="text-xs text-muted">Últimas 5 señales</span>
            </div>

            <AnimatePresence>
                {signals.length === 0 ? (
                    <div className="glass p-8 text-center rounded-2xl border-dashed">
                        <p className="text-muted italic">Buscando nuevas señales en el mercado...</p>
                    </div>
                ) : (
                    signals.map((signal) => (
                        <motion.div
                            key={signal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setExpandedId(expandedId === signal.id ? null : signal.id)}
                            className={cn(
                                "glass glass-hover p-4 cursor-pointer relative overflow-hidden group",
                                expandedId === signal.id && "bg-opacity-90 border-accent/30"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-accent/10 p-3 rounded-xl border border-accent/20">
                                        <TrendingUp className="text-accent" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold tracking-wider">{signal.ticker}</h3>
                                        <p className="text-xs text-muted flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(signal.signal_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                        signal.confidence_level === 'Alta'
                                            ? "bg-success/10 text-success border-success/20"
                                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                    )}>
                                        {signal.confidence_level}
                                    </div>
                                    <ChevronRight
                                        className={cn("text-muted transition-transform", expandedId === signal.id && "rotate-90")}
                                        size={20}
                                    />
                                </div>
                            </div>

                            {expandedId === signal.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="mt-4 pt-4 border-t border-white/5"
                                >
                                    <p className="text-sm text-gray-300 leading-relaxed italic">
                                        "{signal.analysis_summary}"
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded flex items-center gap-1 text-muted">
                                            <CheckCircle2 size={10} /> Pattern: {signal.pattern_detected}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};
