"use client";

import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
    return (
        <div className="flex-1 border-r border-card-border min-h-screen pb-20 md:pb-0">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-card-border p-4">
                <h1 className="text-xl font-bold">Bookmarks</h1>
                <div className="text-sm text-muted-foreground">@user_handle</div>
            </div>

            <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="bg-secondary/10 p-4 rounded-full mb-4">
                    <Bookmark size={48} className="text-secondary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Save posts for later</h2>
                <p className="text-muted-foreground max-w-sm">
                    Bookmark posts to easily find them again in the future.
                </p>
            </div>
        </div>
    );
}
