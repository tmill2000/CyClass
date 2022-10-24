const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: "./src/app.jsx",
	mode: "development",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env", "@babel/preset-react"]
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				loader: "file-loader",
				options: {
					name: "[contenthash].[ext]",
					outputPath: "assets",
					publicPath: "/assets"
				}
			}
		]
	},
	resolve: {
		extensions: [".js", ".jsx"]
	},
	output: {
		path: path.resolve(__dirname, "../www"),
		filename: "bundle.js",
		publicPath: "",
		clean: {
			keep(asset) {
				return !asset.includes("assets");
			}
		}
	},
	devServer: {
		static: "../www",
		port: 3000,
		hot: true
	}
};