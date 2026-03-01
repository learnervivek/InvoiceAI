import AppLayout from '@/components/layout/AppLayout';
import InvoiceList from '@/components/invoice/InvoiceList';

export default function InvoicesPage() {
    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Invoices</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View and manage all your generated invoices.
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-1">
                    <InvoiceList />
                </div>
            </div>
        </AppLayout>
    );
}
