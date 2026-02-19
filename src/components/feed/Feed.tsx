"use client";

import { useQuery } from '@tanstack/react-query';
import { PostCard } from './PostCard';
import { SocialPost } from '@/lib/types';
import { fetchSocialFeed } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export function Feed() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['social-feed', 'x'],
        queryFn: () => fetchSocialFeed('x'),
    });

    const posts = data?.data || [];

    return (
        <div className="flex-1 border-r border-card-border min-h-screen pb-20 md:pb-0">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-card-border p-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <h1 className="text-xl font-bold">Home</h1>
            </div>

            {/* Compose Tweet Area (Placeholder) */}
            <div className="p-4 border-b border-card-border hidden md:block">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted/50"></div>
                    <div className="flex-1">
                        <input type="text" placeholder="What is happening?" className="w-full bg-transparent outline-none text-xl placeholder:text-muted-foreground" />
                        <div className="flex justify-end mt-4">
                            <button className="bg-primary/50 text-background font-bold py-1.5 px-4 rounded-full text-sm cursor-not-allowed">Broadcast</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts */}
            <div className="divide-y divide-card-border">
                {isLoading && (
                    <div className="p-8 text-center text-muted-foreground animate-pulse">
                        Accessing Quantum Network...
                    </div>
                )}

                {isError && (
                    <div className="p-8 text-center text-red-500">
                        Network Error. Connection Lost.
                    </div>
                )}

                <AnimatePresence mode="popLayout">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </AnimatePresence>

                {posts.length === 0 && !isLoading && !isError && (
                    <div className="p-8 text-center text-muted-foreground">
                        No signals detected.
                    </div>
                )}
            </div>
        </div>
    );
}
