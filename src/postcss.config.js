const purgecss = require('@fullhuman/postcss-purgecss');

// if (process.env.NODE_ENV === 'production') {

// }

plugins.push(
  purgecss({
    content: ['./modules/**/*.vue', './pages/**/*.vue'],
    whitelist: ['html', 'body'],
    whitelistPatternsChildren: [/^token/, /^pre/, /^code/]
  })
);

module.exports = { plugins };
