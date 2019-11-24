const { HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const baseConfig = require('@tdd-buffet/react/dist/config/webpack.config');

const plugins = [
  new HotModuleReplacementPlugin(),
  new NoEmitOnErrorsPlugin(),
  new HtmlWebpackPlugin({
    template: './index.html'
  })
];

// Disable type checking in dev because it's slow.
if (process.env.ACCEPTANCE) {
  plugins.push(new ForkTsCheckerWebpackPlugin({
    async: false, // so we don't emit on type errors
    // don't compile tests
    reportFiles: [
      'src/**/*',
      'playground/**/*'
    ]
  }));
}

module.exports = webpackEnv => ({
  ...baseConfig(webpackEnv),

  plugins
});
