"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketSummaryProps {
    averageScore: number;
    totalNews: number;
}

export const MarketSummary: React.FC<MarketSummaryProps> = ({ averageScore, totalNews }) => {
    const getSentimentColor = (score: number) => {
        if (score > 1) return 'text-success drop-shadow-[0_0_8px_rgba(0,255,148,0.4)]';
        if (score < -1) return 'text-danger drop-shadow-[0_0_8px_rgba(255,59,59,0.4)]';
        return 'text-muted';
    };

    const Icon = averageScore > 1 ? TrendingUp : averageScore < -1 ? TrendingDown : Minus;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass glass-hover p-6 rounded-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon size={100} />
                </div>
                <h3 className="text-muted text-xs font-bold uppercase tracking-widest mb-4">
                    Sentimiento Global
                </h3>
                <div className={cn("text-5xl font-black flex items-center gap-4", getSentimentColor(averageScore))}>
                    <span>{averageScore.toFixed(2)}</span>
                    <Icon size={40} strokeWidth={3} />
                </div>
                <p className="text-muted text-[10px] mt-6 font-medium uppercase tracking-tighter">
                    Análisis Algorítmico en Tiempo Real
                </p>
            </div>

            <div className="glass glass-hover p-6 rounded-2xl overflow-hidden relative group">
                <h3 className="text-muted text-xs font-bold uppercase tracking-widest mb-4">
                    Volumen de Análisis
                </h3>
                <div className="text-5xl font-black text-accent text-glow-blue">
                    {totalNews}
                </div>
                <p className="text-muted text-[10px] mt-6 font-medium uppercase tracking-tighter">
                    Eventos Procesados (24h)
                </p>
            </div>
        </div>
    );
};
