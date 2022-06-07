module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-auto-import/webpack')({
        dirs: ['src/mixins'],
        vueTemplate: true
      })
    ],
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
