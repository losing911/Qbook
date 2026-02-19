"use client";

import { useMemo } from 'react';
import { SocialPost } from '@/lib/types';
import { Heart, MessageCircle, Repeat2, Share2, MoreHorizontal, ShieldAlert, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface PostCardProps {
    post: SocialPost;
}

export function PostCard({ post }: PostCardProps) {
    // Determine role color/icon
    const roleBadge = useMemo(() => {
        switch (post.author_type) {
            case 'influencer': return { color: 'text-yellow-400', icon: Zap, label: 'Influencer' };
            case 'troll': return { color: 'text-red-500', icon: ShieldAlert, label: 'Troll' };
            case 'bot': return { color: 'text-blue-500', icon: Zap, label: 'Bot' };
            case 'faction': return { color: 'text-purple-500', icon: ShieldAlert, label: 'Faction' };
            case 'citizen': return { color: 'text-gray-400', icon: User, label: 'Citizen' };
            default: return { color: 'text-gray-400', icon: User, label: 'User' };
        }
    }, [post.author_type]);

    const RoleIcon = roleBadge.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-card-border hover:bg-card-hover transition-colors cursor-pointer"
        >

            <div className="flex gap-4">
                {/* Avatar */}
                <div className="shrink-0 relative">
                    {post.author_avatar ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-card-border">
                            <img
                                src={post.author_avatar}
                                alt={post.author_name || 'User'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center bg-card-border", roleBadge.color)}>
                            <RoleIcon size={20} />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-bold text-foreground truncate">
                                {post.author_name || post.author_type.toUpperCase()}
                            </span>
                            <span className="text-muted-foreground text-sm truncate">
                                {post.author_handle || `@${post.id.split('_')[1] || 'user'}`}
                            </span>
                            <span className={clsx("text-[10px] px-1 py-0.5 rounded opacity-50 uppercase border border-current", roleBadge.color)}>
                                {post.author_type}
                            </span>
                            <span className="text-muted-foreground text-sm flex-shrink-0">· {post.timestamp}</span>
                        </div>
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mt-1 text-base text-foreground/90 whitespace-pre-wrap">
                        {post.platform === 'x' ? post.content : post.caption}
                    </div>

                    {/* Insta Image Placeholder */}
                    {post.platform === 'insta' && (
                        <div className="mt-3 rounded-xl overflow-hidden bg-muted/20 border border-card-border relative aspect-video flex items-center justify-center">
                            <span className="text-muted-foreground text-sm italic p-4 text-center">
                                [Image: {post.image_prompt}]
                                <br />
                                <span className="text-xs text-primary/50 mt-1 block">Filter: {post.filter}</span>
                            </span>
                        </div>
                    )}

                    {/* Hashtags */}
                    {post.hashtags && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {post.hashtags.map(tag => (
                                <span key={tag} className="text-primary text-sm hover:underline">{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-3 flex justify-between items-center text-muted-foreground max-w-md">
                        <button className="group flex items-center gap-2 hover:text-primary transition-colors text-sm">
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <MessageCircle size={18} />
                            </div>
                            <span>{post.engagement.comments}</span>
                        </button>

                        <button className="group flex items-center gap-2 hover:text-green-500 transition-colors text-sm">
                            <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                                <Repeat2 size={18} />
                            </div>
                            <span>{post.engagement.shares}</span>
                        </button>

                        <button className="group flex items-center gap-2 hover:text-accent transition-colors text-sm">
                            <div className="p-2 rounded-full group-hover:bg-accent/10 transition-colors">
                                <Heart size={18} />
                            </div>
                            <span>{post.engagement.likes}</span>
                        </button>

                        <button className="group flex items-center gap-2 hover:text-primary transition-colors text-sm">
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <Share2 size={18} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
