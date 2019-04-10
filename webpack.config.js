const { resolve } = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  target: "node",
  // node: {
  //   http: true,
  //   https: "empty"
  // },
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
                    browsers: ["last 4 versions"]
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
  //   axios: "axios"
  // },
  stats: {
    colors: true
  },
  devtool: "source-map",
  mode: process.env.NODE_ENV,
  optimization: {
    usedExports: true,
    minimizer: [new TerserPlugin({ parallel: true, sourceMap: true })]
  }
};
