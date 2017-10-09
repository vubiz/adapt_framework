module.exports = function (grunt, options) {
    return {
        dev: {
            options:{
                baseUrl: '<%= sourcedir %>',
                config: '<%= outputdir %>course/config.json',
                sourcemaps: true,
                compress: false
            },
            files: [{
                src: [
                    '<%= sourcedir %>/**/*.less'
                ],
                dest: '<%= outputdir %>adapt/css/adapt.css',
                order: function(filepaths) {
                    return grunt.config('helpers').sortPathsByPlugin(filepaths);
                },
                filter: function(filepath) {
                    return grunt.config('helpers').includedFilter(filepath);
                }
            }]
        },
        compile: {
            options: {
                baseUrl: '<%= sourcedir %>',
                config: '<%= outputdir %>course/config.json',
                sourcemaps: false,
                compress: true
            },
            files: [{
                src: [
                    '<%= sourcedir %>/**/*.less'
                ],
                dest: '<%= outputdir %>adapt/css/adapt.css',
                order: function(filepaths) {
                    return grunt.config('helpers').sortPathsByPlugin(filepaths);
                },
                filter: function(filepath) {
                    return grunt.config('helpers').includedFilter(filepath);
                }
            }]
        }
    }
}
