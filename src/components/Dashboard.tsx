"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MarketSummary } from './MarketSummary';
import { NewsFeed } from './NewsFeed';
import { SentimentChart } from './SentimentChart';
import { RefreshCw, LayoutDashboard } from 'lucide-react';
import { format, parseISO, startOfHour } from 'date-fns';

export default function Dashboard() {
    const [news, setNews] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const processChartData = (data: any[]) => {
        // Agrupar por hora y calcular el promedio del sentiment_score
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

        // Convertir a formato Recharts y ordenar
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
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800">
                    <div className="flex items-center space-x-3">
                        <LayoutDashboard className="text-blue-500" size={32} />
                        <h1 className="text-2xl font-bold tracking-tight">
                            SaaS <span className="text-blue-500">Financiero</span> <span className="text-gray-500 font-light">| Master</span>
                        </h1>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        <span>{loading ? 'Cargando...' : 'Actualizar'}</span>
                    </button>
                </header>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-8">
                        Error al conectar con Supabase: {error}
                    </div>
                )}

                <MarketSummary averageScore={averageScore} totalNews={news.length} />

                <SentimentChart data={chartData} />

                <NewsFeed news={news} />

                {news.length === 0 && !loading && !error && (
                    <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl">
                        <p className="text-gray-500">No hay análisis de noticias disponibles en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
