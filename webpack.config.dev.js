const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const AdvancedPreset = require('cssnano-preset-advanced');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

function generateRandomString(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}



module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'index.css', // Output CSS filename
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html', // Path to your custom HTML template file
        inject: 'head', // Specify 'body' to insert the script tags just before the closing </body> tag
      }),
      new webpack.DefinePlugin({
        'process.env': {
          VERSION: JSON.stringify(generateRandomString(16)), // You can adjust the length of the random string here (e.g., 8 characters)
        },
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        exclude: [/\.map$/, /LICENSE\.txt$/],
        include: [/\.js|css|png$/],
        cacheId: `pwdgen2-${generateRandomString(16)}`,
        runtimeCaching: [
          {
            urlPattern: new RegExp('^https://fonts\.googleapis\.com'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
        ],
      }),
    ],
    target: ['web', 'es6'], // Target the browser environment (es6 is the default for browsers)
    mode: 'development', // Set the mode to 'production' or 'development'
    entry: './src/index.ts', // Entry point of your application
    output: {
      filename: 'index.js', // Output bundle filename
      path: path.resolve(__dirname, 'dist'), // Output directory for bundled files
      publicPath: 'https://erichsia7.github.io/pwdgen2/dist/',
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
      minimize: false,
    },
    devtool: 'eval-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      hot: true,
    },
    // Add any additional plugins and configurations as needed
  }
}
