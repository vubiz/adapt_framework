module.exports = function (grunt, options) {
    
    var _ = require("underscore");

    var getUnixPath = function(filepath) {
        // convert to unix style slashes
        return filepath.replace(/\\/g,"/");
    };
    
    var collate = function(collateAtFolderName, destFolder, srcFileName) {
        destFolder = getUnixPath(destFolder);
        srcFileName = getUnixPath(srcFileName);

        // ignore if the srcFileName ends with the collateAtFolderName
        var nameParts = srcFileName.split("/");
        if (nameParts[nameParts.length-1] === collateAtFolderName) {
            return destFolder;
        }

        var startOfCollatePath = srcFileName.indexOf(collateAtFolderName) + collateAtFolderName.length + 1;
        var collatedFilePath = destFolder + srcFileName.substr(startOfCollatePath);

        return collatedFilePath;
    }
    

    var nonServerTasks = {
        courseAssets: {
            files: [
                {
                    expand: true,
                    src: ['<%=languages%>/**/*', '!**/*.json'],
                    cwd: '<%= sourcedir %>course/',
                    dest: '<%= outputdir %>course/'
                }
            ]
        },
        courseJson: {
            files: [
                {
                    expand: true,
                    src: ['<%=languages%>/*.json'],
                    cwd: '<%= sourcedir %>course/',
                    dest: '<%= outputdir %>course/'
                }
            ]
        }
    };    
    
    var mandatoryTasks = {
        assetsTheme: {
            files: [
                {
                    expand: true,
                    src: ['<%= sourcedir %>*/assets/**'],
                    dest: '<%= outputdir %>adapt/css/assets/',
                    order: function(filepaths) {
                        return grunt.config('helpers').sortPathsByPlugin(filepaths);
                    },
                    filter: function(filepath) {
                        return grunt.config('helpers').includedFilter(filepath);
                    },
                    rename: _.partial(collate, "assets")
                },
                {
                    _COMMENT: "for compatibility only",
                    expand: true,
                    src: ['<%= sourcedir %>*/assets/**'],
                    dest: '<%= outputdir %>assets/',
                    order: function(filepaths) {
                        return grunt.config('helpers').sortPathsByPlugin(filepaths);
                    },
                    filter: function(filepath) {
                        return grunt.config('helpers').includedFilter(filepath);
                    },
                    rename: _.partial(collate, "assets")
                }
            ]
        },
        fonts: {
            files: [
                {
                    expand: true,
                    src: ['<%= sourcedir %>*/fonts/**'],
                    dest: '<%= outputdir %>adapt/css/fonts/',
                    order: function(filepaths) {
                        return grunt.config('helpers').sortPathsByPlugin(filepaths);
                    },
                    filter: function(filepath) {
                        return grunt.config('helpers').includedFilter(filepath);
                    },
                    rename: _.partial(collate, "fonts")
                }
            ]
        },
        libraries: {
            files: [
                {
                    expand: true,
                    src: ['*/libraries/**/*'],
                    cwd: '<%= sourcedir %>',
                    dest: '<%= outputdir %>/libraries/',
                    order: function(filepaths) {
                        return grunt.config('helpers').sortPathsByPlugin(filepaths);
                    },
                    filter: function(filepath) {
                        return grunt.config('helpers').includedFilter(filepath);
                    },
                    rename: _.partial(collate, "libraries")
                }
            ]
        },
        required: {
            files: [
                {
                    expand: true,
                    src: ['*/required/**/*'],
                    cwd: '<%= sourcedir %>',
                    dest: '<%= outputdir %>',
                    order: function(filepaths) {
                        return grunt.config('helpers').sortPathsByPlugin(filepaths);
                    },
                    filter: function(filepath) {
                        return grunt.config('helpers').includedFilter(filepath);
                    },
                    rename: _.partial(collate, "required")
                }
            ]
        }
    };

    if (grunt.option("outputdir")) return mandatoryTasks;

    return _.extend({}, nonServerTasks, mandatoryTasks);

};
