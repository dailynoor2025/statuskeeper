import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    allowedDevOrigins: [
      '9000-firebase-studio-1776001683837.cluster-lu4mup47g5gm4rtyvhzpwbfadi.cloudworkstations.dev',
      '*.cloudworkstations.dev',
      '*.cluster-lu4mup47g5gm4rtyvhzpwbfadi.cloudworkstations.dev'
    ]
  }
};

export default nextConfig;
