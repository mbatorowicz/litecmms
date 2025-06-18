/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    typedRoutes: true,
  },

  // External packages
  serverExternalPackages: ['@prisma/client'],

  // TypeScript configuration
  typescript: {
    // !! WARN !! Dangerously allow production builds to successfully complete even if your project has type errors.
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Images optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
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
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Add source maps in development
    if (dev) {
      config.devtool = 'cheap-module-source-map';
    }

    return config;
  },
};

module.exports = nextConfig; 