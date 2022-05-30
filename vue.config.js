module.exports = {
  configureWebpack: {
    css: {
      extract: true
    },
    module: {
      rules: [{ sideEffects: false }]
    },
    performance: {
      hints: false
    }
  }
};
