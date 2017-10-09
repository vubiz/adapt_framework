var grunt = require("grunt");
var path = require("path");
var _ = require("underscore");
_.mixin({deepExtend: require("underscore-deep-extend")(_) });

var configurations = module.exports = {

    addConfigFiles: function(sourcedir, requireJSOptions) {

        if (!requireJSOptions.mainConfigFile) {
            requireJSOptions.mainConfigFile = [];
        }

        grunt.file.expand({ 
            order: grunt.config("helpers").sortPathsByPlugin 
        }, path.join(sourcedir, "*/config.js")).forEach(function(configJSPath) {
            requireJSOptions.mainConfigFile.push(configJSPath);
        });

    },

    getCombinedConfig: function(sourcedir) {

        var config = {};
        var requireProxy = {
            config: function(pluginConfig) {
                _.deepExtend(config, pluginConfig)
            }
        };

        grunt.file.expand({ 
            order: grunt.config("helpers").sortPathsByPlugin 
        }, path.join(sourcedir, "*/config.js")).forEach(function(configJSPath) {
            new Function("require", "requirejs", grunt.file.read(configJSPath))(requireProxy, requireProxy);
        });

        return config;

    },

    getNamespacesConfig: function(sourcedir) {

        var config = configurations.getCombinedConfig(sourcedir);
        if (!config.map || !config.map['*']) {
            return {};
        }
        var map = config.map['*'];

        var namespacesConfig = {};
        for (var k in map) {
            namespacesConfig[k+"/"] = map[k] ? map[k]+"/" : map[k];
        }

        return namespacesConfig;

    }

};