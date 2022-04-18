const path = require('path')

module.exports = [
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.(js|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  },
  {
    test: /\.(css|less)$/,
    use: [
      'cache-loader',
      'style-loader',
      'css-loader',
      'postcss-loader',
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    ],
  },
  {
    test: /\.(png|jpe?g|gif)$/i,
    include: [path.resolve(__dirname, '../src')],
    type: 'asset',
    generator: {
      filename: 'images/[name].[hash:8][ext]', // 局部指定输出位置
    },
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024, // 限制于 8kb
      },
    },
  },
  {
    test: /\.(mp3|ogg|html|xlsx|xls|ico)$/,
    include: [path.resolve(__dirname, '../src')],
    type: 'asset/resource',
    generator: {
      filename: 'file/[name].[hash:8][ext]', // 局部指定输出位置
    },
  },
  {
    test: /\.(svg)$/,
    include: [path.resolve(__dirname, '../src')],
    use: [
      {
        loader: 'svg-sprite-loader',
      },
      {
        loader: 'svgo-loader'
      },
    ],
    /* type: 'asset/resource',
    generator: {
      filename: 'file/[name].[hash:8][ext]', // 局部指定输出位置
    }, */
  },
]
