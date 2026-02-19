"use client";

import { useState } from 'react';
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function CreatePost() {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: "user_Guest", // Temporary hardcoded user
                    handle: "guest_user",
                    display_name: "Guest User",
                    avatar: "",
                    content,
                    platform: 'x'
                })
            });

            if (res.ok) {
                setContent("");
                // Invalidate feed query to show new post
                queryClient.invalidateQueries({ queryKey: ['social-feed'] });
            }
        } catch (error) {
            console.error("Failed to post:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 border-b border-card-border">
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                        G
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's happening in S2200?"
                            className="w-full bg-transparent outline-none resize-none text-lg placeholder:text-muted-foreground min-h-[50px]"
                            rows={2}
                        />
                        <div className="flex justify-between items-center mt-2 border-t border-card-border/50 pt-2">
                            <div className="flex gap-2 text-primary">
                                <button type="button" className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                                    <ImageIcon size={20} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!content.trim() || isLoading}
                                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 py-1.5 rounded-full font-bold transition-all flex items-center gap-2"
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
