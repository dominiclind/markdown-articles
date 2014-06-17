module.exports = function(grunt) {

    // configurable paths
    var paths = {
        src: 'src',
        dist: 'build'
    };

    grunt.initConfig({
        paths : paths,
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '<%= paths.src %>/js/.jshintrc'
            },
            files: ['Gruntfile.js', '<%= paths.src %>/js/**/*.js']
        },
        sass: {
            options: {
                style: 'compressed'
            },
            build: {
                files: {
                    '<%= paths.dist %>/css/main.css': '<%= paths.src %>/scss/imports.scss'
                }
            }
        },
        concat : {
            build: {
                files : {
                    '<%= paths.dist %>/js/vendor.js'   : [
                        '<%= paths.src %>/vendor/js/jquery.min.js',
                        '<%= paths.src %>/vendor/js/angular.min.js',
                        '<%= paths.src %>/vendor/js/angular-ui-router.js',
                        '<%= paths.src %>/vendor/js/angular-animate.min.js',
                        '<%= paths.src %>/vendor/js/angular/*.js',
                        '<%= paths.src %>/vendor/js/other/**/*.js'
                    ],
                    '<%= paths.dist %>/js/app.js'      : ['<%= paths.src %>/js/**/*.js'],
                }
            }
        },
        watch: {
            dev : {
                files: ['<%= paths.src %>/**/*','<%= paths.src %>/js/**/*.js'],
                tasks: ['copy:main','sass','concat'],
            }
        },
        useminPrepare: {
            html: '<%= paths.src %>/index.html',
            options: {
                dest: '<%= paths.dist %>'
            }
        },
        usemin: {
            html: ['<%= paths.dist %>/{,*/}*.html'],
            options: {
                dirs: ['<%= paths.dist %>']
            }
        },
        copy: {
            main: {
                files: [
                    {
                        src: ['<%= paths.src %>/index.html'],
                        dest: '<%= paths.dist %>/index.html',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= paths.src %>/fonts/',
                        src: '**',
                        dest: '<%= paths.dist %>/fonts/',
                        flatten: false,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= paths.src %>/views/',
                        src: '**',
                        dest: '<%= paths.dist %>/views/',
                        flatten: false,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= paths.src %>/img/',
                        src: '**',
                        dest: '<%= paths.dist %>/img/',
                        flatten: false,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= paths.src %>/partials/',
                        src: '**',
                        dest: '<%= paths.dist %>/partials/',
                        flatten: false,
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('default', ['copy:main','sass','concat']);
    grunt.registerTask('build', ['sass']);
};