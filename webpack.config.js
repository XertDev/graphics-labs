const { resolve } = require('path');

const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
  mode: 'development',
  experiments: {
    asset: true
  },

  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['awesome-typescript-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.glb$/i,
        type: 'asset/resource'
      },
      {
        type: 'javascript/auto',
        test: /\.json$/i,
        include: [resolve(__dirname, 'src/assets/fonts')],
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.glb$/i,
        type: 'asset/resource'
      },
    ],
  },
  plugins: [
    new CheckerPlugin(),
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      filename: 'index.html',
      inject: 'body',
    }),
  ],
};
