/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript:{
    ignoreBuildErrors:true,
  },
  images: {
    domains: [
      "utfs.io"
    ]
  }
}

module.exports = nextConfig
