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
