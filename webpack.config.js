const { resolve } = require("path");
const webpack = require("webpack");
require("@babel/register");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "index.js",
    library: "rest",
    libraryTarget: "umd",
    globalObject: `typeof self !== 'undefined' ? self : this`
  },
  module: {
    rules: [
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: "$"
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
            // plugins: ["add-module-exports"]
          }
        }
      }
    ]
  },
  externals: {
    jquery: {
      commonjs: "jquery",
      commonjs2: "jquery",
      amd: "jquery",
      root: "$"
    }
  },
  stats: {
    colors: true
  },
  devtool: "source-map",
  mode: process.env.NODE_ENV,
  optimization: {
    usedExports: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery"
    })
  ]
};
