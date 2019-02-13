module.exports = {
  rootPath: '../',

  fileMatch: ['**/fixtures/**/*.{ts,tsx}'],

  watchDirs: ['src', 'playground'],
  exclude: [/\.d\.ts$/],

  globalImports: [
    'playground/styles.less',
    'reset.css'
  ],
  webpackConfigPath: 'webpack.config.js',

  hostname: '0.0.0.0',
  port: 8989
};
