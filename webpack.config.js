module.exports = {
  entry: "./index.js",
  resolve: {
    modulesDirectories: ["bower_components"]
  },
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {      test: /\.css$/, loader: "style!css" }
      ]
  }
}
