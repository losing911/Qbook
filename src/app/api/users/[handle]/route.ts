import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { fetchSocialFeed } from '@/lib/api';

export async function GET(req: NextRequest, { params }: { params: Promise<{ handle: string }> }) {
    try {
        const { handle } = await params;

        // 1. Fetch Local User
        const [users]: any = await pool.query(
            `SELECT * FROM users WHERE handle = ?`,
            [handle]
        );

        let user = users.length > 0 ? users[0] : null;
        let posts: any[] = [];
        let isVirtual = false;

        // 2. Local User Found
        if (user) {
            const [localPosts]: any = await pool.query(
                `SELECT * FROM posts WHERE user_id = ? ORDER BY timestamp DESC`,
                [user.id]
            );
            posts = localPosts.map((p: any) => ({ ...p, is_local: true }));
        }
        // 3. Not in DB? Try Simulation / Remote Feed
        else {
            console.log(`User ${handle} not in DB, checking remote feed...`);
            const feed = await fetchSocialFeed('x'); // Fetch remote feed

            // Find posts by this handle
            const userPosts = feed.data.filter((p: any) =>
                (p.author_handle === handle) ||
                (p.author_handle === `@${handle}`) ||
                (p.id.includes(handle)) // fallback for id-based handles
            );

            if (userPosts.length > 0) {
                // Construct a "Virtual" Profile from the first post found
                const sample = userPosts[0];
                user = {
                    id: sample.author_id || `sim_${handle}`,
                    handle: handle,
                    display_name: sample.author_name || handle,
                    avatar: sample.author_avatar || sample.avatar,
                    role: sample.author_type || 'citizen',
                    bio: "Universe 2200 Resident (Simulated Identity)",
                    faction: "Unknown",
                    stats: { followers: Math.floor(Math.random() * 5000), following: Math.floor(Math.random() * 500) }
                };
                posts = userPosts;
                isVirtual = true;
            }
        }

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch Follow Stats (Only real DB for now, virtual has random)
        let stats = user.stats;
        if (!isVirtual) {
            const [dbStats]: any = await pool.query(
                `SELECT 
                    (SELECT COUNT(*) FROM follows WHERE following_id = ?) as followers,
                    (SELECT COUNT(*) FROM follows WHERE follower_id = ?) as following
                `,
                [user.id, user.id]
            );
            stats = dbStats[0];
        }

        return NextResponse.json({
            user: { ...user, stats },
            posts: posts.map((p: any) => ({
                ...p,
                engagement: p.engagement || {
                    likes: p.likes || 0,
                    comments: p.comments || 0,
                    shares: p.shares || 0
                },
                author_handle: user.handle,
                author_name: user.display_name,
                author_avatar: user.avatar,
                author_type: user.role
            }))
        });

    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
