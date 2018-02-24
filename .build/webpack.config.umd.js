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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.DefinePlugin({ "process.env.NODE_ENV": '"production"' }),
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
      "./get-editor-state": "./get-editor-state.umd"
    }
  }
};
