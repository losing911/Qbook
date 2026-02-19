"use client";

import { Search, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const TRENDS = [
    { category: 'Technology', topic: 'Neural Link V4', posts: '125K' },
    { category: 'Politics', topic: 'Sector 7 Riots', posts: '89K' },
    { category: 'Entertainment', topic: '#GlitchPop', posts: '54K' },
    { category: 'Business', topic: 'CorpTech Stock', posts: '32K' },
    { category: 'World', topic: 'Weather Control Failure', posts: '21K' },
];

export function RightPanel() {
    return (
        <aside className="fixed right-0 top-0 h-screen w-[350px] border-l border-card-border p-4 hidden lg:block overflow-y-auto">
            {/* Search */}
            <div className="sticky top-0 bg-background/80 backdrop-blur-md pb-4 z-10">
                <div className="relative group">
                    <Search className="absolute left-4 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search QBook"
                        className="w-full bg-card-hover border border-transparent focus:border-primary rounded-full py-2.5 pl-12 pr-4 outline-none transition-all placeholder:text-muted-foreground focus:bg-background"
                    />
                </div>
            </div>

            {/* Trends Card */}
            <div className="bg-card rounded-2xl border border-card-border overflow-hidden">
                <div className="p-4 text-xl font-bold">Trends for you</div>

                {TRENDS.map((trend, i) => (
                    <motion.div
                        key={trend.topic}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="px-4 py-3 hover:bg-card-hover cursor-pointer transition-colors relative"
                    >
                        <div className="flex justify-between items-start">
                            <div className="text-xs text-muted-foreground">{trend.category}</div>
                            <button className="text-muted-foreground hover:bg-primary/10 hover:text-primary p-1 rounded-full transition-colors">
                                <MoreHorizontal size={14} />
                            </button>
                        </div>
                        <div className="font-bold text-foreground">{trend.topic}</div>
                        <div className="text-xs text-muted-foreground">{trend.posts} broadcasts</div>
                    </motion.div>
                ))}

                <div className="p-4 text-primary hover:bg-card-hover cursor-pointer text-sm transition-colors">
                    Show more
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 px-4 text-xs text-muted-foreground leading-5">
                <span className="hover:underline cursor-pointer">Terms of Service</span> ·
                <span className="hover:underline cursor-pointer"> Privacy Policy</span> ·
                <span className="hover:underline cursor-pointer"> Cookie Policy</span> ·
                <span className="hover:underline cursor-pointer"> Accessibility</span> ·
                <span className="hover:underline cursor-pointer"> Ads info</span> ·
                <span>© 2200 QBook Corp.</span>
            </div>
        </aside>
    );
}
