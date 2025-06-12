/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: false,
  },
  experimental: {
    // Disable some experimental features that might cause issues
    esmExternals: 'loose',
  },
  // Handle image optimization
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig