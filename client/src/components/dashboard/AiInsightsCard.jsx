import { useState, useEffect } from 'react';
import { Sparkles, Loader2, TrendingUp, Users, Clock, Lightbulb, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';

const CACHE_KEY = 'ai_business_insights';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export default function AiInsightsCard() {
    const [insights, setInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                setInsights(data);
                setLastUpdated(timestamp);
            }
        }
    }, []);

    const generateInsights = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/ai/insights');
            if (data.data) {
                const timestamp = Date.now();
                setInsights(data.data);
                setLastUpdated(timestamp);
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: data.data,
                    timestamp
                }));
                toast.success('New insights generated!');
            } else {
                toast.info(data.message || 'Not enough data yet.');
            }
        } catch (error) {
            console.error('Insights Error:', error);
            toast.error('Failed to generate insights. Try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!insights && !isLoading) {
        return (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">AI Business Insights</h3>
                        <p className="text-blue-100 text-xs">Unlock trends from your data</p>
                    </div>
                </div>
                <p className="text-sm text-blue-50 mb-6 leading-relaxed">
                    Get personalized analysis of your invoicing patterns, top clients, and revenue growth suggestions powered by Gemini AI.
                </p>
                <Button
                    onClick={generateInsights}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-6 rounded-xl border-none shadow-lg"
                >
                    Generate Insights
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <Sparkles className="h-5 w-5" />
                    <span>AI Business Insights</span>
                </div>
                <button
                    onClick={generateInsights}
                    disabled={isLoading}
                    className="text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                    title="Refresh Insights"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="p-6 space-y-6">
                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <p className="text-sm font-medium animate-pulse">Gemini is analyzing your data...</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "{insights.summary}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <Users className="h-3.5 w-3.5" />
                                        Top Client
                                    </div>
                                    <div className="font-bold text-slate-900 dark:text-white">
                                        {insights.topClient.name}
                                    </div>
                                    <div className="text-xs text-green-600 font-medium">
                                        ₹{insights.topClient.revenue.toLocaleString()} total revenue
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <Clock className="h-3.5 w-3.5" />
                                        Avg. Payment
                                    </div>
                                    <div className="font-bold text-slate-900 dark:text-white">
                                        {insights.avgPaymentDelay}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        From issue date
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    Trends Analysis
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {insights.trends}
                                </p>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                                    Strategic Suggestions
                                </div>
                                <ul className="space-y-2">
                                    {insights.suggestions.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <span className="text-blue-500 font-bold">•</span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {lastUpdated && (
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <span className="text-[10px] text-slate-400">
                                    AI-generated on {new Date(lastUpdated).toLocaleDateString()} at {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
                                    Cache expires in 24h
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
