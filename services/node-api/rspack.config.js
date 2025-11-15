const { composePlugins, withNx } = require('@nx/rspack');
const { resolve } = require('path');
const rspack = require('@rspack/core');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = composePlugins(withNx(), (config, { options, context }) => {
  // customize Rspack config here
  const customConfig = {
    ...config,
    mode: process.env.NODE_ENV,
    context: __dirname,
    entry: {
      main: './src/main.ts',
    },
    target: 'node',
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.hbs$/,
          use: 'handlebars-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      ...config.plugins,
      // new ForkTsCheckerWebpackPlugin({
      //   async: true,
      //   typescript: {
      //     build: true,
      //     mode: 'write-references',
      //   },
      // }),
      new rspack.CopyRspackPlugin({
        patterns: [
          {
            from: '../../node_modules/geoip-lite/data',
            to: '../data',
          },
          // {
          //   from: './src/assets',
          //   to: './assets',
          // },
        ],
      }),
    ],
    resolve: {
      ...config.resolve,
      tsConfig: {
        configFile: resolve(__dirname, './tsconfig.json'),
        references: 'auto',
      },
    },
    node: {
      __dirname: false,
    },
    watchOptions: {
      ignored: ['node_modules', 'test'],
    },
  };

  return customConfig;
});
