const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  target: ['web', 'es6'], // Target the browser environment (es6 is the default for browsers)
  mode: 'production', // Set the mode to 'production' or 'development'
  entry: './src/index.ts', // Entry point of your application
  output: {
    filename: 'index.min.js', // Output bundle filename
    path: path.resolve(__dirname, 'dist'), // Output directory for bundled files
    library: {
      name: 'ripple',
      type: 'umd',
      umdNamedDefine: true,
      export: 'default',
    },
  },
  module: {
    rules: [
      {
        test: /\.js|ts|jsx|tsx?$/, // Use babel-loader for TypeScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-flow', 'babel-preset-modules', '@babel/preset-typescript'],
            plugins: ['@babel/plugin-syntax-flow'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // File extensions to resolve
    mainFields: ['browser', 'module', 'main'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  // Add any additional plugins and configurations as needed
};