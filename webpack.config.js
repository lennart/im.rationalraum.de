var precss = require('precss'),
    autoprefixer = require('autoprefixer'),
    AppCachePlugin = require('appcache-webpack-plugin');

module.exports = {
  entry: "./index.js",
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
      ]
  },
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  plugins: [
    new AppCachePlugin({
      cache: ['bower_components/mathbox/build/mathbox-bundle.js',
              'presets/water.js',
              'presets/points.js',
              'presets/surface.js',
              'presets/ast.js'
             ],
      network: null,
      fallback: ['fail.png'],
      settings: ['prefer-online'],
      exclude: [],
      output: 'dnd.appcache'
    })
  ],
  postcss: function() {
    return [precss, autoprefixer];
  },
  resolve: {
    modulesDirectories: ["bower_components", "node_modules"],
    alias: {
    }
  },
  
}
