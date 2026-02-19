import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
        }

        // Check if user exists
        const users = await query('SELECT id FROM users WHERE username = ?', [username]) as any[];
        if (users.length > 0) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        // Create user
        const result = await query(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
            [username, hashedPassword, 'citizen']
        ) as any;

        return NextResponse.json({
            user: { id: result.insertId, username, role: 'citizen' }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
