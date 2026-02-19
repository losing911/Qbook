import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const platform = url.searchParams.get('platform') || 'x';

        // Fetch posts from DB
        const [posts]: any = await pool.query(
            `SELECT p.*, u.handle as author_handle, u.display_name as author_name, u.avatar as author_avatar, u.role as author_type 
             FROM posts p 
             JOIN users u ON p.user_id = u.id 
             WHERE p.platform = ? 
             ORDER BY p.timestamp DESC 
             LIMIT 50`,
            [platform]
        );

        const formatted = posts.map((p: any) => ({
            id: p.id,
            platform: p.platform,
            author_type: p.author_type,
            content: p.content,
            image_prompt: p.image_prompt,
            timestamp: p.timestamp,
            engagement: {
                likes: p.likes,
                comments: p.comments,
                shares: p.shares
            },
            author_handle: p.author_handle,
            author_name: p.author_name,
            author_avatar: p.author_avatar,
            is_local: true // Marker to distinguish fram remote sim posts
        }));

        return NextResponse.json({ posts: formatted });

    } catch (error) {
        console.error("Local Feed Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
