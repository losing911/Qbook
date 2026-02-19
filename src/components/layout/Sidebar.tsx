"use client";

import Link from 'next/link';
import { Home, Hash, Bell, Mail, Bookmark, User, MoreHorizontal, Zap, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuth } from '@/lib/auth-context';

const NAV_ITEMS = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Hash, label: 'Explore', href: '/explore' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Mail, label: 'Messages', href: '/messages' },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
    { icon: User, label: 'Profile', href: '/profile' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 h-screen w-[275px] border-r border-card-border p-4 hidden md:flex flex-col justify-between">
            <div>
                {/* Logo */}
                <div className="mb-6 pl-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Zap size={32} className="text-primary" />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors">QBook</span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-4 p-3 rounded-full text-xl transition-all duration-200 group",
                                    isActive ? "font-bold text-primary" : "text-foreground hover:bg-card-hover"
                                )}
                            >
                                <Icon size={26} className={clsx(isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Post Button */}
                <button className="mt-8 w-full bg-primary hover:bg-primary/90 text-background font-bold py-3.5 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">
                    Broadcast
                </button>
            </div>

            {/* User Mini Profile */}
            {user ? (
                <div className="p-3 rounded-full hover:bg-card-hover cursor-pointer transition-colors flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                        <User className="text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{user.username}</div>
                        <div className="text-muted-foreground text-xs truncate">@{user.username}</div>
                    </div>
                    <button onClick={logout} title="Logout" className="hover:text-red-500 transition-colors">
                        <LogOut size={18} />
                    </button>
                </div>
            ) : (
                <Link href="/login" className="p-3 rounded-full hover:bg-card-hover transition-colors flex items-center gap-3 justify-center border border-card-border">
                    <span className="font-bold">Login / Register</span>
                </Link>
            )}
        </aside>
    );
}
