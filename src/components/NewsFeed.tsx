"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Newspaper, MessageSquare } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass glass-hover p-6 rounded-2xl flex flex-col justify-between"
                >
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="bg-accent/10 text-accent font-black px-3 py-1 rounded-lg text-xs tracking-widest border border-accent/20">
                                {item.ticker}
                            </span>
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter border",
                                item.sentiment_score > 0
                                    ? 'bg-success/10 text-success border-success/20'
                                    : item.sentiment_score < 0
                                        ? 'bg-danger/10 text-danger border-danger/20'
                                        : 'bg-white/5 text-muted border-white/10'
                            )}>
                                {item.sentiment_label}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold leading-tight mb-4 group-hover:text-accent transition-colors">
                            {item.headline}
                        </h3>
                    </div>

                    <div className="mt-4">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 relative">
                            <MessageSquare size={14} className="text-accent absolute -top-2 -left-2 bg-[#0F0F0F] p-0.5 rounded" />
                            <p className="text-xs text-muted leading-relaxed italic">
                                {item.reasoning}
                            </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-[10px] text-muted font-medium uppercase">
                            <span className="flex items-center gap-1">
                                <Newspaper size={12} /> News Report
                            </span>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
