/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false,
      tls: false,
      dns: false,
    };
    return config;
  },
  env: {
    NEXT_HOST_URL: process.env.HOST_URL,
    NEXT_DB_USER: process.env.DB_USER,
    NEXT_DB_HOST: process.env.DB_HOST,
    NEXT_DB_NAME: process.env.DB_NAME,
    NEXT_DB_PASS: process.env.DB_PASS,
    NEXT_DB_PORT: process.env.DB_PORT,
  },
}

export default nextConfig;
