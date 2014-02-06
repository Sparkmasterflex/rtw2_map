/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'stylesheets/src/base.css': 'stylesheets/sass/base.scss',
          'stylesheets/src/structures.css': 'stylesheets/sass/structures.scss',
          'stylesheets/src/skins.css': 'stylesheets/sass/skins.scss',
          'stylesheets/src/forms.css': 'stylesheets/sass/forms.scss',
          'stylesheets/src/icons.css': 'stylesheets/sass/icons.scss',
          'stylesheets/src/responsive.css': 'stylesheets/sass/responsive.scss'
        }
      }
    },


    coffee: {
      compile: {
        files: [{
          expand: true,
          cwd: "javascripts/coffee",
          src: ["**/*.coffee", "views/*.coffee"],
          dest: "javascripts",
          ext: ".js"
        }]
      }
    },

    cssmin: {
      add_banner: {
        options: {
          banner: '/* My minified css file */'
        },
        files: {
          'stylesheets/main.css': ['stylesheets/src/*.css']
        }
      }
    },

    watch: {
      options: {
        livereload: true,
      },
      coffee: {
        files: ['javascripts/coffee/*'],
        tasks: 'coffee'
      },
      sass: {
        options: { livereload: false },
        files: ['stylesheets/sass/*.scss'],
        tasks: ['sass', 'cssmin']
      }
    }
  });

  // Load necessary plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['watch']);

};