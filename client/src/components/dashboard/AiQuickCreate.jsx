import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import useInvoiceStore from '@/stores/useInvoiceStore';

export default function AiQuickCreate() {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const replaceInvoiceData = useInvoiceStore((state) => state.replaceInvoiceData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const { data } = await api.post('/ai/create-invoice', { prompt });

            // Map AI response to store format
            const mappedData = {
                to: {
                    name: data.data.clientName || '',
                    email: data.data.clientEmail || '',
                },
                items: (data.data.items || []).map(item => ({
                    name: item.name || '',
                    quantity: item.quantity || 1,
                    unit_cost: item.price || 0,
                    description: '',
                })),
                taxRate: data.data.tax || 0,
                currency: data.data.currency || 'INR',
                dueDate: data.data.dueDate || '',
            };

            replaceInvoiceData(mappedData);
            toast.success('Invoice skeleton generated!');
            navigate('/chat');
        } catch (error) {
            console.error('AI Error:', error);
            toast.error(error.response?.data?.message || 'Failed to generate invoice. Try being more specific.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-1">
                    <div className="flex items-center justify-center w-12 h-12 text-blue-600">
                        <Sparkles className="h-6 w-6 animate-pulse" />
                    </div>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Try: 'Create invoice for Rahul Sharma, 2 logo designs at 3000 each, 18% GST...'"
                        className="flex-1 bg-transparent border-none outline-none px-2 py-4 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg font-medium"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-6 py-3 flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none mr-1"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="hidden sm:inline">Thinking...</span>
                            </>
                        ) : (
                            <>
                                <span className="hidden sm:inline">Generate</span>
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>
            <p className="mt-3 text-sm text-center text-slate-500 flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                Powered by Gemini AI • Describe your invoice in plain English
            </p>
        </div>
    );
}
