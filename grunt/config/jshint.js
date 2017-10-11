module.exports = function() {

    var reporter;
    try { 
        reporter = require('jshint-stylish') 
    } catch (err) { 
        reporter = null;
    }

    return {
        src: [
            'src/*/js/**/*.js'
        ],
        options: {
            reporter: reporter,
            undef: true,
            asi: true,
            eqnull: false,
            sub: true,
            browser: true,
            es3: true,
            jquery: true,
            globals: {
                Backbone: false,
                Handlebars: false,
                _: false,
                define: false,
                require: false,
                JSON: true
            }
        }
    };

};
