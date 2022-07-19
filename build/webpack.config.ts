/**
 * Reference: https://webpack.js.org/configuration/configuration-languages/
 */

import type { Configuration } from 'webpack';
// import type WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

delete process.env.TS_NODE_PROJECT; // https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/32
// eslint-disable-next-line @typescript-eslint/no-var-requires

const ROOT_PATH = path.resolve(__dirname, '../');
const DIST_PATH = path.resolve(ROOT_PATH, './dist');
const ASSET_PATH = process.env.ASSET_PATH || '/';

const NODE_ENV = process.env.NODE_ENV ?? 'production';

const isDev = NODE_ENV === 'development';
const mode = isDev ? 'development' : 'production';

const plugins: Configuration['plugins'] = [
  new HtmlWebpackPlugin({
    title: 'Become Waifu',
    inject: true,
    hash: false,
    template: path.resolve(ROOT_PATH, './assets/template.html'),
  }),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(ROOT_PATH, './assets/models/'),
        to: 'models/',
      },
    ],
  }) as any,
];

const config: Configuration = {
  // mode,
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',
  entry: {
    app: path.resolve(ROOT_PATH, './src/index.ts'),
  },
  output: {
    path: DIST_PATH,
    publicPath: ASSET_PATH,
    asyncChunks: true,
    library: { name: 'become_waifu', type: 'commonjs2' },
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015',
          tsconfigRaw: require('../tsconfig.json'),
        },
      },
      {
        test: /\.(less|css)$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|svg|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'assets/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  externals: {
    fs: "require('fs')",
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(ROOT_PATH, './tsconfig.json'),
      }),
    ],
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
  plugins,
};

export default config;
