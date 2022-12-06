require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: '@antfu',
  'no-console': 'off',
  root: true,
  extends: ['plugin:vue/vue3-essential', '@vue/eslint-config-airbnb']
};
