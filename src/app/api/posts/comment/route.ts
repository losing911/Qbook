import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, post_id, content } = body;

        if (!user_id || !post_id || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Insert Comment
        await pool.query(
            `INSERT INTO comments (post_id, user_id, content, timestamp) VALUES (?, ?, ?, NOW())`,
            [post_id, user_id, content]
        );

        // Update Post Comment Count
        await pool.query(`UPDATE posts SET comments = comments + 1 WHERE id = ?`, [post_id]);

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error) {
        console.error("Comment Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
