/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '', // No prefixs
    trailingSlash: false,
    
    // Asset optimization
    images: {
        unoptimized: true, // Temp
    }
}

module.exports = nextConfig