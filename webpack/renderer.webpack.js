const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@root': path.resolve(__dirname, '../src'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@layout': path.resolve(__dirname, '../src/layout'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@views': path.resolve(__dirname, '../src/views'),
      '@router': path.resolve(__dirname, '../src/router'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@config': path.resolve(__dirname, '../config'),
      '@imgs': path.resolve(__dirname, '../src/static/imgs'),
      '@icons': path.resolve(__dirname, '../src/static/icons'),
      '@constants': path.resolve(__dirname, '../src/constants'),
      '@mytypes': path.resolve(__dirname, '../src/types'),
    },
  },
  module: {
    rules: require('./rules.webpack'),
  },
}
