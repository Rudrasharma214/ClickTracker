export interface Url {
    _id: string;
    userId: string;
    longUrl: string;
    shortCode: string;
    customAlias?: string;
    totalClicks: number;
    isActive: boolean;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UrlClick {
    _id: string;
    urlId: string;
    userId: string;
    ipAddress: string;
    country: string;
    region: string;
    city: string;
    deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
    browser: string;
    os: string;
    userAgent: string;
    referrer: string;
    sessionHash: string;
    clickedAt: string;
}

export interface ShortenPayload {
    longUrl: string;
    customAlias?: string;
    expiresAt?: string;
}

export interface UpdateUrlPayload {
    customAlias?: string;
    isActive?: boolean;
    expiresAt?: string;
}

export interface UrlsQueryParams {
    limit?: number;
    skip?: number;
    isActive?: boolean;
}
