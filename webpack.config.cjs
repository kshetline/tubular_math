const { resolve } = require('path');

module.exports = env => {
  const libraryTarget = env?.target === 'umd' ? 'umd' : 'commonjs';
  const target = env?.target === 'umd' ? 'es5' : 'node';

  return {
    mode: env?.dev ? 'development' : 'production',
    target,
    entry: './dist/index.js',
    output: {
      path: resolve(__dirname, 'dist'),
      filename: `index.${env?.target || 'cjs'}.js`,
      libraryTarget,
      library: '@tubular_math'
    },
    module: {
      rules: [
        { test: /\.js$/, use: 'babel-loader', resolve: { fullySpecified: false } }
      ]
    }
  };
};