module.exports = function(grunt) {

	var convertSlashes = /\\/g;

	grunt.registerMultiTask('javascript', 'Compile JavaScript files', function() {

		var requirejs = require('requirejs');
		var _ = require('underscore');
		var namespaces = require("./javascript/namespaces");
		var configurations  = require("./javascript/configurations");
		var path = require("path");
		var fs = require("fs");
		var done = this.async();
		var options = this.options({});
		var helpers = grunt.config("helpers");

		var pluginsClientSidePatch = '';

		if (!fs.existsSync(options.pluginsPath)) {
			// make endpoint for plugin attachment 'plugins.js'
			// apply client side patch
			fs.writeFileSync(options.pluginsPath, pluginsClientSidePatch);
		}

		// generate dependencies for plugins endpoint 'plugins.js' from plugins object
		options.shim = options.shim || {};
		options.shim[options.pluginsModule] = {deps:[]};
		helpers.getPlugins().forEach((plugin)=>{
			if (!plugin._bower.main) return;
			var requireJSMainPath = path.join(plugin.name, plugin._bower.main);
			var ext = path.extname(requireJSMainPath);
			var requireJSMainPathNoExt = requireJSMainPath.slice(0, -ext.length).replace(convertSlashes, "/");
			options.shim[options.pluginsModule].deps.push(requireJSMainPathNoExt);
		});

		// add all config.js files from plugins to requirejs config
		var sourcedir = grunt.config("sourcedir");
		configurations.addConfigFiles(sourcedir, options);

		// fix and warn about namespaces from plugins config.js map[*] configuration
		var namespacesConfig = configurations.getNamespacesConfig(sourcedir);
		var erroredFor = {};
		options.onBuildRead = function (moduleName, path, contents) {
			namespaces.replace(contents, namespacesConfig, (rtn, modified)=>{
				contents = rtn;
				if (_.keys(modified).length && !erroredFor[moduleName]) {
					erroredFor[moduleName] = true;
					grunt.log.warn(`namespaces in '${moduleName}' change '${_.keys(modified).join('\',\'') }' to '${_.values(modified).join('\',\'') }'`)
				}
			});
			return contents;
		};

		// compile code
		requirejs.optimize(options, function() {
			done();
		}, function(error) {
			grunt.fail.fatal(error);
		});
	});
};
