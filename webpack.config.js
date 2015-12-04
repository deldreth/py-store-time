module.exports = {
  entry: {
    app: './static/app/app.js'
  },
  output: {
    path: './static/build',
    filename: '[name]_pack.js',
    sourceMapFilename: '[name]_pack.map',
    publicPath: 'http://localhost:9090/assets/'
  },
  cache: true,

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  },
  devtool: 'source-map'
};
