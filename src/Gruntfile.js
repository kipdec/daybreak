module.exports = function(grunt) {
  // Do grunt-related things in here
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 9000,
          keepalive: true,
          open: true,

        }
      }
    }
  });
};