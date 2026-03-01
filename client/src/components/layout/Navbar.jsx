import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
    Menu,
    X,
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Zap,
    User,
    ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left Section: Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                            <Zap className="h-5 w-5 text-white fill-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Invoice<span className="text-blue-600">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Right Section */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        {user ? (
                            <>
                                <Link to="/dashboard">
                                    <Button variant="ghost" size="sm" className="font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                                        Dashboard
                                    </Button>
                                </Link>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 outline-none py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                            <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-700 shadow-sm">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold uppercase text-xs">
                                                    {user.name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col items-start mr-1">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white leading-none">
                                                    {user.name?.split(' ')[0]}
                                                </span>
                                                <Badge variant="outline" className="text-[10px] h-4 px-1 leading-none mt-1 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-normal">
                                                    {user.role}
                                                </Badge>
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 mt-1">
                                        <DropdownMenuLabel className="font-normal px-2 py-1.5">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer gap-2 py-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer gap-2 py-2">
                                            <FileText className="h-4 w-4" />
                                            My Invoices
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer gap-2 py-2 text-gray-400">
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 py-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/login?mode=register">
                                    <Button className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-white font-medium px-5">
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-600 dark:text-slate-300"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 absolute top-16 left-0 right-0 overflow-hidden shadow-xl"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 py-4 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                        <Avatar className="h-10 w-10 border border-white dark:border-slate-700 shadow-sm">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                {user.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                                        </div>
                                    </div>
                                    <MobileNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                        <LayoutDashboard className="h-5 w-5" />
                                        Dashboard
                                    </MobileNavLink>
                                    <MobileNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                        <FileText className="h-5 w-5" />
                                        My Invoices
                                    </MobileNavLink>
                                    <MobileNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                        <Settings className="h-5 w-5" />
                                        Settings
                                    </MobileNavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 pt-2">
                                    <Link to="/login" className="w-full">
                                        <Button variant="outline" className="w-full py-6 font-semibold">Log in</Button>
                                    </Link>
                                    <Link to="/login?mode=register" className="w-full">
                                        <Button className="w-full py-6 font-semibold bg-gray-900 text-white">Sign up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function MobileNavLink({ to, children, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
            {children}
        </Link>
    );
}
