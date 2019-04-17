const { resolve } = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const rules = {
  test: /\.js$/,
  exclude: /(node_modules)/,
  use: {
    loader: "babel-loader",
    options: {
      presets: null
    }
  }
};

const backendRules = Object.assign({}, rules);
backendRules.use.options["presets"] = [
  [
    "@babel/env",
    {
      targets: "maintained node versions",
      modules: "umd",
      debug: true
    }
  ]
];

const frontendRules = Object.assign({}, rules);
frontendRules.use.options["presets"] = [
  [
    "@babel/env",
    {
      targets: "last 2 versions, > 0.1%, not dead",
      modules: "umd",
      debug: true
    }
  ]
];

const backend = {
  target: "node",
  entry: "./src/index.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "index.node.js",
    library: "@asterics/rest",
    libraryTarget: "umd"
  },
  module: {
    rules: [backendRules]
  },
  stats: {
    colors: true
  },
  devtool: "source-map",
  mode: process.env.NODE_ENV,
  optimization: {
    minimizer: [new TerserPlugin({ parallel: true, sourceMap: true })]
  }
};

const frontend = {
  target: "web",
  entry: "./src/index.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "index.js",
    library: "@asterics/rest",
    libraryTarget: "umd"
  },
  module: {
    rules: [frontendRules]
  },
  stats: {
    colors: true
  },
  devtool: "source-map",
  mode: process.env.NODE_ENV,
  optimization: {
    minimizer: [new TerserPlugin({ parallel: true, sourceMap: true })]
  }
};

module.exports = [backend, frontend];
