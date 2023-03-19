module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry: './electron/main.ts',
  module: {
    rules: require('./rules.webpack'),
  },
  devServer: {
    proxy:{
      '/api': {
        target: 'http://localhost:3003',
        pathRewrite: {'^/api' : '/'},
        changeOrigin: true
      }
    }
  }
}
