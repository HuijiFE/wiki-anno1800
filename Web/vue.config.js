/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Config = require('webpack-chain');
const { chainWebpackHash } = require('@huiji/vue-cli-utils');
const { genPathResolve } = require('@huiji/shared-utils');

const resolvePath = genPathResolve(__dirname);

const options = {
  publicPath: process.env.NODE_ENV === 'production' ? '/static/' : '/',
  runtimeCompiler: true,
  parallel: false,

  /**
   * @param {Config} config
   */
  chainWebpack: config => {
    config.resolve.alias.delete('@').set('@src', resolvePath('src'));

    chainWebpackHash(options)(config);
  },

  devServer: {
    port: process.env.VUE_APP_PORT,
    open: true,

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
