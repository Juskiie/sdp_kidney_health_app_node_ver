const path = require('path');
const nodeExternals = require('webpack-node-externals');


module.exports = {
	target: 'node',
	externals: [nodeExternals()],
	externalsPresets: {
		node: true // in order to ignore built-in modules like path, fs, etc.
	},
	mode: 'development',
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".css"],
		fallback: {
			fs: false,
			net: false,
			tls: false,
			dns: false,
			path: false,
			util: false,
			stream: false,
			//buffer: false,
			timers: false,
			crypto: false,
			http: false,
			https: false,
			zlib: false,
			async_hooks: false,
			module: 'empty'
		},
		modules: [
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, 'scripts')
		]
	},
};

