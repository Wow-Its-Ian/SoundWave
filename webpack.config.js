const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { HotModuleReplacementPlugin } = require('webpack');
const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development', // or 'production'
	entry: [
		'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true', // HMR client
		'./src/index.jsx'
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/', // public path for the dev middleware
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/, // Match both .js and .jsx files,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
						plugins: ['@babel/plugin-proposal-class-properties']
					}
				}
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS 
					"sass-loader",
				],
			}
		],
	},
	plugins: [
		new HtmlWebpackPlugin(),
		new webpack.HotModuleReplacementPlugin(), // Enable HMR
	],
};
