/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: "postgresql://dev:dev@localhost:5432/dev",
  },
}
module.exports = nextConfig
