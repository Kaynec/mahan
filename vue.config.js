module.exports = {
  pwa: {

    name: 'Mahan Application',
    themeColor: '#4A4ADF',
    backgroundColor:"#fff",
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxOptions: {
      navigateFallback: '/index.html',
      runtimeCaching: [
        {
          urlPattern: /https:\/\/api.mahanplus.com\/api\//,
          handler: 'NetworkFirst',
          options: {
            networkTimeoutSeconds: 20,
            cacheName: 'api-cache',
            cacheableResponse: {
              statuses: [
                0,
                200,
                300
              ]
            }
          }
        }
      ]
    },
    workboxPluginMode: 'InjectManifest'
  },
  devServer: {
    // https: true,
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
    }
  }
};
