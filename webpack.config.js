const path = require('node:path');
const fs = require('node:fs');
const webpack = require('webpack');
const MinimizerPlugin = require('minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const postcssColorMixFunction = require('@csstools/postcss-color-mix-function');
const { Hasher } = require('./hasher');
const { ErrorCodePlugin, PostCssOptimizationPlugin, BundleStatsMarkdownPlugin, MangleCssNamespacePlugin } = require('@erichsia7/webpack-plugins');
const splashScreenHTML = require('./dist/splash-screen/html.json');

module.exports = (env, argv) => {
  return {
    plugins: [
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: '[contenthash].css',
        runtime: false
      }),
      new MangleCssNamespacePlugin({
        prefixes: ['css_', 'b-css-', 'b-cssvar-'],
        mangleCssVariables: true,
        emitManifest: true
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html', // Path to your custom HTML template file
        inject: 'head',
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeComments: true,
          removeRedundantAttributes: false,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: false,
          useShortDoctype: false,
          minifyJS: true // This option minifies inline JavaScript
        }
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        exclude: [/\.map$/, /\.erm$/, /LICENSE\.txt$/, /css-mangle-manifest\.json$/],
        include: [/\.js|css|png$/, /index\.html$/],
        cacheId: 'bus',
        navigateFallback: './index.html',
        navigateFallbackDenylist: [/\/[^\/]+\.(?!(html$))[^\/.]{0,}$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-resources'
            }
          },
          {
            urlPattern: /\/icons\/[a-z0-9\-]+\.png$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'icons'
            }
          }
        ]
      }),
      new SubresourceIntegrityPlugin({
        hashFuncNames: ['sha512'], // Hash algorithms
        enabled: true
      }),
      new BundleStatsMarkdownPlugin()
    ],
    target: ['web', 'es6'], // Target the browser environment (es6 is the default for browsers)
    mode: 'production', // Set the mode to 'production' or 'development'
    entry: './src/index.ts', // Entry point of your application
    output: {
      filename: '[contenthash].js', // Output bundle filename
      hashFunction: Hasher,
      path: path.resolve(__dirname, 'dist'), // Output directory for bundled files
      publicPath: './',
      crossOriginLoading: 'anonymous', // Required for SRI
      library: {
        name: 'bus',
        type: 'umd',
        umdNamedDefine: true,
        export: 'default'
      }
    },
    module: {
      rules: [
        {
          test: /\.js|ts|jsx|tsx$/, // Use babel-loader for TypeScript files
          exclude: [/node_modules/, /index\.html/],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    exclude: ['@babel/plugin-transform-regenerator', '@babel/plugin-transform-template-literals', '@babel/plugin-transform-for-of']
                  }
                ],
                '@babel/preset-typescript'
              ],
              plugins: ['@babel/plugin-transform-runtime'],
              assumptions: {
                constantReexports: true
              }
            }
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'], // File extensions to resolve
      mainFields: ['browser', 'module', 'main']
    },
    optimization: {
      minimize: true,
      minimizer: [
        new ErrorCodePlugin(),
        new MinimizerPlugin({
          test: /\.[cm]?js(\?.*)?$/i,
          minify: MinimizerPlugin.terserMinify,
          extractComments: true,
          minimizerOptions: {
            compress: {
              drop_console: [/* 'log', */ 'assert', 'clear', 'count', 'countReset', 'debug', 'dir', 'dirxml', 'error', 'group', 'groupCollapsed', 'groupEnd', 'info', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeLog', 'timeStamp', 'trace', 'warn']
            }
          }
        }),
        new PostCssOptimizationPlugin({
          plugins: [postcssColorMixFunction({ preserve: false, enableProgressiveCustomProperties: false })]
        }),
        new MinimizerPlugin({
          test: /\.css(\?.*)?$/i,
          minify: MinimizerPlugin.cssnanoMinify,
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true }
              }
            ]
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 32000,
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
      avoidEntryIife: true,
      chunkIds: 'deterministic',
      concatenateModules: true,
      innerGraph: true,
      mangleExports: 'size',
      usedExports: true
    },
    devtool: 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      hot: false
    }
  };
};
