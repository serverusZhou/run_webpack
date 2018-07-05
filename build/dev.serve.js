const webpackConfig = require('./webpack.base')
const WebpackDevServer = require("webpack-dev-server");
const merge = require('webpack-merge')
const webpack = require('webpack')
const config = merge(webpackConfig,{
  plugins:[
    new webpack.DefinePlugin({
        'ENVIRONMENT': {
            NODE_ENV: '"production"'
        },
        'isQa': true,
        'isBeta': false,
        'isProduction': false,
    })
]
})
const compiler =webpack(config, function (err, stats) {
    const server = new WebpackDevServer(compiler,{
      publicPath: webpackConfig.output.publicPath,
      quiet: false,
      hot: true,
      contentBase:'dist/',
    });
    server.listen(8090, "0.0.0.0", function() {});
    //server.close();
})