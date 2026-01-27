"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface NewsItem {
    id: string;
    ticker: string;
    headline: string;
    sentiment_score: number;
    sentiment_label: string;
    reasoning: string;
    created_at: string;
}

interface NewsFeedProps {
    news: NewsItem[];
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
                Análisis de Noticias Recientes
            </h2>
            <div className="grid gap-4">
                {news.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#121212] border border-gray-800 p-5 rounded-lg hover:border-gray-600 transition-colors shadow-xl"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded text-sm font-mono font-bold tracking-wider">
                                    {item.ticker}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${item.sentiment_score > 0
                                        ? 'bg-green-900/20 text-green-400 border border-green-500/30'
                                        : item.sentiment_score < 0
                                            ? 'bg-red-900/20 text-red-400 border border-red-500/30'
                                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                                    }`}>
                                    {item.sentiment_label} ({item.sentiment_score})
                                </span>
                            </div>
                            <span className="text-gray-500 text-xs font-mono">
                                {new Date(item.created_at).toLocaleString()}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-2 leading-snug">
                            {item.headline}
                        </h3>
                        <div className="bg-[#1a1a1a] p-3 rounded border-l-2 border-gray-700 italic text-sm text-gray-400">
                            {item.reasoning}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
