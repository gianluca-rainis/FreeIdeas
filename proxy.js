import { NextResponse } from 'next/server';

export function proxy(request) {
    const origin = request.headers.get('origin');
    
    const allowedOrigins = [
        'https://freeideas.pro',
        'https://www.freeideas.pro',
        'https://api.freeideas.pro',
        'https://freeideas.vercel.app',
        'https://freeideas.duckdns.org',
        'http://localhost:3000',
    ];
    
    const response = NextResponse.next();
    
    // Add CORS if origin is allowed
    if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    }
    
    // Handle method OPTIONS
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, { 
            status: 200, 
            headers: response.headers 
        });
    }
    
    return response;
}

// Use only for API
export const config = {
    matcher: '/api/:path*',
};