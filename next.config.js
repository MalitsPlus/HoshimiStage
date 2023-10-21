/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'idoly-assets-curator.vercel.app',
        port: '',
        pathname: '/api/img/**',
      },
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              connect-src 'self' hoshimi-backend.vibbit.me *.googleapis.com *.google-analytics.com;
              img-src 'self' blob: data: idoly-assets-curator.vercel.app res.cloudinary.com
            `.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
