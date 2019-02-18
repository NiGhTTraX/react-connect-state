const { HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',

  output: {
    filename: '[name].js'
  },

  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test: /\.less$/,
      exclude: /node_modules/,
      use: ['style-loader', 'css-loader', 'less-loader']
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  plugins,

  devServer: {
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true,
    hot: true,
    stats: 'errors-only'
  }
};
