/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_HOST_URL: process.env.HOST_URL,
  }
}

export default nextConfig;
