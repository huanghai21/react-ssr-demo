const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const config = {
  // no need target for browser anymore
  // target: 'node',

  // root file of our server app
  entry: './src/client/client.js',

  // where to put the output file that webpack generate
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  }
}

module.exports = merge(baseConfig, config);