import { SocialFeed } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://anxipunk.icu/api';

export async function fetchSocialFeed(platform: 'x' | 'insta' = 'x'): Promise<SocialFeed> {
    try {
        // The remote API only has /social, so we fetch that and filter client-side
        const res = await fetch(`${API_BASE_URL}/social`);
        if (!res.ok) {
            throw new Error(`Failed to fetch feed: ${res.statusText}`);
        }

        const data = await res.json();

        // Handle "initializing" status or raw list
        if (data.status === 'initializing') {
            return {
                status: "initializing",
                timestamp: new Date().toISOString(),
                tick: 0,
                data: []
            };
        }

        // Filter by platform if data exists and is an array
        if (data.data && Array.isArray(data.data)) {
            const mapped = data.data.map((p: any) => ({
                ...p,
                platform: p.platform || 'x',
                author_type: p.author_type || p.author_role || 'citizen',
                engagement: p.metrics || { likes: 0, comments: 0, shares: 0, views: 0 }
            }));
            const filtered = mapped.filter((p: any) => p.platform === platform);
            return {
                ...data,
                data: filtered
            };
        }

        return data; // Fallback
    } catch (error) {
        console.error("API Error:", error);
        return {
            status: "error",
            timestamp: new Date().toISOString(),
            tick: 0,
            data: []
        };
    }
}
