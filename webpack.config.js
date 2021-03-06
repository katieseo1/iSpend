const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: {
    index: './js/index.js',
    categorySpending: './js/categorySpending.js',
    budget: './js/budget.js',
    transaction: './js/transaction.js',
    signup: './js/signup.js'
  },
  output: {
    filename: '/public/js/[name].js',
    chunkFilename: '[id].js'
  },
  module: {
    loaders: [{
      test: /\.(jpe?g|gif|png)$/,
      loader: 'file-loader?name=public/img/[name].[ext]'
    }, {
      test: /\.(woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000&name=public/img/[name].[ext]'
    }, {
      test: /\.(css|map)$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        loader: 'css-loader'
      })
    }
    ]
  },
  plugins: [
    new ExtractTextPlugin('public/css/[name].css'),
    new webpack.ProvidePlugin({
      d3: 'd3',
      $: 'jquery'
    })
  ],
  resolve: {
    extensions: ['.js', '.css'],
    alias: {
      jquery: 'jquery/src/jquery',
      d3: 'd3/index',
      bootstrapValidator: 'bootstrap-validator',
      bootbox: 'bootbox'
    }
  }
}
