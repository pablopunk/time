module.exports = {
  async rewrites() {
    return [
      {
        source: '/goat',
        destination: 'https://time.pablopunk.com/count',
      },
      {
        source: '/count.js',
        destination: 'https://gc.zgo.at/count.js',
      },
    ]
  },
}
