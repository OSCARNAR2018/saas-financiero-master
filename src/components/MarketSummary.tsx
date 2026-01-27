"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketSummaryProps {
    averageScore: number;
    totalNews: number;
}

export const MarketSummary: React.FC<MarketSummaryProps> = ({ averageScore, totalNews }) => {
    const getSentimentColor = (score: number) => {
        if (score > 1) return 'text-green-400';
        if (score < -1) return 'text-red-400';
        return 'text-gray-400';
    };

    const Icon = averageScore > 1 ? TrendingUp : averageScore < -1 ? TrendingDown : Minus;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#121212] border border-gray-800 p-6 rounded-xl shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon size={80} />
                </div>
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                    Sentimiento Promedio Día
                </h3>
                <div className={`text-4xl font-bold flex items-center space-x-3 ${getSentimentColor(averageScore)}`}>
                    <span>{averageScore.toFixed(2)}</span>
                    <Icon size={32} />
                </div>
                <p className="text-gray-500 text-xs mt-4 font-mono">
                    Basado en el análisis algorítmico de tiempo real.
                </p>
            </div>

            <div className="bg-[#121212] border border-gray-800 p-6 rounded-xl shadow-2xl overflow-hidden relative group">
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                    Volumen de Análisis
                </h3>
                <div className="text-4xl font-bold text-blue-400">
                    {totalNews}
                </div>
                <p className="text-gray-500 text-xs mt-4 font-mono">
                    Eventos procesados en las últimas 24 horas.
                </p>
            </div>
        </div>
    );
};
