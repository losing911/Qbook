"use client";

import { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractionProps {
    postId: string;
    metrics: {
        likes: number;
        comments: number;
        shares: number;
    };
    currentUserId?: string; // To check if liked
}

export function PostInteraction({ postId, metrics, currentUserId }: InteractionProps) {
    const [likes, setLikes] = useState(metrics.likes);
    const [liked, setLiked] = useState(false); // Valid for session only for now

    const handleInteract = async (type: 'like' | 'repost' | 'share') => {
        // Optimistic UI
        if (type === 'like') {
            setLiked(!liked);
            setLikes(prev => liked ? prev - 1 : prev + 1);
        }

        try {
            await fetch('/api/posts/interact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserId || 'guest_user', // Fallback for now
                    post_id: postId,
                    type
                })
            });
        } catch (e) {
            console.error("Interaction failed", e);
            // Revert on fail
            if (type === 'like') {
                setLiked(!liked);
                setLikes(prev => liked ? prev + 1 : prev - 1);
            }
        }
    };

    return (
        <div className="flex items-center justify-between mt-3 text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-primary transition-colors group">
                <MessageCircle size={18} className="group-hover:bg-primary/10 p-1 rounded-full box-content" />
                <span className="text-xs">{metrics.comments}</span>
            </button>

            <button
                onClick={() => handleInteract('repost')}
                className="flex items-center gap-1 hover:text-green-400 transition-colors group"
            >
                <Repeat size={18} className="group-hover:bg-green-400/10 p-1 rounded-full box-content" />
                <span className="text-xs">{metrics.shares}</span>
            </button>

            <button
                onClick={() => handleInteract('like')}
                className={cn(
                    "flex items-center gap-1 transition-colors group",
                    liked ? "text-red-500" : "hover:text-red-500"
                )}
            >
                <Heart
                    size={18}
                    className={cn("group-hover:bg-red-500/10 p-1 rounded-full box-content", liked && "fill-current")}
                />
                <span className="text-xs">{likes}</span>
            </button>

            <button
                onClick={() => handleInteract('share')}
                className="flex items-center gap-1 hover:text-blue-400 transition-colors group"
            >
                <Share2 size={18} className="group-hover:bg-blue-400/10 p-1 rounded-full box-content" />
            </button>
        </div>
    );
}
