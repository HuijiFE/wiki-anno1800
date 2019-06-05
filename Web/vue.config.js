/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Config = require('webpack-chain');
const { chainWebpackHash } = require('@huiji/vue-cli-utils');
const { genPathResolve } = require('@huiji/shared-utils');

const resolvePath = genPathResolve(__dirname);

const args = process.argv.slice(2);

const publicPath =
  (process.env.NODE_ENV === 'development' && '/') ||
  (process.env.VUE_APP_PLATFORM === 'hj-pages' && '/') ||
  '/static/';

const options = {
  publicPath,
  runtimeCompiler: true,
  parallel: false,

  css: {
    loaderOptions: {
      sass: {
        data: `$BASE_URL: '${publicPath}';`,
      },
    },
  },

  /**
   * @param {Config} config
   */
  chainWebpack: config => {
    config.resolve.alias
      .delete('@')
      .set('@src', resolvePath('src'))
      .set('@public', resolvePath('public'));

    chainWebpackHash(options)(config);
  },

  devServer: {
    port: process.env.VUE_APP_PORT,
    open: true,
    openPage: 'wiki/Anno1800/zh-CN/test',

    // /**
    //  *
    //  * @param {express.Application} app
    //  * @param {WebpackDevServer} server
    //  */
    // before: (app, server) => {
    //   //
    // },
  },
};

module.exports = options;
