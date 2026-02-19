"use client";

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { PostCard } from '@/components/feed/PostCard';
import { Users, MapPin, Calendar } from 'lucide-react';

async function fetchUserProfile(handle: string) {
    const res = await fetch(`/api/users/${handle}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
}

export default function ProfilePage() {
    const params = useParams();
    const handle = params?.handle as string;

    const { data, isLoading, error } = useQuery({
        queryKey: ['profile', handle],
        queryFn: () => fetchUserProfile(handle),
        enabled: !!handle
    });

    if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading profile...</div>;
    if (error) return <div className="p-8 text-center text-red-400">User not found</div>;

    const { user, posts } = data;

    return (
        <div className="flex-1 min-h-screen pb-20 md:pb-0">
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-r from-primary/20 to-purple-500/20 w-full relative">
                <div className="absolute -bottom-12 left-4">
                    <img
                        src={user.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.handle}`}
                        alt={user.display_name}
                        className="w-24 h-24 rounded-full border-4 border-background bg-background object-cover"
                    />
                </div>
            </div>

            <div className="mt-14 px-4 pb-4 border-b border-card-border">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">{user.display_name}</h1>
                        <p className="text-muted-foreground">@{user.handle}</p>
                    </div>
                    {/* Follow Button Placeholder */}
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">
                        Follow
                    </button>
                </div>

                <p className="mt-4 text-foreground/90 whitespace-pre-wrap">{user.bio || "No bio available."}</p>

                <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span className="text-foreground">{user.stats?.followers || 0}</span> Followers
                    </div>
                    <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span className="text-foreground">{user.stats?.following || 0}</span> Following
                    </div>
                    {user.faction && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-card-hover border border-card-border/50">
                            <MapPin size={14} />
                            {user.faction}
                        </div>
                    )}
                </div>
            </div>

            <div className="divide-y divide-card-border">
                <div className="p-4 font-bold text-lg border-b border-card-border">Posts</div>
                {posts && posts.length > 0 ? (
                    posts.map((post: any) => <PostCard key={post.id} post={post} />)
                ) : (
                    <div className="p-8 text-center text-muted-foreground">No posts yet.</div>
                )}
            </div>
        </div>
    );
}
