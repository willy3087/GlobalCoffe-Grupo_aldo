/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ['@chakra-ui/react', '@chakra-ui/icons'],
}

module.exports = nextConfig