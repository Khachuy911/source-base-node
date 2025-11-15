module.exports = function (options) {
  return {
    ...options,
    devtool: 'inline-source-map',
    module: {
      ...options.module,
      rules: [
        ...options.module.rules,
        {
          test: /\.hbs$/,
          use: 'handlebars-loader',
          exclude: /node_modules/,
        },
      ],
    },
    node: {
      ...options.node,
      __dirname: false,
    },
  };
};
