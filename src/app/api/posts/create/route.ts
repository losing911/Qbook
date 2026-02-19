import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, handle, display_name, avatar, content, platform, image_prompt } = body;

        if (!user_id || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const postId = uuidv4();

        // 1. Ensure user exists (upsert)
        await pool.query(
            `INSERT INTO users (id, handle, display_name, avatar) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), avatar = VALUES(avatar)`,
            [user_id, handle, display_name, avatar]
        );

        // 2. Insert Post
        await pool.query(
            `INSERT INTO posts (id, user_id, content, image_prompt, platform, timestamp) 
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [postId, user_id, content, image_prompt, platform || 'x']
        );

        return NextResponse.json({ success: true, post_id: postId }, { status: 201 });

    } catch (error) {
        console.error("Create Post Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
