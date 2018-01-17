/**
* @Author: Gnanasuriyan
* Contains gulp taks which will be used for automatting many development activities.
*/

'use strict';

var gulp = require('gulp'),
    less = require('gulp-less'),
    read = require('fs').readFileSync;

var serve = require('gulp-serve');
var jslint = require('gulp-jslint');

gulp.task('less', function() {
  gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('src/css'))
    .pipe(livereload());
});

gulp.task('jslint', function() {

});

gulp.task('watch', ['less', 'jslint']);

gulp.task('serve', serve('src'));

gulp.task('serve-prod', serve('prod'));
