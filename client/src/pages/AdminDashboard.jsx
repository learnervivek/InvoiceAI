import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    Users,
    FileText,
    DollarSign,
    Trash2,
    ShieldAlert,
    ArrowLeft,
    Loader2,
    RefreshCw,
    Search
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * AdminDashboard Page
 * Allows administrators to monitor platform stats, manage users, and view all invoices.
 */
export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, invoicesRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/invoices')
            ]);
            setStats(statsRes.data.stats);
            setUsers(usersRes.data.users);
            setInvoices(invoicesRes.data.invoices);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
            toast.error('Failed to load admin dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to soft-delete user "${userName}"? They will no longer be able to log in.`)) {
            return;
        }

        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success(`User ${userName} soft-deleted`);
            setUsers(users.filter(u => u._id !== userId));
            // Refresh stats as well
            const statsRes = await api.get('/admin/stats');
            setStats(statsRes.data.stats);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    if (loading && !refreshing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading Administrator Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30 pb-12">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/dashboard')}
                                className="rounded-full"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="h-6 w-6 text-red-600" />
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                    Admin Control Center
                                </h1>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Sync Data
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Users size={80} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600 uppercase tracking-wider">Total Active Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</div>
                            <p className="text-xs text-gray-400 mt-1">Excludes soft-deleted accounts</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FileText size={80} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-600 uppercase tracking-wider">Total Invoices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats?.totalInvoices || 0}</div>
                            <p className="text-xs text-gray-400 mt-1">Platform-wide document count</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <DollarSign size={80} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Platform Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</div>
                            <p className="text-xs text-gray-400 mt-1">Total value across all invoices</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Management Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Users className="h-5 w-5 text-gray-500" />
                                User Management
                            </h2>
                            <Badge variant="outline">{users.length}</Badge>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                            />
                        </div>

                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                            <div className="divide-y max-h-[600px] overflow-y-auto">
                                {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                    <div key={u._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="font-medium text-sm text-gray-900 truncate">{u.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{u.email}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="text-[10px] py-0 px-1.5 h-auto">
                                                    {u.role}
                                                </Badge>
                                                <span className="text-[10px] text-gray-400">
                                                    Joined {new Date(u.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        {u.role !== 'admin' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteUser(u._id, u.name)}
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-gray-400 text-sm">
                                        No users found matching your search.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Platform Invoices Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-gray-500" />
                                Platform-wide Invoices
                            </h2>
                            <Badge variant="outline">{invoices.length}</Badge>
                        </div>

                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-4">Invoice #</th>
                                            <th className="px-6 py-4">Sender (User)</th>
                                            <th className="px-6 py-4">Client</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {invoices.slice(0, 50).map((inv) => (
                                            <tr key={inv._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-mono font-medium text-gray-900 whitespace-nowrap">
                                                    {inv.invoiceNumber || inv._id.slice(-6).toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-900 font-medium">{inv.userId?.name || 'Unknown'}</div>
                                                    <div className="text-[11px] text-gray-400">{inv.userId?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {inv.to?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    {formatCurrency(inv.total || 0)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge
                                                        className={`
                              capitalize text-[10px]
                              ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
                              ${inv.status === 'overdue' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                              ${inv.status === 'draft' ? 'bg-gray-100 text-gray-700 hover:bg-gray-100' : ''}
                            `}
                                                    >
                                                        {inv.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                        {invoices.length === 0 && (
                                            <tr>
                                                <td colspan="5" className="px-6 py-12 text-center text-gray-400">
                                                    No invoices have been created on the platform yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {invoices.length > 50 && (
                                <div className="p-4 bg-gray-50 text-center text-xs text-gray-500 italic">
                                    Showing latest 50 invoices.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
