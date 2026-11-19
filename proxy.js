import { NextResponse } from 'next/server';
import { allowRequest, isAllowedOrigin } from './lib/security';

export function proxy(request) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    let requestOrigin = origin;

    if (!requestOrigin && referer) {
        try {
            requestOrigin = new URL(referer).origin;
        } catch {
            requestOrigin = null;
        }
    }

    const isTrustedOrigin = isAllowedOrigin(requestOrigin);
    const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);

    if (isMutation && !isTrustedOrigin) {
        return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
    }

    const clientIp = request.headers.get('x-real-ip')
        || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || 'unknown';

    const pathname = request.nextUrl.pathname;
    const isUpload = /\/api\/(saveNewIdea|updateOldIdea|modifyIdeaInfoAdmin|modifyAccountInfo)$/.test(pathname);
    const rateLimit = isUpload ? 15 : 180;
    const rateLimitWindow = isUpload ? 60 * 1000 : 60 * 1000;

    if (isMutation && !allowRequest(`api:${clientIp}`, rateLimit, rateLimitWindow)) {
        return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    const response = NextResponse.next();
    const existingVary = response.headers.get('Vary');
    response.headers.set('Vary', existingVary ? `${existingVary}, Origin` : 'Origin');

    if (isTrustedOrigin && requestOrigin) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    }

    if (request.method === 'OPTIONS') {
        if (!isTrustedOrigin) {
            return NextResponse.json({ success: false, error: 'Invalid request origin' }, { status: 403 });
        }

        return new NextResponse(null, {
            status: 204,
            headers: response.headers
        });
    }
    
    return response;
}

// Use only for API
export const config = {
    matcher: '/api/:path*',
};