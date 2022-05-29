module.exports = {
  configureWebpack: {
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
