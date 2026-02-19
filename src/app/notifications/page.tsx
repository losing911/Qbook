"use client";

import { Bell, Heart, UserPlus, Star } from 'lucide-react';

const NOTIFICATIONS = [
    { id: 1, type: 'like', user: 'cyber_punk_99', content: 'liked your broadcast', time: '2m' },
    { id: 2, type: 'follow', user: 'neon_demon', content: 'followed you', time: '1h' },
    { id: 3, type: 'mention', user: 'corp_shill', content: 'mentioned you in a broadcast', time: '3h' },
    { id: 4, type: 'like', user: 'glitch_zero', content: 'liked your broadcast', time: '5h' },
];

export default function NotificationsPage() {
    return (
        <div className="flex-1 border-r border-card-border min-h-screen pb-20 md:pb-0">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-card-border p-4">
                <h1 className="text-xl font-bold">Notifications</h1>
            </div>

            <div className="divide-y divide-card-border">
                {NOTIFICATIONS.map(notif => (
                    <div key={notif.id} className="p-4 hover:bg-card-hover cursor-pointer transition-colors flex gap-4">
                        <div className="w-8 flex justify-end">
                            {notif.type === 'like' && <Heart className="text-accent fill-accent" size={24} />}
                            {notif.type === 'follow' && <UserPlus className="text-primary fill-primary" size={24} />}
                            {notif.type === 'mention' && <Star className="text-secondary fill-secondary" size={24} />}
                        </div>
                        <div>
                            <div className="flex gap-2 items-center">
                                <div className="w-8 h-8 rounded-full bg-muted/50"></div>
                                <span className="font-bold">{notif.user}</span>
                            </div>
                            <div className="text-muted-foreground mt-1">{notif.content}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
