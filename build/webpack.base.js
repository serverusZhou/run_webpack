const path = require('path');
const webpack = require('webpack')
const pageConfig = require('../src/pages.js')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const vuxLoader = require('vux-loader');
const OfflinePlugin = require('offline-plugin');
//对页面配置信息的处理
let entry = {};
let plugins = [];
for (let [key, value] in pageConfig) {
    if (!pageConfig[key].jsEntryPath) {
        pageConfig[key].jsEntryPath = './default_entry'
    }
    entry[pageConfig[key].jsEntryPath] = ["babel-polyfill", __dirname + '/../src/' + pageConfig[key].jsEntryPath + '.js'];
    let chunks = [];
    chunks[0] = pageConfig[key].jsEntryPath;
    pageConfig[key].chunks = pageConfig[key].chunks || chunks;
    plugins.push(
        new HtmlWebpackPlugin({
            title: pageConfig[key].pageTitle,
            filename: __dirname + '/../dist/' + pageConfig[key].templateFileName + '.html',
            template: __dirname + '/../src/' + pageConfig[key].templateFileName + '.' + (pageConfig[key].templateFileType || 'html'),
            inject: true,
            hash: false,
            chunks: pageConfig[key].chunks
        })
    );
}
const config = {
    entry: entry,
    output: {
        path: __dirname + '/../dist',
        filename: '[name][hash].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.less'],
        alias: {
            //'vue$': 'vue/dist/vue.esm.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.jsx$/,
                loader: 'jsx-loader'
            },
            {
                test: /\.(css)/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            },
            {
                test: /\.vue$/,
                loaders: ['vue-loader']
            },
            {
                test: /\.sass(\?[^?]+)?$/,
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.svg/,
                loader: 'svg-url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            }
        ]
    },
    plugins: plugins.concat([
        new CleanWebpackPlugin(
            [__dirname + '/../dist/*'],　 //匹配删除的文件
            {
                root: __dirname + '/../',
                verbose: true,
                dry: false
            }
        ),
        new webpack.HotModuleReplacementPlugin(),
        //复制文件
        new CopyWebpackPlugin([
            {
                context: __dirname + '/../src/',
                from: 'assets/**/*',
                to: __dirname + '/../dist/'
            },
            {
                context: __dirname + '/../src/',
                from: 'manifest.json',
                to: __dirname + '/../dist/'
            },
        ], {
                ignore: [],
                copyUnmodified: true,
            }),
        new OfflinePlugin({
            ServiceWorker: {
                events: true
            },
            AppCache: {
                events: true
            }
        })
    ]),
    devServer: {
        historyApiFallback: true,
        inline: true,
    }
};

// const ppconfig = vuxLoader.merge(config, {
//     options: {
//         isWebpack2 : true
//     },
//     plugins: [{
//         name: 'vux-ui'
//     }]
// })
// console.log(JSON.stringify(ppconfig));
// module.exports = ppconfig

module.exports = config

