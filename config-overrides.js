module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.module.rules.unshift(
    {
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false, // disable the behaviour
      },
    },
  )

  return config;
}