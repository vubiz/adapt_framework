var grunt = require("grunt");
var path = require("path");
var _ = require("underscore");
var Plugin = require("./plugin");

class Plugins extends Array {

  constructor(options) {

    super(0);

    this.dir = options.dir;
    this.types = options.types;

    this._loadPlugins();
    this._resolvePluginsOrder();

  }

  _loadPlugins() {
    
    var glob = path.join(this.dir, "*/bower.json");
    grunt.file.expand({}, glob).forEach((bowerJSONPath)=>{

      var parsedPath = path.parse(bowerJSONPath);
      this.push(new Plugin({
        dir: parsedPath.dir, 
        types: this.types
      }));

    });

  }

  _resolvePluginsOrder() {

    // segregate each plugin type into a namespace of 1million plugins
    var pluginTypeOrder = {};
    this.types.forEach((name, index)=>{
      pluginTypeOrder[name] = index * 1000000;
    });

    // resolve plugin dependencies and assign order based upon type
    var resolvedPlugins = {};
    var unresolvedPlugins = this.toArray();
    var currentUnresolvedIndex = 0;
    var hasResolvedInUpSide = false;

    do {

      if (currentUnresolvedIndex >= unresolvedPlugins.length) {
        if (!hasResolvedInUpSide) {
          // has been through the whole list and not resolved anything
          console.log("unresolvable");
          break;
        }
        // go back to beginning and try again
        currentUnresolvedIndex = 0;
        hasResolvedInUpSide = false;
      }

      var currentPlugin = unresolvedPlugins[currentUnresolvedIndex];
      var hasNoDependencies = (currentPlugin.dependencies.length === 0);
      var firstUnresolvedDependency = currentPlugin.dependencies.find(function(dependency) {
        return !resolvedPlugins[dependency];
      });
      var hasNoUnresolvedDependencies = (!firstUnresolvedDependency);

      if (hasNoDependencies || hasNoUnresolvedDependencies) {
        resolvedPlugins[currentPlugin.name] = currentPlugin;
        if (!hasNoDependencies) {
          pluginTypeOrder[currentPlugin.type]++;
        }
        currentPlugin.order = pluginTypeOrder[currentPlugin.type];
        unresolvedPlugins.splice(currentUnresolvedIndex, 1);
        hasResolvedInUpSide = true;
        continue;
      }

      // cannot resolve current plugin, move to next
      currentUnresolvedIndex++;

    } while(unresolvedPlugins.length);

  }

  getOrder() {

    // simplify and cache results for later use
    var pluginOrder = {};
    this.forEach(function(plugin) {
      pluginOrder[plugin.name] = plugin.order;
    });

    return pluginOrder;

  }

  toArray() {

    var rtn = [];
    for (var i = 0, l = this.length; i < l; i++) {
      rtn.push(this[i]);
    }

    return rtn;

  }

}


module.exports = Plugins;