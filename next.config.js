/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath: '',
  assetPrefix: '/',
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
      {
        source: '/404',
        destination: '/404.html',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      }
    ]
  }
};
