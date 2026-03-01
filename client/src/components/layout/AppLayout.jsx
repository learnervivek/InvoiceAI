import { useAuth } from '@/context/AuthContext';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-background pt-16 transition-colors duration-300">
            {/* Main Content */}
            <main className="flex-1 px-4 md:px-6 py-6">{children}</main>
        </div>
    );
}
