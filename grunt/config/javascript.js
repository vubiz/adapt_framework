module.exports = function (grunt, options) {
    return {
        dev: {
            options: {
                name: 'plugins',
                baseUrl: '<%= sourcedir %>',
                out: '<%= outputdir %>adapt/js/adapt.min.js',
                pluginsPath: '<%= sourcedir %>plugins.js',
                pluginsModule: 'plugins',
                pluginsFilter: function(filepath) {
                    return grunt.config('helpers').includedFilter(filepath);
                },
                generateSourceMaps: true,
                preserveLicenseComments:false,
                optimize: 'none'
            },
            //newer configuration
            files: {
              src: [
                '<%= sourcedir %>/**/*.js'
              ],
              dest: '<%= outputdir %>adapt/js/adapt.min.js'
            }
        },
        compile: {
            options: {
                name: 'adapt-contrib-core/js/app',
                baseUrl: '<%= sourcedir %>',
                out: '<%= outputdir %>adapt/js/adapt.min.js',
                pluginsPath: '<%= sourcedir %>/plugins.js',
                pluginsModule: 'plugins',
                pluginsFilter: function(filepath) {
                    return grunt.config('helpers').includedFilter(filepath);
                },
                preserveLicenseComments:false,
                optimize: 'uglify2',
                uglify2: {
                    compress: false
                }
            }
        }
    }
}
