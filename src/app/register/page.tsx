"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            login(data.user);
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-card-border">
                <h2 className="text-3xl font-bold text-center text-secondary">Join QBook</h2>
                {error && <div className="text-red-500 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full bg-background border border-muted rounded-md p-2 focus:border-secondary outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full bg-background border border-muted rounded-md p-2 focus:border-secondary outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-secondary text-white font-bold py-2 rounded-md hover:bg-secondary/90 transition-colors"
                    >
                        Register
                    </button>
                </form>
                <div className="text-center text-sm">
                    Already have an account? <Link href="/login" className="text-secondary hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
}
