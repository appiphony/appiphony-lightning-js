var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    neuter = require('gulp-neuter'),
    concat = require('gulp-concat'),
    emberTemplates = require('gulp-ember-templates'),
    zip = require('gulp-zip'),
    mergeStream = require('merge-stream'),
    runSequence = require('run-sequence');

gulp.task('build', function() {
    /* ----------------------------------------
    Salesforce Lightning Design System
    ---------------------------------------- */
    var slds = gulp.src('node_modules/@salesforce-ux/design-system/assets/**/*')
        .pipe(gulp.dest('./public/assets'));
    
    /* ----------------------------------------
    Moment.js
    ---------------------------------------- */
    var moment = gulp.src('node_modules/moment/moment.js')
        .pipe(gulp.dest('./public/lib/moment'));
    
    return mergeStream(slds, moment);
});

gulp.task('emberTemplates', function() {
	gulp.src('./aljs-ember-app/templates/**/*.hbs')
    .pipe(emberTemplates({type: 'browser'}))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./aljs-ember-app/'));
});

gulp.task('neuter', function() {
    gulp.src('aljs-ember-app/aljs-compiler.js')
        .pipe(neuter('aljs.pck.js', null, {
            basePath: 'aljs-ember-app/'
        }))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('concat', function() {
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
    ];
    
    return gulp.src(buildOrder)
        .pipe(concat('jquery.aljs-all.js'))
		.pipe(gulp.dest('./public/src'));
});

gulp.task('concatWithMoment', function() {
    var buildOrder = [
        './public/lib/moment/moment.js',
        './public/src/jquery.aljs-all.js'
    ];
    
    return gulp.src(buildOrder)
        .pipe(concat('jquery.aljs-all-with-moment.js'))
		.pipe(gulp.dest('./public/src'));
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

gulp.task('dist', function() {
    return runSequence('concat', 'concatWithMoment', 'uglify', 'zip');
});

gulp.task('watch', function() {
    gulp.watch('./aljs-ember-app/templates/**/*.hbs', ['emberTemplates']);
    gulp.watch('./aljs-ember-app/**/*.js', ['neuter']);
    gulp.watch(['./public/src/**/*.js', '!./public/src/**/*.min.js', '!./public/src/jquery.aljs-all.js', '!./public/src/jquery.aljs-all-with-moment.js'], ['dist']);
});

gulp.task('default', ['build'], function() {
    return runSequence('emberTemplates', 'neuter', 'dist', 'watch');
});