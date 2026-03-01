import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { User, Mail, Shield, Bell, Moon, Sun, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [name, setName] = useState(user?.name || '');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            return toast.error('Name cannot be empty');
        }

        setIsUpdating(true);
        try {
            await updateProfile({ name });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <aside className="w-full md:w-64 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="p-6 md:p-8">
                                {activeTab === 'profile' && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                                            <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-xl">
                                                <AvatarImage src={user?.avatar} />
                                                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                                                    {user?.name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-2">
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                                                <p className="text-sm text-slate-500">{user?.email}</p>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Remove</Button>
                                                </div>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                        placeholder="Enter your name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                                    <input
                                                        type="email"
                                                        defaultValue={user?.email}
                                                        disabled
                                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 outline-none cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={isUpdating}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl font-bold min-w-[160px]"
                                                >
                                                    {isUpdating ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        'Save Changes'
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-8 text-center py-12">
                                        <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Lock className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Password & Security</h2>
                                            <p className="text-slate-500 max-w-sm mx-auto">Manage your authentication methods and active sessions in the upcoming updates.</p>
                                        </div>
                                        <Button variant="outline" className="mt-4">Update Password</Button>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="space-y-8 text-center py-12">
                                        <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Bell className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Notification Preferences</h2>
                                            <p className="text-slate-500 max-w-sm mx-auto">Configure how and when you receive updates about your invoices.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
