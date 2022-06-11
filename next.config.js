/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    MONGO_URI: "mongodb+srv://kabir:r9!a-QwbnDQfgDD@main.jdrxb.mongodb.net/gov-project?retryWrites=true&w=majority"
  },
  pwa: {
    dest: "public",
    importScripts: ['/worker-development.js']
  }
})

module.exports = nextConfig
