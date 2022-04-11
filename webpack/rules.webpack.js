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
    test: /\.less$/,
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
]
