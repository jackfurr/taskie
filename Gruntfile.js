module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      all: ['**/*.js'],
      options: {
        jshintrc: true,
        ignores: [
          'node_modules/**/*.js',
          'public/js/vendor/**/*.js'
          ]
      }
    },
    clean: {
      all: ['./build', './dist'],
      build: ['./build']
    },
    copy: {
      'taskie': {
        files: [
          // includes files within path and its sub-directories
          {
            expand: true,
            src: [
              './**',
              '!./node_modules/**',
              '!./mdm_server/node_modules/**',
              '!./mdm_server/certs/server.*',
              '!./mdm_server/config/env.json',
              '!./mdm_server/Tapper.*',
              '!./mdm_server/Gruntfile.js',
              '!./Gruntfile.js',
              '!./README.md',
              '!./dist',
              '!./build'
                ],
            dest: 'build/'
          }
        ],
      }
    },
    compress: {
      all: {
        options: {
          archive: 'dist/all-<%= meta.revision %>.zip'
        },
        files: [
          { expand: true, src : '**/*', cwd : 'build/' }
        ]
      },
      'taskie': {
        options: {
          archive: 'dist/taskie-<%= meta.revision %>.zip'
        },
        files: [
          { expand: true, src : '**/*', cwd : 'build/' }
        ]
      }
    },
    revision: {
      options: {
        property: 'meta.revision',
        ref: 'HEAD',
        short: true
      }
    },
    'revision-count': {
      options: {
        property: 'build_count',
        ref: 'HEAD'
      }
    },
    'string-replace': {
        'taskie-version': {
          files: {
            'build/':'version.json'
          },
          options: {
            replacements: [{
              pattern: /{{ BUILD_DATE }}/g,
              replacement: '<%= grunt.template.today("yyyy-mm-dd HH:mm:ss Z") %>'
            },
            {
              pattern: /{{ REVISION }}/g,
              replacement: '<%= meta.revision %>'
            },
            {
              pattern: /{{ BUILD }}/g,
              replacement: '<%= build_count %>'
            },
            {
              pattern: /{{ MAJOR_MINOR }}/g,
              replacement: "<%= pkg.version.split('.')[0] + '.' + pkg.version.split('.')[1] + '.' %>"
            }]
          }
        }
      }
    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-git-revision');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-git-revision-count');

    // define the tasks

    grunt.registerTask(
      'build',
      'Makes a taskie server build.',
      ['clean:all', 'copy:taskie', 'revision-count', 'revision', 'string-replace:taskie-version', 'compress:taskie']
    );

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

};