import { SocialFeed } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://anxipunk.icu/api';

export async function fetchSocialFeed(platform: 'x' | 'insta' = 'x'): Promise<SocialFeed> {
    try {
        // 1. Fetch Remote Feed (Simulation)
        const remotePromise = fetch(`${API_BASE_URL}/social`).then(r => r.ok ? r.json() : null).catch(() => null);

        // 2. Fetch Local Feed (DB)
        // Only works if running in browser/client or if absolute URL used. 
        // For server-side, we might need absolute URL, but this runs on client mostly.
        const localPromise = fetch(`/api/feed?platform=${platform}`).then(r => r.ok ? r.json() : { posts: [] }).catch(() => ({ posts: [] }));

        const [remoteData, localData] = await Promise.all([remotePromise, localPromise]);

        let combinedPosts: any[] = [];

        // Process Remote
        if (remoteData && remoteData.data && Array.isArray(remoteData.data)) {
            const mapped = remoteData.data.map((p: any) => ({
                ...p,
                platform: p.platform || 'x',
                author_type: p.author_type || p.author_role || 'citizen',
                engagement: p.metrics || { likes: 0, comments: 0, shares: 0, views: 0 },
                is_local: false
            }));
            combinedPosts = [...combinedPosts, ...mapped.filter((p: any) => p.platform === platform)];
        }

        // Process Local
        if (localData && localData.posts) {
            combinedPosts = [...combinedPosts, ...localData.posts];
        }

        // Sort by timestamp desc (Naive string comparison works for ISO, but local might differ)
        // Ensure timestamp format consistency if possible.
        combinedPosts.sort((a, b) => {
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            return timeB - timeA; // Descending
        });

        return {
            status: "active",
            timestamp: new Date().toISOString(),
            tick: remoteData?.tick || 0,
            data: combinedPosts
        };

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
