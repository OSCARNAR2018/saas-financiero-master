"use client";

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ChartData {
    time: string;
    score: number;
}

interface SentimentChartProps {
    data: ChartData[];
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
    return (
        <div className="bg-[#121212] border border-gray-800 p-6 rounded-xl shadow-2xl mb-10 h-[400px]">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-6">
                Evolución del Sentimiento (Promedio por Hora)
            </h3>
            <div className="h-full pb-10">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                        <XAxis
                            dataKey="time"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[-10, 10]}
                            ticks={[-10, -5, 0, 5, 10]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#f3f4f6',
                            }}
                            itemStyle={{ color: '#3b82f6' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#0a0a0a' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
