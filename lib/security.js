const productionOrigins = [
    'https://freeideas.pro',
    'https://www.freeideas.pro',
    'https://api.freeideas.pro',
    'https://freeideas.vercel.app',
    'https://freeideas.duckdns.org',
];

const requestCounts = new Map();

export function isAllowedOrigin(origin) {
    if (productionOrigins.includes(origin)) {
        return true;
    }

    return process.env.NODE_ENV !== 'production' && origin === 'http://localhost:3000';
}

export function getRequestOrigin(req) {
    const origin = req.headers.origin;

    if (origin) {
        return origin;
    }

    const referer = req.headers.referer;

    if (referer) {
        try {
            return new URL(referer).origin;
        } catch {
            return null;
        }
    }

    return null;
}

export function isValidHttpUrl(value) {
    if (typeof value !== 'string' || value.length === 0 || value.length > 2048) {
        return false;
    }

    try {
        const url = new URL(value);
        return (url.protocol === 'http:' || url.protocol === 'https:') && !url.username && !url.password;
    } catch {
        return false;
    }
}

export function isPositiveIntegerId(value) {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0;
}

export function escapeLikeValue(value) {
    return String(value).replace(/[\\%_]/g, character => `\\${character}`);
}

export function validateUsername(value) {
    return typeof value === 'string' && /^[A-Za-z0-9_.-]{3,30}$/.test(value);
}

export function validateEmail(value) {
    return typeof value === 'string'
        && value.length <= 254
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validatePassword(value) {
    return typeof value === 'string'
        && value.length >= 12
        && new TextEncoder().encode(value).length <= 72;
}

export function validateTextList(values, maxItems, maxLength) {
    return Array.isArray(values)
        && values.length <= maxItems
        && values.every(value => typeof value === 'string' && value.length <= maxLength);
}

export function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character]);
}

export function allowRequest(key, limit, windowMs) {
    const now = Date.now();
    let requestCount = requestCounts.get(key);

    if (!requestCount || requestCount.resetAt <= now) {
        requestCount = { count: 0, resetAt: now + windowMs };
    }

    if (requestCount.count >= limit) {
        return false;
    }

    requestCount.count++;
    requestCounts.set(key, requestCount);

    if (requestCounts.size > 5000) {
        for (const [requestKey, entry] of requestCounts) {
            if (entry.resetAt <= now) {
                requestCounts.delete(requestKey);
            }
        }
    }

    return true;
}

export function getClientIp(req) {
    return req.headers['x-real-ip']
        || req.socket?.remoteAddress
        || req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || 'unknown';
}
