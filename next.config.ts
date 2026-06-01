import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Compression
  compress: true,

  // Production source maps disabled for better performance
  productionBrowserSourceMaps: false,

  // React strict mode for development
  reactStrictMode: true,

  // SWR config
  swcMinify: true,

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
