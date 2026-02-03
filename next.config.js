import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', //  increase as needed
    },
  },
  images: {
    unoptimized: true,    // allow next image tag to display images
    remotePatterns: [
      {
        // Allow images from your local server
        hostname: 'localhost',
        protocol: 'http',
      },
      {
        // Allow images from your IP (if needed)
        hostname: '192.168.15.53',
        protocol: 'http',
      },
      {
        hostname: '192.168.15.66',
        protocol: 'http',
      },
      // Add your production domain when ready
      //  {
      //    hostname: 'hssnl.vaves.app',
      //    protocol: 'https',
      //  },
      // {
      //   hostname: 'master.d2jkgcwd5y5if.amplifyapp.com',
      //   protocol: 'https',
      // }
    ],
  },
  // images: {
  //   remotePatterns: [
  //     ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
  //       const url = new URL(item)

  //       return {
  //         hostname: url.hostname,
  //         protocol: url.protocol.replace(':', ''),
  //       }
  //     }),
  //   ],
  // },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
