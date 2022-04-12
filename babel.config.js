module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'classic',
      },
    ],
  ],
  plugins: [['@babel/plugin-transform-runtime']],
}
