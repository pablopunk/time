module.exports = {
  async rewrites() {
    return [
      {
        source: '/goat',
        destination: 'https://time.pablopunk.com/count',
        locale: false,
      },
      {
        source: '/count.js',
        destination: 'https://gc.zgo.at/count.js',
        locale: false,
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
