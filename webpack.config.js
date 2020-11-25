const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const glob_entries = require("webpack-glob-folder-entries");
const { SourceMapDevToolPlugin } = require("webpack");

const HtmlPlugin = new HtmlWebpackPlugin({
	filename: "index.html",
	inject: "body",
	template: "nunjucks-html-loader!./src/Templates/index.njk",
});

const HtmlPlugin2 = new HtmlWebpackPlugin({
	filename: "otro.html",
	inject: "body",
	template: "nunjucks-html-loader!./src/Templates/otro.njk",
});

function returnEntries(globPath) {
	let entries = glob_entries(globPath, true);
	let folderList = new Array();
	for (let folder in entries) {
		folderList.push(path.join(__dirname, entries[folder]));
	}
	return folderList;
}

module.exports = {
	mode: "development",
	entry: { index: "./src/index.js" },
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	devServer: {
		contentBase: "./dist",
		writeToDisk: true,
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: "Development",
			template: "src/index.html",
		}),
		HtmlPlugin,
		HtmlPlugin2,
		new SourceMapDevToolPlugin(),
	],
	devtool: "eval-source-map",
	module: {
		rules: [
			{
				test: /\.css$/i,

				use: ["style-loader", "css-loader"],
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
			},
			{
				// HTML LOADER
				// Super important: We need to test for the html
				// as well as the nunjucks files
				test: /\.html$|njk|nunjucks/,
				use: [
					"html-loader",
					{
						loader: "nunjucks-html-loader",
						options: {
							// Other super important. This will be the base
							// directory in which webpack is going to find
							// the layout and any other file index.njk is calling.
							searchPaths: [
								...returnEntries("./src/Templates/**/"),
							],
							// Use the one below if you want to use a single path.
							// searchPaths: ['./client/templates'],
						},
					},
				],
			},
		],
	},
};
