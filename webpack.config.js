const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.min.css', // Output CSS filename
    }),
  ],
  target: ['web', 'es6'], // Target the browser environment (es6 is the default for browsers)
  mode: 'production', // Set the mode to 'production' or 'development'
  entry: './src/index.ts', // Entry point of your application
  output: {
    filename: 'index.min.js', // Output bundle filename
    path: path.resolve(__dirname, 'dist'), // Output directory for bundled files
    library: {
      name: 'pwdgen2',
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
      {
        test: /\.css|less?$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'], // File extensions to resolve
    mainFields: ['browser', 'module', 'main'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        }
      })
    ],
  },
  // Add any additional plugins and configurations as needed
};