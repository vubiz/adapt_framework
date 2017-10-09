module.exports = function(grunt) {
		var convertSlashes = /\\/g;

      	grunt.registerMultiTask('less', 'Compile LESS files to CSS', function() {
			var less = require('less');
			var _ = require('underscore');
			var path = require("path");
			var done = this.async();
			var options = this.options({});

			var rootPath = path.join(path.resolve(options.baseUrl), "../").replace(convertSlashes, "/");

			var imports = [];
			
			if (options.config) {

				var screenSize = {
					"small": 520,
					"medium": 760,
					"large": 900
				};
				try {
					var configjson = JSON.parse(grunt.file.read(options.config).toString());
					screenSize = configjson.screenSize || screenSize;
				} catch (e) {}

				console.log("screen size:", screenSize);

				imports.push("@adapt-device-small:"+screenSize.small+";");
				imports.push("@adapt-device-medium:"+screenSize.medium+";");
				imports.push("@adapt-device-large:"+screenSize.large+";\n");

			}

			this.files.forEach((opts)=>{

				opts.src.forEach((lessPath)=>{
					lessPath = path.normalize(lessPath);
					var trimmed = lessPath.substr(rootPath.length);
					imports.push("@import '" + trimmed + "';");
				});

				var sourcemaps;
				if (options.sourcemaps) { 
					sourcemaps = {
						"sourceMap": {
							"sourceMapFileInline": false,
							"outputSourceFiles": true,
							"sourceMapBasepath": "src",
							"sourceMapURL": opts.dest+".map"
						} 
					};
				} else {
					var sourceMapPath = opts.dest+".map";
					if (grunt.file.exists(sourceMapPath)) grunt.file.delete(sourceMapPath, {force:true});
					if (grunt.file.exists(sourceMapPath+".imports")) grunt.file.delete(sourceMapPath+".imports", {force:true});
				}

				var lessString = imports.join("\n");
				var lessOptions = _.extend({ "compress": options.compress }, sourcemaps);
				less.render(lessString, lessOptions, (error, output)=>{
					
					if (error) {
						grunt.fail.fatal(JSON.stringify(error, null, 1));
						return;
					}

					grunt.file.write(opts.dest, output.css);
					
					if (output.map) {
						grunt.file.write(opts.dest+".map.imports", imports);
						grunt.file.write(opts.dest+".map", output.map);
					}

					complete();

				});

			});

			var completed = 0;
			var complete = ()=>{
				completed++;
				if (this.files.length !== completed) return;
				done();
			};

	});
}
