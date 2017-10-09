module.exports = function (grunt, options) {
    return {
        options: {
            outputdir: "<%= outputdir %>",
            sourcedir: "<%= sourcedir %>",
            plugins: [
                '<%= sourcedir %>*/bower.json'
            ],
            pluginsFilter: function(filepath) {
                return grunt.config('helpers').includedFilter(filepath) && grunt.config('helpers').scriptSafeFilter(filepath);
            }
        }
    }
};