/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fantastic-breaks/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/fantastic-breaks' : '',
}

export default nextConfig
