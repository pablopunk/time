const path = require('path')

module.exports = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  async rewrites() {
    return [
      {
        source: '/goat',
        destination: 'https://time.goatcounter.com/count',
        locale: false,
      },
      {
        source: '/count.js',
        destination: 'https://gc.zgo.at/count.js',
        locale: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'",
          },
        ],
      },
    ]
  },
}
