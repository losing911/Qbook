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

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const post_id = searchParams.get('post_id');

        if (!post_id) {
            return NextResponse.json({ error: "Post ID required" }, { status: 400 });
        }

        const [comments]: any = await pool.query(
            `SELECT c.*, u.handle, u.display_name, u.avatar 
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = ?
             ORDER BY c.timestamp ASC`,
            [post_id]
        );

        return NextResponse.json({ comments });

    } catch (error) {
        console.error("Fetch Comments Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
