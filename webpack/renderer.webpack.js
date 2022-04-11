const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@root': path.resolve(__dirname, '../src'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@views': path.resolve(__dirname, '../src/views'),
      '@router': path.resolve(__dirname, '../src/router'),
      '@styles': path.resolve(__dirname, '../src/styles'),
    },
  },
  module: {
    rules: require('./rules.webpack'),
  },
}
