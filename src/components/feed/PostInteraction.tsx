"use client";

import { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [shares, setShares] = useState(metrics.shares);
    const [liked, setLiked] = useState(false);
    const [reposted, setReposted] = useState(false);

    // Comment state
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentCount, setCommentCount] = useState(metrics.comments);

    const handleInteract = async (type: 'like' | 'repost' | 'share') => {
        // Optimistic UI
        if (type === 'like') {
            setLiked(!liked);
            setLikes(prev => liked ? prev - 1 : prev + 1);
        }
        if (type === 'repost') {
            if (reposted) return; // Prevent double repost for now
            setReposted(true);
            setShares(prev => prev + 1);
        }

        try {
            await fetch('/api/posts/interact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserId || 'guest_user',
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
            if (type === 'repost') {
                setReposted(false);
                setShares(prev => prev - 1);
            }
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmittingComment(true);
        try {
            const res = await fetch('/api/posts/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserId || 'guest_user',
                    post_id: postId,
                    content: commentText
                })
            });

            if (res.ok) {
                setCommentText("");
                setShowCommentInput(false);
                setCommentCount(prev => prev + 1);
            }
        } catch (error) {
            console.error("Comment failed", error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mt-3 text-muted-foreground">
                <button
                    onClick={() => setShowCommentInput(!showCommentInput)}
                    className="flex items-center gap-1 hover:text-primary transition-colors group"
                >
                    <MessageCircle size={18} className="group-hover:bg-primary/10 p-1 rounded-full box-content" />
                    <span className="text-xs">{commentCount}</span>
                </button>

                <button
                    onClick={() => handleInteract('repost')}
                    className={cn(
                        "flex items-center gap-1 hover:text-green-400 transition-colors group",
                        reposted && "text-green-400"
                    )}
                >
                    <Repeat size={18} className="group-hover:bg-green-400/10 p-1 rounded-full box-content" />
                    <span className="text-xs">{shares}</span>
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

            {/* Comment Input */}
            <AnimatePresence>
                {showCommentInput && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 overflow-hidden"
                    >
                        <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 bg-muted/30 border border-card-border rounded-full px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={isSubmittingComment || !commentText.trim()}
                                className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50"
                            >
                                <Send size={14} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
