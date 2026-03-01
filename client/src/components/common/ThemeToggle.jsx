import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative h-9 w-9 flex items-center justify-center border border-slate-200 dark:border-slate-700 ${className}`}
            aria-label="Toggle theme"
        >
            <div className="relative h-5 w-5">
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === 'dark' ? 0 : 1,
                        opacity: theme === 'dark' ? 0 : 1,
                        rotate: theme === 'dark' ? 45 : 0,
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute inset-0 text-slate-600"
                >
                    <Sun className="h-5 w-5 fill-slate-600" />
                </motion.div>
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === 'dark' ? 1 : 0,
                        opacity: theme === 'dark' ? 1 : 0,
                        rotate: theme === 'dark' ? 0 : -45,
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute inset-0 text-blue-400"
                >
                    <Moon className="h-5 w-5 fill-blue-400" />
                </motion.div>
            </div>
        </button>
    );
}
