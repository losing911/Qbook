"use client";

import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/components/feed/PostCard';
import { fetchSocialFeed } from '@/lib/api';
import { Search } from 'lucide-react';

export default function ExplorePage() {
    const { data, isLoading } = useQuery({
        queryKey: ['social-feed', 'explore'],
        queryFn: () => fetchSocialFeed('x'), // Reuse X feed for now, maybe shuffle in future
    });

    const posts = data?.data || [];

    return (
        <div className="flex-1 border-r border-card-border min-h-screen pb-20 md:pb-0">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-card-border p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-3 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search Universe 2200"
                        className="w-full bg-card-hover border border-transparent focus:border-primary rounded-full py-2 pl-12 pr-4 outline-none transition-all placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="divide-y divide-card-border">
                <div className="p-4 font-bold text-xl border-b border-card-border">Trending Now</div>
                {isLoading ? (
                    <div className="p-8 text-center text-muted-foreground animate-pulse">Scanning frequencies...</div>
                ) : (
                    posts.map(post => <PostCard key={post.id} post={post} />)
                )}
            </div>
        </div>
    );
}
