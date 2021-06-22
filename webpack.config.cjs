const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = env => {
  const dev = !!env?.dev && (/^[ty]/i.test(env?.dev) || Number(env?.dev) !== 0);
  const libraryTarget = 'umd';

  return {
    mode: dev ? 'development' : 'production',
    target: ['es6', 'web'],
    entry: './dist/index.js',
    output: {
      path: resolve(__dirname, 'dist', 'web'),
      filename: 'index.js',
      libraryTarget,
      library: 'tbMath'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', {
                targets: { // ES6 minimums
                  chrome:  '58',
                  edge:    '14',
                  firefox: '54',
                  opera:   '55',
                  safari:  '10'
                }
              }]]
            }
          },
          resolve: { fullySpecified: false }
        }
      ]
    },
    optimization: {
      minimize: !dev,
      minimizer: [new TerserPlugin({
        terserOptions: {
          output: { max_line_len: 511 }
        }
      })],
    },
    devtool: 'source-map'
  };
};
