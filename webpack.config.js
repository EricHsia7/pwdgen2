const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const AdvancedPreset = require('cssnano-preset-advanced');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.min.css', // Output CSS filename
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html', // Path to your custom HTML template file
        inject: 'head', // Specify 'body' to insert the script tags just before the closing </body> tag
      }),
    ],
    target: ['web', 'es6'], // Target the browser environment (es6 is the default for browsers)
    mode: 'production', // Set the mode to 'production' or 'development'
    entry: './src/index.ts', // Entry point of your application
    output: {
      filename: isProduction ? '[name].[hash].min.js' : 'index.js', // Output bundle filename
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
      minimize: isProduction,
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin({
          parallel: 4,
          minimizerOptions: {
            preset: [
              'default',
              AdvancedPreset,
              {
                discardComments: { removeAll: true },
              },
            ],
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        maxSize: 32000,
        cacheGroups: {
          // Define your cache groups here with specific rules
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          // Add more cache groups if needed
        },
      },
    },
    devtool: 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      hot: true,
    },
    // Add any additional plugins and configurations as needed
  }
}

