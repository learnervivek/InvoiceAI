import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    DollarSign,
    TrendingUp,
    Clock,
    AlertTriangle,
    Users,
    FileText,
    Loader2,
    BarChart3,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import api from '@/lib/api';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-card p-3 shadow-lg">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-sm text-primary font-semibold">
                    ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
            </div>
        );
    }
    return null;
};

export default function AnalyticsDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data: summary } = await api.get('/analytics/summary');
                setData(summary);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <p>{error}</p>
            </div>
        );
    }

    if (!data) return null;

    const statCards = [
        {
            title: 'Total Revenue',
            value: `$${data.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
        },
        {
            title: 'Pending Amount',
            value: `$${data.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: Clock,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
        },
        {
            title: 'Overdue Invoices',
            value: data.overdueCount.toString(),
            icon: AlertTriangle,
            color: data.overdueCount > 0 ? 'text-red-500' : 'text-muted-foreground',
            bg: data.overdueCount > 0 ? 'bg-red-500/10' : 'bg-muted/50',
        },
        {
            title: 'Total Invoices',
            value: data.statusCounts?.total?.toString() || '0',
            icon: FileText,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
    ];

    const statusBadges = [
        { label: 'Draft', count: data.statusCounts?.draft || 0, color: 'bg-gray-400' },
        { label: 'Sent', count: data.statusCounts?.sent || 0, color: 'bg-blue-500' },
        { label: 'Viewed', count: data.statusCounts?.viewed || 0, color: 'bg-purple-500' },
        { label: 'Paid', count: data.statusCounts?.paid || 0, color: 'bg-emerald-500' },
        { label: 'Overdue', count: data.statusCounts?.overdue || 0, color: 'bg-red-500' },
    ];

    return (
        <div className="space-y-6">
            {/* ── Stat Cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {statCards.map(({ title, value, icon: Icon, color, bg }) => (
                    <Card key={title} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center`}>
                                    <Icon className={`h-4.5 w-4.5 ${color}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold tracking-tight">{value}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Monthly Revenue Chart ──────────────────────────────────── */}
            <Card>
                <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Monthly Revenue</h3>
                        <span className="text-xs text-muted-foreground ml-auto">Last 12 months</span>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11 }}
                                    className="fill-muted-foreground"
                                />
                                <YAxis
                                    tick={{ fontSize: 11 }}
                                    className="fill-muted-foreground"
                                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    fill="url(#revenueGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* ── Bottom Row: Status + Top Clients ──────────────────────── */}
            <div className="grid lg:grid-cols-2 gap-3">
                {/* Status Distribution */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Invoice Status</h3>
                        </div>
                        <div className="space-y-3">
                            {statusBadges.map(({ label, count, color }) => {
                                const total = data.statusCounts?.total || 1;
                                const pct = Math.round((count / total) * 100);
                                return (
                                    <div key={label} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                                                <span>{label}</span>
                                            </div>
                                            <span className="text-muted-foreground font-medium">
                                                {count} <span className="text-xs">({pct}%)</span>
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${color} rounded-full transition-all duration-700`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Clients */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Top Clients</h3>
                        </div>
                        {data.topClients.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No paid invoices yet. Your top clients will appear here.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {data.topClients.map((client, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{client.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{client.email || '—'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">
                                                ${client.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {client.invoiceCount} invoice{client.invoiceCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
