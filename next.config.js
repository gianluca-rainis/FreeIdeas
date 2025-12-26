/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '', // No prefixs
    trailingSlash: false,
    allowedHosts: ['freeideas.duckdns.org'],
    
    // Asset optimization
    images: {
        unoptimized: true, // Temp
    },
    
    // Server config
    async rewrites() {
        return [
            // Proxy for PHP API
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
            },
            // Proxy for PHP assets
            {
                source: '/images/:path*', 
                destination: 'http://localhost:8000/images/:path*',
            },
            {
                source: '/styles/:path*',
                destination: 'http://localhost:8000/styles/:path*', 
            }
        ];
    },
}

module.exports = nextConfig