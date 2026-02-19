"use client";

import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { PostCard } from '@/components/feed/PostCard'; // Reuse for now
import { useQuery } from '@tanstack/react-query';
import { fetchSocialFeed } from '@/lib/api';

export default function ProfilePage() {
    const { user } = useAuth();

    // Fetch some posts to pretend they are the user's
    const { data } = useQuery({
        queryKey: ['social-feed', 'profile'],
        queryFn: () => fetchSocialFeed('x'),
    });

    if (!user) {
        return (
            <div className="flex-1 border-r border-card-border min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-muted-foreground mb-6">Please login to view your profile.</p>
                    <Link href="/login" className="bg-primary text-background px-6 py-2 rounded-full font-bold">Login</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 border-r border-card-border min-h-screen pb-20 md:pb-0">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-card-border px-4 py-2 flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-card-hover rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold">{user.username}</h1>
                    <div className="text-sm text-muted-foreground">0 broadcasts</div>
                </div>
            </div>

            {/* Hero / Banner */}
            <div className="h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"></div>

            {/* Profile Info */}
            <div className="px-4 pb-4 border-b border-card-border relative">
                <div className="w-32 h-32 rounded-full bg-background border-4 border-background absolute -top-16 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black"></div>
                </div>

                <div className="flex justify-end pt-4">
                    <button className="border border-card-border px-4 py-1.5 rounded-full font-bold hover:bg-card-hover transition-colors">
                        Edit profile
                    </button>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold leading-tight">{user.username}</h2>
                    <div className="text-muted-foreground">@{user.username}</div>
                </div>

                <div className="mt-4 text-foreground/90">
                    Citizen of Universe 2200. {user.role === 'citizen' ? 'Just trying to survive.' : 'Plotting something.'}
                </div>

                <div className="flex gap-4 mt-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>Sector 7</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <LinkIcon size={16} />
                        <a href="#" className="text-primary hover:underline">neural.net</a>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Joined 2200</span>
                    </div>
                </div>

                <div className="flex gap-4 mt-4 text-sm">
                    <div className="hover:underline cursor-pointer"><span className="font-bold text-foreground">142</span> <span className="text-muted-foreground">Following</span></div>
                    <div className="hover:underline cursor-pointer"><span className="font-bold text-foreground">8.2K</span> <span className="text-muted-foreground">Followers</span></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-card-border">
                <div className="flex-1 py-4 text-center font-bold hover:bg-card-hover cursor-pointer border-b-4 border-primary text-foreground transition-colors">Broadacs</div>
                <div className="flex-1 py-4 text-center font-bold hover:bg-card-hover cursor-pointer text-muted-foreground transition-colors">Replies</div>
                <div className="flex-1 py-4 text-center font-bold hover:bg-card-hover cursor-pointer text-muted-foreground transition-colors">Highlights</div>
                <div className="flex-1 py-4 text-center font-bold hover:bg-card-hover cursor-pointer text-muted-foreground transition-colors">Media</div>
            </div>

            {/* User Posts */}
            <div>
                {data?.data.slice(0, 5).map(post => <PostCard key={post.id} post={{ ...post, author_type: 'citizen' }} />)}
            </div>
        </div>
    );
}
