const path = require('path')

module.exports = {
    entry: {
        index: './src/client/index.js',
        chat: './src/client/chat.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name]-bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/
        }]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        publicPath: '/js/',
        //port: 3000
    }
}