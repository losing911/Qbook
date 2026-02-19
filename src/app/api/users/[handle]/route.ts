import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ handle: string }> }) {
    try {
        const { handle } = await params;

        // Fetch User
        const [users]: any = await pool.query(
            `SELECT * FROM users WHERE handle = ?`,
            [handle]
        );

        if (users.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = users[0];

        // Fetch Posts
        const [posts]: any = await pool.query(
            `SELECT * FROM posts WHERE user_id = ? ORDER BY timestamp DESC`,
            [user.id]
        );

        // Fetch Stats
        const [stats]: any = await pool.query(
            `SELECT 
                (SELECT COUNT(*) FROM follows WHERE following_id = ?) as followers,
                (SELECT COUNT(*) FROM follows WHERE follower_id = ?) as following
            `,
            [user.id, user.id]
        );

        return NextResponse.json({
            user: { ...user, stats: stats[0] },
            posts: posts.map((p: any) => ({
                ...p,
                engagement: {
                    likes: p.likes,
                    comments: p.comments,
                    shares: p.shares
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
