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
  },
}

module.exports = nextConfig
