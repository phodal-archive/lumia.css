module.exports = function (grunt) {

// -- Config -------------------------------------------------------------------

grunt.initConfig({

    pkg  : grunt.file.readJSON('package.json'),
    bower: grunt.file.readJSON('bower.json'),

    bower_json: {
        release: {
            values: {
                main: 'pure.css'
            },

            dest: 'build/'
        }
    },

    clean: {
        build    : ['build/'],
        build_res: ['build/*-r.css'],
        release  : ['release/<%= pkg.version %>/']
    },

    copy: {
        build: {
            src    : 'src/**/css/*.css',
            dest   : 'build/',
            expand : true,
            flatten: true
        },

        release: {
            src : '{LICENSE.md,README.md,HISTORY.md}',
            dest: 'build/'
        }
    },

    concat: {
        build: {
            files: [
                {'build/base.css': [
                    'bower_components/normalize-css/normalize.css',
                    'build/base.css'
                ]},

                {'build/buttons.css': [
                    'build/buttons-core.css',
                    'build/buttons.css'
                ]},

                {'build/forms-nr.css': [
                    'build/forms.css'
                ]},

                {'build/forms.css': [
                    'build/forms-nr.css',
                    'build/forms-r.css'
                ]},

                {'build/grids.css': [
                    'build/grids-core.css',
                    'build/grids-units.css'
                ]},

                {'build/menus.css': [
                    'build/menus-core.css',
                    'build/menus-horizontal.css',
                    'build/menus-dropdown.css',
                    'build/menus-scrollable.css',
                    'build/menus-skin.css'
                ]},

                {'build/<%= pkg.name %>.css': [
                    'build/base.css',
                    'build/grids.css',
                    'build/buttons.css',
                    'build/forms.css',
                    'build/menus.css',
                    'build/tables.css'
                ]},

                {'build/<%= pkg.name %>-nr.css': [
                    'build/base.css',
                    'build/grids.css',
                    'build/buttons.css',
                    'build/forms-nr.css',
                    'build/menus.css',
                    'build/tables.css'
                ]}
            ]
        }
    },

    csslint: {
        options: {
            csslintrc: '.csslintrc'
        },

        base   : ['src/base/css/*.css'],
        buttons: ['src/buttons/css/*.css'],
        forms  : ['src/forms/css/*.css'],
        grids  : ['src/grids/css/*.css'],
        menus  : ['src/menus/css/*.css'],
        tables : ['src/tables/css/*.css']
    },

    cssmin: {
        options: {
            noAdvanced: true
        },

        files: {
            expand: true,
            src   : 'build/*.css',
            ext   : '-min.css'
        }
    },

    compress: {
        release: {
            options: {
                archive: 'release/<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.tar.gz'
            },

            expand : true,
            flatten: true,
            src    : 'build/*',
            dest   : '<%= pkg.name %>/<%= pkg.version %>/'
        }
    },

    license: {
        normalize: {
            options: {
                banner: [
                    '/*!',
                    'normalize.css v<%= bower.devDependencies["normalize-css"] %> | MIT License | git.io/normalize',
                    'Copyright (c) Nicolas Gallagher and Jonathan Neal',
                    '*/\n'
                ].join('\n')
            },

            expand: true,
            cwd   : 'build/',
            src   : ['base*.css', '<%= pkg.name %>*.css']
        },

        yahoo: {
            options: {
                banner: [
                    '/*!',
                    'Lumia.Css v<%= pkg.version %>',
                    'Copyright 2015 Phodal All rights reserved.',
                    'Licensed under the MIT License.',
                    'https://github.com/phodal/lumia.css/blob/master/LICENSE.md',
                    '*/\n'
                ].join('\n')
            },

            expand: true,
            src   : ['build/*.css']
        }
    },

    pure_grids: {
        default_units: {
            dest: 'build/grids-units.css',

            options: {
                units: [5, 24]
            }
        },

        responsive: {
            dest: 'build/grids-responsive.css',

            options: {
                mediaQueries: {
                    sm: 'screen and (min-width: 35.5em)',   // 568px
                    md: 'screen and (min-width: 48em)',     // 768px
                    lg: 'screen and (min-width: 64em)',     // 1024px
                    xl: 'screen and (min-width: 80em)'      // 1280px
                }
            }
        }
    },

    stripmq: {
        all: {
            files: {
                //follows the pattern 'destination': ['source']
                'build/grids-responsive-old-ie.css':
                    ['build/grids-responsive.css']
            }
        }
    },

    css_selectors: {
        base: {
            src : 'build/base.css',
            dest: 'build/base-context.css',

            options: {
                mutations: [{prefix: '.pure'}]
            }
        }
    },

    observe: {
        src: {
            files: 'src/**/css/*.css',
            tasks: ['test', 'suppress', 'build'],

            options: {
                interrupt: true
            }
        }
    }
});

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-csslint');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-compress');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-css-selectors');
grunt.loadNpmTasks('grunt-pure-grids');
grunt.loadNpmTasks('grunt-stripmq');

grunt.registerTask('default', ['import', 'test', 'build']);
grunt.registerTask('import', ['bower_install']);
grunt.registerTask('test', ['csslint']);
grunt.registerTask('build', [
    'clean:build',
    'copy:build',
    'pure_grids',
    'stripmq',
    'concat:build',
    'clean:build_res',
    'css_selectors:base',
    'cssmin',
    'license'
]);

grunt.renameTask('watch', 'observe');
grunt.registerTask('watch', ['default', 'observe']);

grunt.registerTask('release', [
    'default',
    'clean:release',
    'copy:release',
    'bower_json:release',
    'compress:release'
]);

};