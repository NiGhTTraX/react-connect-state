const globalImports = [
  'playground/styles.less',
  'reset.css'
];

if (process.env.ACCEPTANCE) {
  globalImports.push('tests/gui/styles.less');
}

module.exports = {
  rootPath: '../',

  fileMatch: ['**/fixtures/**/*.{ts,tsx}'],

  watchDirs: ['src', 'playground'],
  exclude: [/\.d\.ts$/],

  globalImports,

  webpackConfigPath: 'webpack.config.js',

  hostname: '0.0.0.0',
  port: 8989
};
