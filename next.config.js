/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API: 'http://localhost:3001',
    //API: 'https://auto-tvnow.site',
    baseKeyAPI: 'base64:urCw34KdikDe24rfe@io_i93',
  },
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
