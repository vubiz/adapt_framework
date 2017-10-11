module.exports = function(grunt) {

  return {
    courseJson: {
      options: {
        outputdir: '<%= outputdir %>',
        output: "<%= outputdir %>/adapt/data/manifest.js"
      },
      files: [
          {
              expand: true,
              src: ['<%=languages%>/*.json'],
              cwd: '<%= outputdir %>course/'
          }
      ]
    }
  }

};