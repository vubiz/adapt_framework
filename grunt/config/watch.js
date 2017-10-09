// TODO excludes
module.exports = {
    bowerJson: {
        files: ['<%= sourcedir %>*/bower.json'],
        tasks: ['dev']
    },
    scripts: {
        files: ['<%= sourcedir %>*/scripts/*'],
        tasks: ['dev']
    },
    less: {
        files: ['<%= sourcedir %>*/less/**/*.less'],
        tasks: ['less:dev']
    },
    handlebars: {
        files: ['<%= sourcedir %>*/templaates/**/*.hbs'],
        tasks: ['handlebars', 'javascript:dev']
    },
    courseJson: {
        files: ['<%= sourcedir %>course/**/*.json'],
        tasks : ['jsonlint', 'check-json', 'copy:courseJson', 'schema-defaults', 'create-json-config']
    },
    courseAssets: {
        files: ['<%= sourcedir %>course/<%=languages%>/*', '!<%= sourcedir %>course/<%=languages%>/*.json'],
        tasks : ['copy:courseAssets']
    },
    js: {
        files: [
            '<%= sourcedir %>**/js/**/*.js'
        ],
        tasks: ['javascript:dev']
    },
    assets: {
        files: ['<%= sourcedir %>*/assets/**'],
        tasks: ['copy:assets']
    },
    fonts: {
        files: ['<%= sourcedir %>*/fonts/**'],
        tasks: ['copy:fonts']
    },
    libraries: {
        files: [
            '<%= sourcedir %>*/libraries/**'
        ],
        tasks: ['copy:libraries']
    },
    required: {
        files: ['<%= sourcedir %>*/required/**'],
        tasks: 'copy:required'
    }
}
