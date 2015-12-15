var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});

module.exports = function(grunt) {
  'use strict';

  // Project configuration
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),

    project: {
      client: 'client',
      server: 'server',
      dist: 'dist',
      css: ['<=% project.client%>/app/**/*.scss'],
      js: ['<%= project.client %>/app/app.module.js',
        '<%= project.client %>/app/app.routes.js',
        '<%= project.client %>/app/app.socket.init.js',
        '<%= project.client %>/{app,components}/**/!(*.spec|*.mock).js'
      ],
      test: 'test'
    },

    shell: {
      dupTest: {
        command: [
          'psql',
          'nodemon scripts/server.js',
          'node test/selenium/duplicationTests.js'
        ].join('&')
      },
      indivTest: {
        command: [
          'psql',
          'nodemon scripts/server.js',
          'node test/selenium/botPiecemealMichelle.js'
        ].join('&')
      },
      start: {
        command: [
          'psql',
          'nodemon scripts/server.js',
        ].join('&')
      }
    },
    // Task configuration
    jshint: {
      options: {
        jshintrc: '_.jshintrc'
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= project.client %>/app/**/*.js',
          '<%= project.server %>/**/*.js',
          '*.js'
        ]
      },
      test: {
        src: ['<%= project.test %>/**/*.js']
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
      }
      // ,
      // test: {
      //   devDependencies: true,
      //   src: '<%= karma.unit.configFile %>',
      //   ignorePath:  /\.\.\//,
      //   fileTypes:{
      //     js: {
      //       block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
      //         detect: {
      //           js: /'(.*\.js)'/gi
      //         },
      //         replace: {
      //           js: '\'{{filePath}}\','
      //         }
      //       }
      //     }
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

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

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
      // all: {
      //   files: ['<%= project.client %>{,*/}**/*.*',
      //     '<%= project.server %>{,*/}**/*.*',
      //   ],
      //   tasks: ['newer:injector:scripts']
      // }
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: ['<%= project.client %>{,*/}**/*.*',
          '<%= project.server %>{,*/}**/*.*',
        ]
      },
      js: {
        files: ['<%= project.client %>/**/*.js'],
        // tasks: ['newer:jshint:all', 'newer:jscs:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      // injectJS: {
      //   files: ['<%= project.client %>/app/app.module.js',
      //     '<%= project.client %>/app/app.routes.js',
      //     '<%= project.client %>/app/app.socket.init.js',
      //     '<%= project.client %>/{app,components}/**/!(*.spec|*.mock).js'
      //   ],
      //   tasks: ['injector:scripts']
      // },
      // injectCss: {
      //   files: ['<%= project.client %>/app.css'],
      //   tasks: ['injector:css']
      // },
      // mochaTest: {
      //   files: ['<%= project.server %>/**/*.{spec,integration}.js'],
      //   tasks: ['env:test', 'mochaTest']
      // },
      // jsTest: {
      //   files: ['<%= project.client %>/{app,components}/**/*.{spec,mock}.js'],
      //   tasks: ['newer:jshint:all', 'wiredep:test', 'karma']
      // },
      // injectSass: {
      //   files: ['<%= project.client %>/{app,components}/**/*.{scss,sass}'],
      //   tasks: ['injector:sass']
      // },
      // sass: {
      //   files: ['<%= project.client %>/{app,components}/**/*.{scss,sass}'],
      //   tasks: ['sass:dev']
      // },
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
  grunt.registerTask('init', ['shell:start']);
  grunt.registerTask('start', ['open', 'watch']);
  grunt.registerTask('testIndiv', ['shell:indivTest']);
  grunt.registerTask('testDup', ['shell:dupTest']);
  // grunt.registerTask('test', ['wiredep', 'karma']);
  // grunt.registerTask('build', ['injector:scripts', 'sass', 'injector:sass', 'wiredep']);
};
