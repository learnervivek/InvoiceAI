import { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import useInvoiceStore from '@/stores/useInvoiceStore';

export default function AiEditInput() {
    const [instruction, setInstruction] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { invoiceData, replaceInvoiceData } = useInvoiceStore();

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!instruction.trim()) return;

        setIsLoading(true);
        try {
            const { data } = await api.post('/ai/edit-invoice', {
                prompt: instruction,
                currentInvoice: invoiceData
            });

            // Map AI response with robust field fallbacks
            const mappedData = {
                ...data.data,
                items: (data.data.items || []).map(item => {
                    const parseVal = (v) => {
                        if (typeof v === 'number') return v;
                        const cleaned = String(v || '0').replace(/[^\d.]/g, '');
                        return parseFloat(cleaned) || 0;
                    };

                    const name = item.name || item.item || item.product || (item.description?.length < 30 ? item.description : '') || 'Untitled Item';
                    const description = (item.name && item.description && item.name !== item.description)
                        ? item.description
                        : (item.name ? '' : item.description || '');

                    return {
                        name,
                        quantity: parseVal(item.quantity) || 1,
                        unit_cost: parseVal(item.unit_cost || item.price || item.unit_price || item.rate || item.cost),
                        description,
                    };
                }),
                taxRate: parseFloat(String(data.data.tax || '0').replace(/[^\d.]/g, '')) || 0,
            };

            replaceInvoiceData(mappedData);
            setInstruction('');
            toast.success('Invoice updated by AI!');
        } catch (error) {
            console.error('AI Edit Error:', error);
            toast.error(error.response?.data?.message || 'AI couldn\'t understand the modification. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-900/30">
            <form onSubmit={handleEdit} className="relative">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                            <Sparkles className="h-4 w-4" />
                        </div>
                    </div>
                    <input
                        type="text"
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="Ask AI to modify (e.g., 'Change tax to 12%')"
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !instruction.trim()}
                        className="h-10 w-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 transition-all shadow-md"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                </div>
                {isLoading && (
                    <div className="absolute -top-12 left-0 right-0 flex justify-center">
                        <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full border shadow-sm flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">AI is modifying invoice...</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
