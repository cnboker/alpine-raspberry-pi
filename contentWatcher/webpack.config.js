const path = require('path');
require('dotenv').config()
module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  target: 'node',
  mode: 'development',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false,   // if you don't put this is, __dirname
    __filename: false,  // and __filename return blank or /
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [],
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  }
};