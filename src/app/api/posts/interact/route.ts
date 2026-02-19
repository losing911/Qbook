import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, post_id, type } = body; // type: 'like', 'repost', 'share'

        if (!user_id || !post_id || !['like', 'repost', 'share'].includes(type)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        // Check if interaction already exists
        const [existing]: any = await pool.query(
            `SELECT id FROM interactions WHERE user_id = ? AND post_id = ? AND type = ?`,
            [user_id, post_id, type]
        );

        if (existing.length > 0) {
            // OPTIONAL: Toggle like (remove if exists)
            if (type === 'like') {
                await pool.query(`DELETE FROM interactions WHERE id = ?`, [existing[0].id]);
                await pool.query(`UPDATE posts SET likes = likes - 1 WHERE id = ?`, [post_id]);
                return NextResponse.json({ success: true, action: 'removed' });
            }
            return NextResponse.json({ success: true, action: 'exists' });
        }

        // Record interaction
        await pool.query(
            `INSERT INTO interactions (user_id, post_id, type) VALUES (?, ?, ?)`,
            [user_id, post_id, type]
        );

        // Update post counters
        let column = 'likes';
        if (type === 'repost') column = 'shares'; // simplistic mapping
        if (type === 'share') column = 'shares';

        await pool.query(`UPDATE posts SET ${column} = ${column} + 1 WHERE id = ?`, [post_id]);

        return NextResponse.json({ success: true, action: 'added' });

    } catch (error) {
        console.error("Interaction Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
