/**
 * Reference: https://webpack.js.org/configuration/configuration-languages/
 */

import type { Configuration } from 'webpack';
// import type WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import merge from 'webpack-merge';
import baseConfig from './webpack.config';

delete process.env.TS_NODE_PROJECT; // https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/32
// eslint-disable-next-line @typescript-eslint/no-var-requires

const ROOT_PATH = path.resolve(__dirname, '../');
const DIST_PATH = path.resolve(ROOT_PATH, './dist');
const ASSET_PATH = process.env.ASSET_PATH || '/';

const config: Configuration = merge(baseConfig, {
  // mode,
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',
  entry: {
    app: path.resolve(ROOT_PATH, './src/extension.ts'),
  },
  output: {
    path: DIST_PATH,
    filename: 'become-waifu.js',
    publicPath: ASSET_PATH,
    asyncChunks: false,
  },
});

export default config;
