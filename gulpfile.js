'use strict';

var $    = require('gulp-load-plugins')();
var gulp = require('gulp');

gulp.task('log-plugins', function () {
    console.info(Object.getOwnPropertyNames($));
});

gulp.task('jshint', function () {
    gulp.src('index.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});
