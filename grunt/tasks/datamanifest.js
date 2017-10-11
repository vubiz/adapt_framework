module.exports = function(grunt) {

    grunt.registerMultiTask('datamanifest', 'Compile a list of jsons', function() {

      var _ = require('underscore');
      var path = require("path");
      var done = this.async();
      var options = this.options({});
      
      var completed = 0;
      var complete = ()=>{
        completed++;
        if (this.files.length < completed) return;

        grunt.file.write(options.output, JSON.stringify(directives))

        done();
      };

      var directives = [];
      this.files.forEach((opts)=>{

        opts.src.forEach((jsonPath)=>{
          directives.push( jsonPath.substr(options.outputdir.length) );

        });

        complete();

      });

      if (!this.files.length) {
        complete();
      }

  });
}
