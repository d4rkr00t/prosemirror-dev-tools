const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  entry: "./src",
  output: {
    filename: "prosemirror-dev-tools.min.js",
    path: path.resolve(__dirname, "..", "dist", "umd"),
    library: "ProseMirrorDevTools",
    libraryTarget: "umd"
  },
  optimization: {
    minimize: true,
    nodeEnv: "production"
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      defaultSizes: "gzip",
      generateStatsFile: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    alias: {
      "./get-editor-state": "./get-editor-state.umd",
      react: "preact-compat",
      "react-dom": "preact-compat"
    }
  }
};
