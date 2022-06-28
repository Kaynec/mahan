module.exports = {
  devServer: {
    https: true,
  },
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
  }
};
