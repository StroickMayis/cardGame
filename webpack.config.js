const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/scripts/index.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        assetModuleFilename: 'images/[name][ext][query]'
    },
    devtool: "eval-source-map",
    devServer: { // dev server location: http://localhost:8080/pages/index.html
        watchFiles: ["./src/page/index.html"],
    },
    mode: `development`,
    plugins: [
        new HtmlWebpackPlugin({
            filename: `pages/index.html`,
            template: './src/pages/index.html',
            chunks: [`index`]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
};