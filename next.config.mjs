/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Normalize double-slash at root (middleware handles the general case)
      { source: '//', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
