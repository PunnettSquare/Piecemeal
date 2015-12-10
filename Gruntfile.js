var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});

module.exports = function(grunt) {
  'use strict';

  // Project configuration
  require('load-grunt-tasks')(grunt);

  var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),

    project: {
      client: 'client',
      server: 'server',
      app: 'app',
      dist: 'dist',
      css: ['<=% project.client%>/app/**/*.scss'],
      js: ['<%= project.client %>/app/app.module.js',
        '<%= project.client %>/app/app.routes.js',
        '<%= project.client %>/app/app.socket.init.js',
        '<%= project.client %>/{app,components}/**/!(*.spec|*.mock).js'
      ]
    },

    // Task configuration
    jshint: {
      files: ['*.js'],
      options: {
        jshintrc: '_.jshintrc'
      }
    },

    uglify: {
      dist: {
        files: {
          '<%= project.dist %>/js/scripts.min.js': '<%= project.js %>'
        }
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
        src: '<%= project.client %>/index.html',
        ignorePath: '<%= project.client %>/',
      },
      // test: {
      //   src: './karma.conf.js',
      //   devDependencies: true
      // }
    },

    connect: {
      options: {
        port: 8080,
        hostname: '*'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [lrSnippet, mountFolder(connect, 'client')];
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
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
    //     src: ['<%= project.server %>/**/*.spec.js']
    //   },
    //   integration: {
    //     src: ['<%= project.server %>/**/*.integration.js']
    //   }
    // },

    // Compiles Sass to CSS
    sass: {
      dev: {
        options: {
          style: "expanded",
          update: true,
          sourcemap: "none",
          noCache: true
        },
        files: {
          '<%= project.client%>/app.css': '<%= project.client %>/app/app.scss'
        }
      },
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= project.dist %>/css/style.css': '<%= project.css %>'
        }
      }
    },


    // nodeunit: {
    //   files: ['test/**/*_test.js']
    // },
    watch: {
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: ['<%= project.client %>{,*/}**/*.*',
          '<%= project.server %>{,*/}**/*.*',
        ]
      },
      // livereload: {
      //   files: [
      //     '{<%= project.client %>}/{app,components}/**/*.{css,html}',
      //     '{<%= project.client %>}/{app,components}/**/!(*.spec|*.mock).js',
      //     '<%= project.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
      //   ],
      //   options: {
      //     livereload: true
      //   }
      // },

      injectJS: {
        files: ['<%= project.client %>/app/app.module.js',
          '<%= project.client %>/app/app.routes.js',
          '<%= project.client %>/app/app.socket.init.js',
          '<%= project.client %>/{app,components}/**/!(*.spec|*.mock).js'
        ],
        tasks: ['injector:scripts']
      },
      injectCss: {
        files: ['<%= project.client %>/app.css'],
        tasks: ['injector:css']
      },
      // mochaTest: {
      //   files: ['<%= project.server %>/**/*.{spec,integration}.js'],
      //   tasks: ['env:test', 'mochaTest']
      // },
      // jsTest: {
      //   files: ['<%= project.client %>/{app,components}/**/*.{spec,mock}.js'],
      //   tasks: ['newer:jshint:all', 'wiredep:test', 'karma']
      // },
      injectSass: {
        files: ['<%= project.client %>/{app,components}/**/*.{scss,sass}'],
        tasks: ['injector:sass']
      },
      sass: {
        files: ['<%= project.client %>/{app,components}/**/*.{scss,sass}'],
        tasks: ['sass:dev']
      },
      // sass: {
      //   files: ['<%= project.client %>/{app,components}/**/*.{scss,sass}'],
      //   tasks: ['sass', 'postcss']
      // },
      // gruntfile: {
      //   files: ['Gruntfile.js']
      // },

      // express: {
      //   files: ['<%= project.server %>/**/*.{js,json}'],
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
          '<%= project.client %>/index.html': [
            ['<%= project.client %>/app/app.module.js',
              '<%= project.client %>/app/app.routes.js',
              '<%= project.client %>/app/socket.module.js',
              '{.tmp,<%= project.client %>}/{app,components}/**/!(*.spec|*.mock).js'
            ]
          ]
        }
      },

      // Inject component scss into app.scss
      sass: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/app/', '');
            filePath = filePath.replace('/client/components/', '../components/');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%= project.client %>/app/app.scss': [
            '<%= project.client %>/{app,components}/**/*.{scss,sass}',
            '!<%= project.client %>/app/app.scss'
          ]
        }
      },

      // Inject component css into index.html
      css: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= project.client %>/index.html': [
            '<%= project.client %>/app.css'
          ]
        }
      }
    }

  });

  // Default task
  grunt.registerTask('default', ['jshint', 'connect:livereload', 'open', 'watch']);
  grunt.registerTask('test', ['wiredep', 'karma']);
  grunt.registerTask('build', ['injector:scripts', 'sass', 'injector:sass', 'wiredep']);
};
