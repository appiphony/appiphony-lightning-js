var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');
    neuter = require('gulp-neuter');
    concat = require('gulp-concat');
    emberTemplates = require('gulp-ember-templates');

gulp.task('emberTemplates', function() {
	gulp.src('./aljs-ember-app/templates/**/*.hbs')
    .pipe(emberTemplates({type: 'browser'}))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./aljs-ember-app/'));
});

gulp.task('neuter', function() {
	gulp.src('./aljs-ember-app/aljs-compiler.js')
		.pipe(neuter('aljs.pck.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
		.pipe(gulp.dest('./public/js'));
});

gulp.task('neuterDev', function() {
    gulp.src('aljs-ember-app/aljs-compiler.js')
        .pipe(neuter('aljs.pck.js', null, {
            basePath: 'aljs-ember-app/'
        }))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('uglify', function() {
    return gulp.src(['./public/src/**/*.js', '!./public/src/**/*.min.js'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/jquery'));
});

gulp.task('watch', function() {
    gulp.watch(['./public/src/**/*.js', '!./public/src/**/*.min.js'], ['uglify']);
    gulp.watch('./aljs-ember-app/templates/**/*.hbs', ['emberTemplates']);
    gulp.watch('./aljs-ember-app/**/*.js', ['neuter']);
});

gulp.task('watchDev', function() {
    gulp.watch(['./public/src/**/*.js', '!./public/src/**/*.min.js'], ['uglify']);
    gulp.watch('./aljs-ember-app/templates/**/*.hbs', ['emberTemplates']);
    gulp.watch('./aljs-ember-app/**/*.js', ['neuterDev']);
});

gulp.task('default', ['emberTemplates', 'neuter', 'uglify', 'watch']);
gulp.task('dev', ['emberTemplates', 'neuterDev', 'uglify', 'watchDev']);