/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    basePath: '', // No prefixs
    trailingSlash: false,
    
    // Asset optimization
    images: {
        unoptimized: true, // Temp
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; base-uri 'self'; connect-src 'self' https: wss:; font-src 'self' data: https:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https: blob:; object-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:" },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ];
    },
}

module.exports = nextConfig