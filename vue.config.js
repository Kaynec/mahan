const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()],
    module: {
      rules: [{ sideEffects: false }]
    },
    performance: {
      hints: false
    },
    //
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
  }
};
