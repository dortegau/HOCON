module.exports = function(grunt) {

  grunt.initConfig({
     jshint: {
       files: {
         src: ['Gruntfile.js', 'lib/**/*.js', 'spec/**/*.js']
       },
       options : {
         node: true,
         camelcase: true
       }
     },
     mochaTest: {
       test: {
         options: {
           reporter: 'spec'
         },
         src: ['spec/**/*-spec.js']
       }
     }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('default', ['jshint', 'test']);
};
