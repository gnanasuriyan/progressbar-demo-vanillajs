/**
* @Author: Gnanasuriyan
* Contains gulp taks which will be used for automatting many development activities.
*/

'use strict';

var gulp = require('gulp'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    read = require('fs').readFileSync,
    reporter = require('jshint-stylish'),
    serve = require('gulp-serve'),
    jslint = require('gulp-jslint'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    runSequence = require('run-sequence'),
    htmlreplace = require('gulp-html-replace'),
    cleanCSS = require('gulp-clean-css');

gulp.task('less', function() {
  gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('src/css'));
});

gulp.task('jslint', function() {
	return gulp.src(['src/js/**/*.js'])
            .pipe(jslint())
            .pipe(jslint.reporter('default'));
});

gulp.task('watch', function() {
	return watch(['src/less/*.less', 'src/js/**/*.js'], function(){
		gulp.start('less');
		//gulp.start('jslint');
	});
});

gulp.task('compress', function() {
    gulp.src(['src/app.js', 'src/js/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(minify())
    .pipe(gulp.dest('dist/js'));;
});

gulp.task('minify-css', function() {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('replace', function() {
    gulp.src('src/index.html')
    .pipe(htmlreplace({
        'js': 'js/app-min.js'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', function() {
    runSequence('compress', 'less', 'minify-css', 'replace', function(){
        console.log('build files has been generated');
    });
});

gulp.task('serve', serve('src'));
gulp.task('serve-prod', serve('dist'));
