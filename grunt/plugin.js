var grunt = require("grunt");
var path = require("path");
var _ = require("underscore");

class Plugin {

  constructor(options) {

    var bower = grunt.file.readJSON(path.join(options.dir, "bower.json"));
    var type = _.find(options.types, (type)=>{
      // lookup plugin type by bower.json[keywords] array
      var keywordTypeNoS = "adapt-"+type.slice(0, -1);
      var keywordType = "adapt-"+type;

      return bower.keywords.indexOf(keywordTypeNoS) !== -1 || bower.keywords.indexOf(keywordType) !== -1;

    });

    this.name = bower.name;
    this.type = type;
    this.order = null;
    this.dependencies = Object.keys(bower.dependencies || {});

    this._bower = bower;

  }

}

module.exports = Plugin;