module.exports = function(grunt) {
  'use strict';
  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),

    app: {
      client: 'client',
      server: 'server',
      dist: 'dist'
    },

    // Task configuration
    jshint: {
      options: {
        node: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        eqnull: true,
        globals: {
          jQuery: true
        },
        boss: true
      },
      gruntfile: {
        src: 'gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },

    // Automatically inject Bower components into the app and karma.conf.js
    wiredep: {
      options: {
        exclude: [
          /bootstrap.js/,
          '/json3/',
          '/es5-shim/',
          /font-awesome\.css/,
          /bootstrap\.css/,
          /bootstrap-sass-official/,
          /bootstrap-social\.css/
        ]
      },
      client: {
        src: '<%= app.client %>/index.html',
        ignorePath: '<%= app.client %>/',
      },
      // test: {
      //   src: './karma.conf.js',
      //   devDependencies: true
      // }
    },

    // karma: {
    //   unit: {
    //     configFile: 'karma.conf.js',
    //     singleRun: true
    //   }
    // },

    // mochaTest: {
    //   options: {
    //     reporter: 'spec',
    //     require: 'mocha.conf.js',
    //     timeout: 5000 // set default mocha spec timeout
    //   },
    //   unit: {
    //     src: ['<%= app.server %>/**/*.spec.js']
    //   },
    //   integration: {
    //     src: ['<%= app.server %>/**/*.integration.js']
    //   }
    // },

    // Compiles Sass to CSS
    // sass: {
    //   server: {
    //     options: {
    //       compass: false
    //     },
    //     files: {
    //       '.tmp/app/app.css': '<%= app.client %>/app/app.scss'
    //     }
    //   }
    // },



    // nodeunit: {
    //   files: ['test/**/*_test.js']
    // },
    watch: {
      injectJS: {
        files: ['<%= app.client %>/app/app.module.js',
          '<%= app.client %>/app/app.routes.js',
          '<%= app.client %>/app/app.socket.init.js',
          '<%= app.client %>/{app,components}/**/!(*.spec|*.mock).js',
          '!<%= app.client %>/app/app.js'
        ],
        tasks: ['injector:scripts']
      },
      // injectCss: {
      //   files: ['<%= app.client %>/{app,components}/**/*.css'],
      //   tasks: ['injector:css']
      // },
      // mochaTest: {
      //   files: ['<%= app.server %>/**/*.{spec,integration}.js'],
      //   tasks: ['env:test', 'mochaTest']
      // },
      // jsTest: {
      //   files: ['<%= app.client %>/{app,components}/**/*.{spec,mock}.js'],
      //   tasks: ['newer:jshint:all', 'wiredep:test', 'karma']
      // },
      // injectSass: {
      //   files: ['<%= app.client %>/{app,components}/**/*.{scss,sass}'],
      //   tasks: ['injector:sass']
      // },
      // sass: {
      //   files: ['<%= app.client %>/{app,components}/**/*.{scss,sass}'],
      //   tasks: ['sass', 'postcss']
      // },
      // gruntfile: {
      //   files: ['Gruntfile.js']
      // },
      // livereload: {
      //   files: [
      //     '{.tmp,<%= app.client %>}/{app,components}/**/*.{css,html}',
      //     '{.tmp,<%= app.client %>}/{app,components}/**/!(*.spec|*.mock).js',
      //     '<%= app.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
      //   ],
      //   options: {
      //     livereload: true
      //   }
      // },
      // express: {
      //   files: ['<%= app.server %>/**/*.{js,json}'],
      //   tasks: ['express:dev', 'wait'],
      //   options: {
      //     livereload: true,
      //     spawn: false //Without this option specified express won't be reloaded
      //   }
      // },
      // bower: {
      //   files: ['bower.json'],
      //   tasks: ['wiredep']
      // },
    },

    injector: {
      options: {

      },
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= app.client %>/index.html': [
            ['<%= app.client %>/app/socket.module.js',
              '<%= app.client %>/app/app.module.js',
              '<%= app.client %>/app/app.routes.js',
              '{.tmp,<%= app.client %>}/{app,components}/**/!(*.spec|*.mock).js',
              '!{.tmp,<%= app.client %>}/app/app.js'
            ]
          ]
        }
      },



      // Inject component scss into app.scss
      // sass: {
      //   options: {
      //     transform: function(filePath) {
      //       filePath = filePath.replace('/client/app/', '');
      //       filePath = filePath.replace('/client/components/', '../components/');
      //       return '@import \'' + filePath + '\';';
      //     },
      //     starttag: '// injector',
      //     endtag: '// endinjector'
      //   },
      //   files: {
      //     '<%= app.client %>/app/app.scss': [
      //       '<%= app.client %>/{app,components}/**/*.{scss,sass}',
      //       '!<%= app.client %>/app/app.{scss,sass}'
      //     ]
      //   }
      // },

      // Inject component css into index.html
      // css: {
      //   options: {
      //     transform: function(filePath) {
      //       filePath = filePath.replace('/client/', '');
      //       filePath = filePath.replace('/.tmp/', '');
      //       return '<link rel="stylesheet" href="' + filePath + '">';
      //     },
      //     starttag: '<!-- injector:css -->',
      //     endtag: '<!-- endinjector -->'
      //   },
      //   files: {
      //     '<%= app.client %>/index.html': [
      //       '<%= app.client %>/{app,components}/**/*.css'
      //     ]
      //   }
      // }
    }

  });

  // These plugins provide necessary tasks
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-injector');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-sass');


  // Default task
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', ['injector', 'wiredep']);
};
