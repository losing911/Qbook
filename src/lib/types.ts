export interface EngagementMetrics {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
}

export interface SocialPost {
    id: string;
    platform: 'x' | 'insta';
    author_type: string; // 'citizen', 'influencer', 'troll', 'bot', 'faction', 'media'
    content?: string;    // X content
    caption?: string;    // Insta content
    image_prompt?: string; // Insta image
    location?: string;
    filter?: string;
    hashtags?: string[];
    is_thread?: boolean;
    engagement: EngagementMetrics;
    timestamp: string;
    sentiment?: number;
    // New Author Fields
    author_handle?: string;
    author_name?: string;
    author_avatar?: string;
    category?: string;
}

export interface SocialFeed {
    status: string;
    timestamp: string;
    tick: number;
    data: SocialPost[];
}
