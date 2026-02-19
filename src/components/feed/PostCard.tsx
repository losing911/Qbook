"use client";

import { useMemo } from 'react';
import { SocialPost } from '@/lib/types';
import { ShieldAlert, Zap, User, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import Link from 'next/link';
import { PostInteraction } from './PostInteraction';

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
    const authorHandle = post.author_handle || post.id.split('_')[1] || 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-card-border hover:bg-card-hover transition-colors"
        >

            <div className="flex gap-4">
                {/* Avatar */}
                <Link href={`/profile/${authorHandle}`} className="shrink-0 relative cursor-pointer">
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
                </Link>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Link href={`/profile/${authorHandle}`} className="font-bold text-foreground truncate hover:underline cursor-pointer">
                                {post.author_name || post.author_type.toUpperCase()}
                            </Link>
                            <span className="text-muted-foreground text-sm truncate">
                                @{authorHandle}
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
                    <PostInteraction postId={post.id} metrics={post.engagement} />
                </div>
            </div>
        </motion.div>
    );
}
