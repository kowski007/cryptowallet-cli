/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Allow importing from src directory
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
