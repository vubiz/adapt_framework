/**
* For production
*/
module.exports = function(grunt) {
    grunt.registerTask('build', 'Creates a production-ready build of the course', [
        '_log-vars',
        'check-json',
        'schema-defaults',
        'clean:output',
        'copy',
        'handlebars',
        'create-json-config',
        'tracking-insert',
        'javascript:compile',
        'clean:dist',
        'less:compile',
        'datamanifest',
        'replace',
        'scripts:adaptpostbuild',
        'minify'
    ]);
};
