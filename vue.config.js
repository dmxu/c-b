const path = require('path');
const { library } = require('./package.json');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const cdns = [{
    module: "jQuery",
    entry: "https://cdn.bootcss.com/jquery/3.4.1/jquery.js",
    global: "jQuery"
}];
module.exports = {
    publicPath: './',
    css: {
        loaderOptions: {
            sass: {
                // 引入全局变量样式,@使我们设置的别名,执行src目录
                data: `@import "@/assets/style/public.scss";`
            }
        },
    },
    chainWebpack: (config) => {
        // 修复HMR
        config.resolve.symlinks(true);
        // 别名配置
        config.resolve.alias.set('@', path.resolve(__dirname, './src'))
    },
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true, // 生产环境是否生成 sourceMap 文件
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production';
            //分包
            config.optimization.splitChunks = {
                cacheGroups: {
                    vendor: {//node_modules内的依赖库
                        chunks: "all",
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        minChunks: 1, //被不同entry引用次数(import),1次的话没必要提取
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 100,
                        // enforce: true?
                    },
                    common: {// ‘src/js’ 下的js文件
                        chunks: "all",
                        test: /[\\/]src[\\/]js[\\/]/,//也可以值文件/[\\/]src[\\/]js[\\/].*\.js/,  
                        name: "common", //生成文件名，依据output规则
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 1
                    }
                }
            }
            config.optimization.runtimeChunk = {
                name: 'manifest'
            }
            //使用预编译 vue vuex vue-router axios 进行编译
            config.plugins.push(
                ...Object.keys(library).map(name => {
                    return new webpack.DllReferencePlugin({
                        manifest: path.resolve(__dirname, `lib/${name}.manifest.json`),
                    })
                })
            )
            config.plugins.push(
                new webpack.optimize.ModuleConcatenationPlugin()
            )

            //页面中引用预编译的内容
            config.plugins.push(
                ...Object.keys(library).map(name => {
                    return new AddAssetHtmlPlugin([{
                        filepath: path.resolve(__dirname, `lib/${name}.dll.js`),
                        outputPath: './js/',
                        publicPath: "./js",
                        includeSourcemap: true
                    }])
                })
            )
        } else {
            // 为开发环境修改配置...
            config.mode = 'development';
        }
        //jquery不打包
        Object.assign(config, {
            externals: {
                jQuery: "jQuery"
            }
        })
        //添加cdn
        if(cdns.length>0){
            config.plugins.push(new HtmlWebpackExternalsPlugin({
                externals: cdns
            }))
        }
    },
}