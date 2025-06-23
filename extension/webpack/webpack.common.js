const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
	entry: {
		contentScript: path.join(srcDir, "contentScript.ts"),
	},
	output: {
		// The service worker script file must be in the root
		path: path.join(__dirname, "..", "dist"),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		fallback: {
			fs: false,
			util: false,
			path: false,
		},
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: ".", to: ".", context: "public" }],
			options: {},
		}),
	],
};
