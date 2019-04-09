const { resolve } = require("path");
// const webpack = require("webpack");

module.exports = {
  // target: "node",
  entry: "./src/test.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "new.js"
    // library: "rest",
    // libraryTarget: "umd",
    // globalObject: `typeof self !== 'undefined' ? self : this`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/env",
                {
                  targets: {
                    browsers: ["last 2 versions"]
                  },
                  debug: true
                }
              ]
            ]
          }
        }
      }
    ]
  },
  // externals: {
  //   jquery: {
  //     commonjs: "jquery",
  //     commonjs2: "jquery",
  //     amd: "jquery",
  //     root: "$"
  //   }
  // },
  stats: {
    colors: true
  },
  devtool: "source-map",
  mode: process.env.NODE_ENV
  // optimization: {
  //   usedExports: true
  // }
};
