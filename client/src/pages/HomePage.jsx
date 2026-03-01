import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
    Zap,
    MessageSquare,
    ShieldCheck,
    Repeat,
    ArrowRight,
    CheckCircle2,
    Lock,
    CreditCard,
    Cloud,
    PieChart,
    Eye,
    Send,
    BarChart3,
    FileText,
} from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 overflow-hidden pt-24 font-sans transition-colors duration-300">
            {/* 1️⃣ Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 px-4 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.1),transparent_70%)]" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 -z-10"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute top-1/2 -left-24 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30 -z-10"
                />

                <div className="max-w-7xl mx-auto text-center px-4 relative">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                            AI-Powered Invoicing is here
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-6 transition-colors"
                        >
                            Create Smart Invoices <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
                                with AI in Seconds
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg md:text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-colors"
                        >
                            The modern conversational platform for managing your business.
                            Generate invoices via chat, automate follow-ups, and get paid faster
                            with integrated Razorpay processing.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/chat">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-7 text-lg font-bold shadow-xl shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 group">
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Button
                                onClick={() => document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' })}
                                variant="outline"
                                size="lg"
                                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-full px-8 py-7 text-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                            >
                                View Demo
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Animated Mockup Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-20 relative max-w-5xl mx-auto"
                    >
                        <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none bg-white dark:bg-slate-900 p-2">
                            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl overflow-hidden aspect-[16/9] flex items-center justify-center p-8">
                                <div className="grid grid-cols-12 gap-6 w-full h-full">
                                    {/* Sidebar/Chat Mockup */}
                                    <div className="col-span-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 flex flex-col gap-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                                                <Zap className="h-3 w-3 text-white fill-white" />
                                            </div>
                                            <div className="h-3 w-20 bg-gray-100 dark:bg-slate-800 rounded" />
                                        </div>
                                        <div className="h-10 w-full bg-gray-50 dark:bg-slate-800/50 rounded-lg p-2 flex items-center">
                                            <div className="h-2 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
                                        </div>
                                        <div className="h-20 w-full bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30 p-3 self-end">
                                            <div className="h-2 w-full bg-blue-200 dark:bg-blue-800 rounded mb-2" />
                                            <div className="h-2 w-2/3 bg-blue-200 dark:bg-blue-800 rounded" />
                                        </div>
                                        <div className="h-10 w-full bg-gray-50 dark:bg-slate-800/50 rounded-lg p-2 flex items-center mt-auto">
                                            <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-slate-700 mr-2" />
                                            <div className="h-2 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
                                        </div>
                                    </div>
                                    {/* Invoice Sheet Mockup */}
                                    <div className="col-span-8 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 flex flex-col">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex flex-col gap-2">
                                                <div className="h-4 w-32 bg-gray-900 dark:bg-white rounded" />
                                                <div className="h-2 w-48 bg-gray-100 dark:bg-slate-800 rounded" />
                                            </div>
                                            <div className="h-10 w-24 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded" />
                                        </div>
                                        <div className="space-y-4 mb-8">
                                            <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded" />
                                            <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded" />
                                            <div className="h-2 w-3/4 bg-gray-100 dark:bg-slate-800 rounded" />
                                        </div>
                                        <div className="mt-auto flex justify-between items-center py-4 border-t dark:border-slate-800 text-gray-900 dark:text-white transition-colors duration-300">
                                            <div className="h-4 w-24 bg-gray-400 dark:bg-slate-600 rounded" />
                                            <div className="h-8 w-32 bg-blue-600 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 md:-top-10 md:-right-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 flex items-center gap-3 transition-colors"
                        >
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-900 uppercase">Paid</p>
                                <p className="text-sm font-semibold text-gray-500">+$1,500.00</p>
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 flex items-center gap-3 transition-colors"
                        >
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <PieChart className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-900 uppercase">Analytics</p>
                                <p className="text-sm font-semibold text-gray-500">Active Growth</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 2️⃣ Features Section */}
            <section className="py-24 px-4 bg-white dark:bg-slate-900/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to scale</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Powerful features designed to save you hours of manual data entry and payment tracking.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={MessageSquare}
                            title="Conversational Builder"
                            description="Just chat with our AI to generate complex invoices in natural language."
                            delay={0.1}
                            color="blue"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="AI Smart Parsing"
                            description="Automatically detect items, taxes, and totals from your descriptions."
                            delay={0.2}
                            color="blue"
                        />
                        <FeatureCard
                            icon={CreditCard}
                            title="Payment Integration"
                            description="Accept payments instantly with Razorpay links embedded in every email."
                            delay={0.3}
                            color="blue"
                        />
                        <FeatureCard
                            icon={Repeat}
                            title="Recurring Invoices"
                            description="Set it and forget it. Effortlessly automate your monthly billing cycles."
                            delay={0.4}
                            color="blue"
                        />
                    </div>
                </div>
            </section>
            {/* 3️⃣ How It Works Section */}
            <section className="py-24 px-4 bg-slate-50/50 dark:bg-slate-900/30 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 mb-4 px-4 py-1">Process</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">How it works</h2>
                        <p className="text-gray-500 dark:text-slate-400 max-w-2xl mx-auto transition-colors">Experience the future of invoicing in five simple steps.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/20 dark:via-blue-800/40 dark:to-blue-900/20 -translate-y-1/2 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 relative z-10">
                            <StepCard
                                number="1"
                                icon={MessageSquare}
                                title="Chat with AI"
                                description="User enters invoice details conversationally."
                                delay={0.1}
                            />
                            <StepCard
                                number="2"
                                icon={Eye}
                                title="Live Preview"
                                description="Real-time invoice preview updates automatically."
                                delay={0.2}
                            />
                            <StepCard
                                number="3"
                                icon={FileText}
                                title="Generate PDF"
                                description="Professional PDF created via InvoiceAI Engine."
                                delay={0.3}
                            />
                            <StepCard
                                number="4"
                                icon={Send}
                                title="Send & Get Paid"
                                description="Email invoice or collect payment via Razorpay."
                                delay={0.4}
                            />
                            <StepCard
                                number="5"
                                icon={BarChart3}
                                title="Track & Analyze"
                                description="Monitor status and revenue in your dashboard."
                                delay={0.5}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4️⃣ Live Demo Preview Section */}
            <section id="live-demo" className="py-24 px-4 bg-white dark:bg-slate-900 flex flex-col items-center transition-colors duration-300">
                <div className="max-w-5xl mx-auto w-full">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative shadow-2xl">
                        {/* Background patterns */}
                        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />

                        <div className="text-center mb-12 relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Magic happens in real-time</h2>
                            <p className="text-blue-100 max-w-xl mx-auto">This is how your invoice builds as you chat. No forms, no friction.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch relative z-10">
                            {/* Fake Chat Side */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 flex flex-col gap-4 shadow-xl"
                            >
                                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        <Zap className="h-4 w-4 text-white fill-white" />
                                    </div>
                                    <span className="text-white font-semibold">InvoiceAI Assistant</span>
                                </div>
                                <div className="space-y-4 py-4">
                                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[85%] border border-white/5">
                                        <p className="text-blue-50 text-sm">Hello! I'm ready to help. What are we billing for today?</p>
                                    </div>
                                    <div className="bg-blue-500/30 rounded-2xl rounded-tr-none p-4 max-w-[85%] self-end border border-white/10 ml-auto">
                                        <p className="text-white text-sm">Hi, I need an invoice for 5 hours of website design for Acme Corp at $100/hr. Also add 18% tax.</p>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="bg-white/10 rounded-2xl rounded-tl-none p-4 max-w-[90%] border border-white/10"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                            <p className="text-green-300 text-xs font-bold uppercase tracking-wider">Processing...</p>
                                        </div>
                                        <p className="text-blue-50 text-sm italic">Great! I've updated your invoice with Website Design, 5 hours, and calculated the tax. Check the preview!</p>
                                    </motion.div>
                                </div>
                                <div className="mt-auto bg-white/5 rounded-full p-3 px-5 border border-white/10 flex items-center justify-between">
                                    <span className="text-blue-200/50 text-sm italic">Type your request...</span>
                                    <Send className="h-4 w-4 text-blue-300" />
                                </div>
                            </motion.div>

                            {/* Live Summary Side */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col border border-white/10"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Live Summary</h3>
                                        <p className="text-2xl font-black text-gray-900">Acme Corp Inc.</p>
                                    </div>
                                    <div className="bg-blue-50 text-blue-600 h-10 w-10 rounded-xl flex items-center justify-center shadow-inner">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <span className="text-gray-500 font-medium text-sm">Website Design</span>
                                        <span className="text-gray-900 font-bold">$500.00</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-gray-400 text-sm italic">Tax (18%)</span>
                                        <span className="text-gray-600 font-semibold">$90.00</span>
                                    </div>
                                </div>

                                <div className="mt-auto bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-500 text-xs font-bold uppercase">Total Due</span>
                                        <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded">USD</span>
                                    </div>
                                    <p className="text-4xl font-black text-gray-900">$590.00</p>
                                </div>

                                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-14 font-bold text-lg shadow-lg shadow-blue-100 transition-all active:scale-95">
                                    Generate Final PDF
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3️⃣ Security Section */}
            <section className="py-24 px-4 bg-gray-50/50 dark:bg-slate-900/80 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-16 overflow-hidden relative shadow-2xl">
                        {/* Background flare */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-0" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-6 py-1 px-4">Trusted Security</Badge>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                    Your data security is <br /> our top priority
                                </h2>
                                <p className="text-gray-400 dark:text-slate-400 text-lg mb-8 transition-colors">
                                    We use industry-standard encryption and protocols to ensure your financial
                                    data and client information are always safe.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <SecurityItem icon={Lock} text="JWT Authentication" />
                                    <SecurityItem icon={ShieldCheck} text="Secure Payments" />
                                    <SecurityItem icon={PieChart} text="Role-Based Access" />
                                    <SecurityItem icon={Cloud} text="Cloud Hosted" />
                                </div>
                            </div>
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                        y: [0, -10, 0]
                                    }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
                                >
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-12 w-12 rounded-2xl bg-blue-500 flex items-center justify-center">
                                            <ShieldCheck className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">Enterprise Logic</p>
                                            <p className="text-gray-500 text-sm">Verified & Protected</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '85%' }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                className="h-full bg-blue-500"
                                            />
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '92%' }}
                                                transition={{ duration: 1.5, delay: 0.7 }}
                                                className="h-full bg-blue-400"
                                            />
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '78%' }}
                                                transition={{ duration: 1.5, delay: 0.9 }}
                                                className="h-full bg-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t dark:border-slate-800 mt-auto px-4 bg-white dark:bg-slate-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 dark:text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600 fill-blue-600" />
                        <span className="font-bold text-gray-900 dark:text-white transition-colors">InvoiceAI</span>
                    </div>
                    <p>© 2025 InvoiceAI Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, delay, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
            className="group p-8 rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-900 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
        >
            <div className={`h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">{title}</h3>
            <p className="text-gray-500 dark:text-slate-400 leading-relaxed transition-colors">{description}</p>
        </motion.div>
    );
}

function SecurityItem({ icon: Icon, text }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-6 w-6 flex items-center justify-center text-blue-400">
                <Icon className="h-5 w-5" />
            </div>
            <span className="text-gray-300 font-medium text-sm">{text}</span>
        </div>
    );
}

function StepCard({ number, icon: Icon, title, description, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="flex flex-col items-center text-center group cursor-default"
        >
            <div className="relative mb-6">
                <div className="h-20 w-20 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl group-hover:shadow-2xl group-hover:shadow-blue-500/10 dark:group-hover:shadow-none transition-all duration-300 flex items-center justify-center group-hover:-translate-y-2 group-hover:scale-110">
                    <Icon className="h-9 w-9 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-all duration-300" />
                </div>
                <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-white dark:ring-slate-900">
                    {number}
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed transition-colors px-4">{description}</p>
        </motion.div>
    );
}
