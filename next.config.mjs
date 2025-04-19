import nextMDX from '@next/mdx'

import { recmaPlugins } from './mdx/recma.mjs'
import { rehypePlugins } from './mdx/rehype.mjs'
import { remarkPlugins } from './mdx/remark.mjs'

import withSearch from './mdx/search.mjs'

import withPWA from 'next-pwa';

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: 'wordpress.local',
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: 'localhost',
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: 'docker-image-production-5350.up.railway.app',
        port: "",
        pathname: "/**",
      }
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development"
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx']
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(withSearch(withMDX(nextConfig)));