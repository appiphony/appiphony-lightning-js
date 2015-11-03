var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    neuter = require('gulp-neuter'),
    concat = require('gulp-concat'),
    emberTemplates = require('gulp-ember-templates'),
    zip = require('gulp-zip');

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

gulp.task('zip', function() {
    return gulp.src(['./dist/**/*', '!./dist/**/*.zip'])
        .pipe(zip('aljs.zip'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch(['./public/src/**/*.js', '!./public/src/**/*.min.js'], ['uglify']);
    gulp.watch('./aljs-ember-app/templates/**/*.hbs', ['emberTemplates']);
    gulp.watch('./aljs-ember-app/**/*.js', ['neuter']);
    gulp.watch('./dist/**/*', ['zip']);
});

gulp.task('watchDev', function() {
    gulp.watch(['./public/src/**/*.js', '!./public/src/**/*.min.js'], ['uglify']);
    gulp.watch('./aljs-ember-app/templates/**/*.hbs', ['emberTemplates']);
    gulp.watch('./aljs-ember-app/**/*.js', ['neuterDev']);
    gulp.watch('./dist/**/*', ['zip']);
});

gulp.task('default', ['emberTemplates', 'neuter', 'uglify', 'zip', 'watch']);
gulp.task('dev', ['emberTemplates', 'neuterDev', 'uglify', 'zip', 'watchDev']);