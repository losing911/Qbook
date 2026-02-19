"use client";

import { Mail } from 'lucide-react';

export default function MessagesPage() {
    return (
        <div className="flex-1 border-r border-card-border min-h-screen pb-20 md:pb-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Mail size={48} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to your inbox!</h1>
            <p className="text-muted-foreground max-w-sm mb-8">
                Drop a line, share posts and more with private conversations between you and others on QBook.
            </p>
            <button className="bg-primary text-background font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors">
                Write a message
            </button>
        </div>
    );
}
