const { resolve } = require('path');

module.exports = env => {
  return {
    mode: env?.dev ? 'development' : 'production',
    target: ['es5', 'web'],
    entry: './dist/index.js',
    output: {
      path: resolve(__dirname, 'dist/web'),
      filename: 'index.js',
      libraryTarget: 'umd',
      library: 'tbMath'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] }
          },
          resolve: { fullySpecified: false }
        }
      ]
    },
    devtool: 'source-map'
  };
};
