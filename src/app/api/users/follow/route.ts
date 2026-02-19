import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { follower_id, following_id, action } = body; // action: 'follow' | 'unfollow'

        if (!follower_id || !following_id || !['follow', 'unfollow'].includes(action)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        if (action === 'follow') {
            await pool.query(
                `INSERT IGNORE INTO follows (follower_id, following_id, timestamp) VALUES (?, ?, NOW())`,
                [follower_id, following_id]
            );
        } else {
            await pool.query(
                `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
                [follower_id, following_id]
            );
        }

        // Get updated counts (optional but helpful)
        const [stats]: any = await pool.query(
            `SELECT COUNT(*) as count FROM follows WHERE following_id = ?`,
            [following_id]
        );

        return NextResponse.json({ success: true, action, followers: stats[0].count });

    } catch (error) {
        console.error("Follow Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
