import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/f/**',
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                port: '',
                pathname: '/**',
            },
        ],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60,
    },
    experimental: {
        optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    },
    poweredByHeader: false,
    reactStrictMode: true,
};

export default nextConfig;
