"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MarketSummary } from './MarketSummary';
import { NewsFeed } from './NewsFeed';
import { SentimentChart } from './SentimentChart';
import { TechnicalSignalsWidget } from './TechnicalSignalsWidget';
import { RefreshCw, LayoutDashboard, Sparkles } from 'lucide-react';
import { format, parseISO, startOfHour } from 'date-fns';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [news, setNews] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const processChartData = (data: any[]) => {
        const hourlyData: { [key: string]: { total: number; count: number } } = {};
        data.forEach((item) => {
            const date = parseISO(item.created_at);
            const hourKey = format(startOfHour(date), 'HH:00');
            if (!hourlyData[hourKey]) {
                hourlyData[hourKey] = { total: 0, count: 0 };
            }
            hourlyData[hourKey].total += item.sentiment_score;
            hourlyData[hourKey].count += 1;
        });
        const formattedData = Object.keys(hourlyData)
            .map((hour) => ({
                time: hour,
                score: hourlyData[hour].total / hourlyData[hour].count,
            }))
            .sort((a, b) => a.time.localeCompare(b.time));
        return formattedData;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('news_analysis')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setNews(data || []);
            setChartData(processChartData(data || []));
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const averageScore = news.length > 0
        ? news.reduce((acc, curr) => acc + curr.sentiment_score, 0) / news.length
        : 0;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header / Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <Sparkles className="text-accent" size={18} />
                        <span className="text-accent text-xs font-bold uppercase tracking-widest">
                            Inteligencia Artificial Activa
                        </span>
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tight">
                        Resumen de <span className="text-glow-blue text-accent">Mercado</span>
                    </h1>
                    <p className="text-muted mt-2">Bienvenido de nuevo, Oscar. Aquí tienes lo último en señales técnicas y noticias.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="glass glass-hover px-6 py-3 rounded-xl flex items-center gap-3 font-semibold text-sm"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin border-accent' : 'text-accent'} />
                        <span>{loading ? 'Sincronizando...' : 'Actualizar Datos'}</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-2xl flex items-center gap-3">
                    <LayoutDashboard size={20} />
                    <p className="font-medium">Error de conexión: {error}</p>
                </div>
            )}

            {/* Top Grid: Market Summary & Technical Signals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <MarketSummary averageScore={averageScore} totalNews={news.length} />
                    <SentimentChart data={chartData} />
                </div>

                <div className="space-y-6">
                    <TechnicalSignalsWidget />
                </div>
            </div>

            {/* Bottom Section: News Feed */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-2xl font-bold">Análisis de Noticias</h2>
                    <div className="h-px bg-white/5 flex-1 ml-4" />
                </div>
                <NewsFeed news={news} />
            </div>

            {news.length === 0 && !loading && !error && (
                <div className="text-center py-20 glass rounded-3xl border-dashed">
                    <p className="text-muted italic">No se han encontrado análisis recientes en la base de datos.</p>
                </div>
            )}
        </div>
    );
}
