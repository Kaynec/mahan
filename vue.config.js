module.exports = {
  pwa: {
    name: 'Mahan Application',
    themeColor: '#4A4ADF',
    backgroundColor: '#fff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOption: {},
    swDest: './dist/service-worker.js',
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
              statuses: [0, 200, 300]
            }
          }
        },
        {
          urlPattern:
            'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'ion-icons'
          }
        },
        {
          urlPattern:
            'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.3.0/css/flag-icon.min.css',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'flag icons'
          }
        },
        {
          urlPattern:
            'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'google fonts'
          }
        }
      ]
    },
    workboxPluginMode: 'GenerateSW'
  },
  configureWebpack: {
    plugins: [
      require('unplugin-auto-import/webpack')({
        dirs: ['src/mixins'],
        vueTemplate: true
      })
    ]
  }
};
