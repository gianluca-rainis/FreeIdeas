// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'https://freeideas.vercel.app',
    'https://freeideas.duckdns.org',
    'http://localhost:3000',
];

// Set CORS headers for api calls
export function setCorsHeaders(req, res) {
    const origin = req.headers.origin;
    
    // Check if origin is allowed
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
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