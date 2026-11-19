import { getRequestOrigin, isAllowedOrigin } from './security';

// Set CORS headers for api calls
export function setCorsHeaders(req, res) {
    const origin = getRequestOrigin(req);
    
    // Check if origin is allowed
    if (isAllowedOrigin(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    const vary = res.getHeader('Vary');
    res.setHeader('Vary', vary ? `${vary}, Origin` : 'Origin');
}

// Handle method OPTIONS
export function handleCorsPreFlight(req, res) {
    if (req.method === 'OPTIONS') {
        setCorsHeaders(req, res);

        res.status(200).end();

        return true;
    }

    return false;
}

// Use CORS
export function withCors(handler) {
    return async (req, res) => {
        // Set CORS headers
        setCorsHeaders(req, res);
        
        // Handle preflight
        if (handleCorsPreFlight(req, res)) {
            return;
        }
        
        // Call the original handler
        return handler(req, res);
    };
}