const path = require("path");

const pluginName = "plugin";
class Plugin {
	apply(compiler) {
		compiler.hooks.afterCompile.tap(pluginName, compilation => {
			const deps = [
				...compilation.fileDependencies,
				...compilation.contextDependencies,
				...compilation.missingDependencies,
				...compilation.buildDependencies
			];
			expect(deps.every(item => path.isAbsolute(item))).toBe(true);
		});
	}
}
/** @type {import('webpack').Configuration} */
module.exports = {
	module: {
		rules: [
			{
				dependency: "url",
				scheme: /^data$/,
				type: "asset/resource"
			},
			{
				issuer: /\.js/,
				mimetype: /^image\/svg/,
				type: "asset/inline"
			},
			{
				mimetype: /^text\/bad-base64/,
				type: "asset/inline"
			}
		]
	},
	plugins: [new Plugin()],
	experiments: {
		css: true
	}
};
