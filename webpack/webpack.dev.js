const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: [
      'eventsource-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      path.resolve(__dirname, '../client/index.js')
    ],
    admin: [
      'eventsource-polyfill',
      path.resolve(__dirname, '../admin/index.js')
    ]
  },
  output: {
    filename: '[name].bundle.js',
    publicPath: '/public',
    path: path.resolve(__dirname, '../public/')
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/, // babel change code to compatible js
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: [
            ['import', { libraryName: 'antd', style: 'css' }],
          ],
        },
        include: [path.resolve(__dirname, '../client'), path.resolve(__dirname, '../admin')],
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(scss|sass)/,
        loader: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.(svg|woff|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    inline: true
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.png',
      '.gif',
      '.jpg',
      '.scss',
      '.css'
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['main'],
      title: 'Stand Out',
      publicPath: '/public',
      filename: 'maker.html',
      template: path.resolve(__dirname, '../views/maker.html'),
      inject: 'body',
      favicon: path.resolve(__dirname, '../favicon.ico'),
    }),
    new HtmlWebpackPlugin({
      chunks: ['admin'],
      title: 'Stand Out Admin',
      publicPath: '/public',
      filename: 'admin.html',
      template: path.resolve(__dirname, '../views/maker.html'),
      inject: 'body',
      favicon: path.resolve(__dirname, '../favicon.ico'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    })
  ]
}