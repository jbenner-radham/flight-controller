'use strict';

var $    = require('gulp-load-plugins')();
var gulp = require('gulp');

// Debug task that simply logs the Gulp plugins loaded into `$` to stdout.
gulp.task('log-plugins', function () {
    console.info(Object.getOwnPropertyNames($));
});

gulp.task('jshint', function () {
    gulp.src('index.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('build', function () {
    ///// $.util.log(process.cwd());
    gulp.src('src/**/*.js')

        // Compile ES6/Harmony code into ES5.
        .pipe($.esnext())

        // Convert any double quotes into single quotes for strings.
        .pipe($.esformatter())
        .pipe(gulp.dest('dist'));
});
