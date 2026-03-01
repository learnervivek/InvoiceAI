import AppLayout from '@/components/layout/AppLayout';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import AiQuickCreate from '@/components/dashboard/AiQuickCreate';
import AiInsightsCard from '@/components/dashboard/AiInsightsCard';
import InvoiceList from '@/components/invoice/InvoiceList';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                {/* Header & AI Quick Create */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Overview of your invoicing activity and revenue.
                        </p>
                    </div>

                    <AiQuickCreate />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <AnalyticsDashboard />
                    </div>
                    <div>
                        <AiInsightsCard />
                    </div>
                </div>

                <Separator />

                {/* Invoice List Section */}
                <div>
                    <h2 className="text-xl font-bold tracking-tight mb-1">Recent Invoices</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Manage your invoices, download PDFs, and send them via email.
                    </p>
                    <InvoiceList />
                </div>
            </div>
        </AppLayout>
    );
}
