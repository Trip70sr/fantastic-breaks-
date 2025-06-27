/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable experimental features if needed
  },
  images: {
    domains: [
      // Add any external image domains you might use
      'localhost',
    ],
    unoptimized: true,
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize for production
  swcMinify: true,
  
  // Environment variables that should be available on the client side
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects for better UX
  async redirects() {
    return [
      // Add any redirects you need
    ]
  },
  
  // Rewrites for API routes or other purposes
  async rewrites() {
    return [
      // Add any rewrites you need
    ]
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
