module.exports = function(grunt) {
    var helpers = require('./grunt/helpers')(grunt);

    try {
        require('time-grunt')(grunt);
    } catch (err) {

    }
    
    require('load-grunt-config')(grunt, {
        data: helpers.generateConfigData(),
        configPath: __dirname + '/grunt/config',
        jitGrunt: {
            customTasksDir: __dirname + '/grunt/tasks',
            staticMappings: {
                bower: 'grunt-bower-requirejs'
            }
        }
    });

    grunt.config('helpers', helpers);
    grunt.registerTask('default', ['help']);
};
