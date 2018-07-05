const webpackConfig = require('./webpack.base')
const WebpackDevServer = require("webpack-dev-server");
const merge = require('webpack-merge')
const webpack = require('webpack')
process.env.NODE_ENV = 'production';
const arguments = process.argv.splice(2);

const config = merge(webpackConfig,{
    plugins:[
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            },
            'isQa': arguments[0] === 'qa',
            'isBeta': arguments[0] === 'beta',
            'isProduction': !arguments[0] || arguments[0] === 'production',
        })
    ]
});
webpack(config, function (err, stats) {
    console.log(err);
})