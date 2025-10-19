/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Normalize exact double-slash root
      { source: '//', destination: '/', permanent: true },

      // Normalize any path ending with a double slash
      { source: '/:path*//', destination: '/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
