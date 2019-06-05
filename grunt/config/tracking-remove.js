module.exports = function(grunt) {
  return {
    options: {
        courseFile: '*/course.<%= jsonext %>',
        blocksFile: '*/blocks.<%= jsonext %>'
    }
  };
};
