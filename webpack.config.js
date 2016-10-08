var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: './src/js/App.js',
    output: {
         path: './assets',
         publicPath: '/assets/',
         filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.html$/,
                loaders: ['underscore-template']
            },
            {
                test: /\.json$/,
                loaders: ['json']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'underscore'
        })
    ],
    resolve: {
        root: [path.resolve('./src')]
    },
    scssLoader: {
        includePaths: [path.resolve(__dirname, './src/style')]
    },
    watch: true
};
