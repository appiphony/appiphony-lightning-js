var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    neuter = require('gulp-neuter'),
    concat = require('gulp-concat'),
    emberTemplates = require('gulp-ember-templates'),
    zip = require('gulp-zip'),
    runSequence = require('run-sequence');

gulp.task('build', function() {
    /* ----------------------------------------
    Salesforce Lightning Design System
    ---------------------------------------- */
    return gulp.src('node_modules/@salesforce-ux/design-system/assets/**/*')
        .pipe(gulp.dest('assets'));
});

gulp.task('emberTemplates', function() {
	gulp.src('./aljs-ember-app/templates/**/*.hbs')
    .pipe(emberTemplates({type: 'browser'}))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./aljs-ember-app/'));
});

gulp.task('concatAll', function() {
    var buildOrder = [
        './public/src/jquery.aljs-init.js',
        './public/src/jquery.aljs-datepicker.js',
        './public/src/jquery.aljs-icon-group.js',
        './public/src/jquery.aljs-lookup.js',
        './public/src/jquery.aljs-modal.js',
        './public/src/jquery.aljs-multi-select.js',
        './public/src/jquery.aljs-notification.js',
        './public/src/jquery.aljs-picklist.js',
        './public/src/jquery.aljs-pill.js',
        './public/src/jquery.aljs-popover.js',
        './public/src/jquery.aljs-tabs.js'
    ]
    
    return gulp.src(buildOrder)
        .pipe(concat('jquery.aljs-all.js'))
		.pipe(gulp.dest('./public/src'));
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
        .pipe(gulp.dest('./dist'));
});

gulp.task('zip', function() {
    return gulp.src(['./dist/**/*', '!./dist/**/*.zip'])
        .pipe(zip('aljs.zip'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch(['./public/src/**/*.js', '!./public/src/**/*.min.js', '!./public/src/jquery.aljs-all.js'], ['concatAll']);
    gulp.watch(['./public/src/**/*.js', '!./public/src/**/*.min.js'], ['uglify']);
    gulp.watch('./aljs-ember-app/templates/**/*.hbs', ['emberTemplates']);
    gulp.watch('./aljs-ember-app/**/*.js', ['neuter']);
    gulp.watch('./dist/**/*', ['zip']);
});

gulp.task('watchDev', function() {
    gulp.watch(['./public/src/**/*.js', '!./public/src/**/*.min.js', '!./public/src/jquery.aljs-all.js'], ['concatAll']);
    gulp.watch(['./public/src/**/*.js', '!./public/src/**/*.min.js'], ['uglify']);
    gulp.watch('./aljs-ember-app/templates/**/*.hbs', ['emberTemplates']);
    gulp.watch('./aljs-ember-app/**/*.js', ['neuterDev']);
    gulp.watch('./dist/**/*', ['zip']);
});

gulp.task('default', ['emberTemplates', 'concatAll', 'neuter', 'uglify', 'zip', 'watch']);
gulp.task('dev', ['emberTemplates', 'concatAll', 'neuterDev', 'uglify', 'zip', 'watchDev']);

gulp.task('dev', ['build'], function() {
    runSequence();
});