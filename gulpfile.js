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
		.pipe(gulp.dest('./src/'));
});

gulp.task('uglify', function() {
    return gulp.src(['src/**/*.js', '!src/**/*.min.js'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(['src/**/*.js', '!src/**/*.min.js'], ['uglify']);
    gulp.watch('./aljs-ember-app/templates/**/*.hbs', ['emberTemplates']);
    gulp.watch('./aljs-ember-app/**/*.js', ['neuter']);
});

gulp.task('default', ['emberTemplates', 'neuter', 'uglify', 'watch']);