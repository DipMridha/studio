import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [], // Keep empty if only using remotePatterns and data URIs
    // Allow data URIs
    unoptimized: false, // Keep optimization for other images
    // This configuration is often needed for data URIs, but next/image handles them somewhat automatically.
    // If issues arise, specific loader configurations might be needed.
    // For now, we assume default handling is sufficient.
    // The `generateAiImage` flow outputs a data: URI.
  },
};

export default nextConfig;
