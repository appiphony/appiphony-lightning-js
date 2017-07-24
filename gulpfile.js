var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    neuter = require('gulp-neuter'),
    concat = require('gulp-concat'),
    insert = require('gulp-insert'),
    emberTemplates = require('gulp-ember-templates'),
    zip = require('gulp-zip'),
    mergeStream = require('merge-stream'),
    runSequence = require('run-sequence'),
    versionNumber = '4.0.0 (Nightly)',
    copyrightYear = '2017';

gulp.task('build', function() {
    /* ----------------------------------------
    Salesforce Lightning Design System
    ---------------------------------------- */
    var slds = gulp.src('./node_modules/@salesforce-ux/design-system/assets/**/*')
        .pipe(gulp.dest('./public/assets'));
    
    /* ----------------------------------------
    Moment.js
    ---------------------------------------- */
    var moment = gulp.src('./node_modules/moment/moment.js')
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
    gulp.src('./aljs-ember-app/aljs-compiler.js')
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

gulp.task('insert', function() {
    var prependedComments = '';
    prependedComments += '/* --------------------------------------------------\r\n';
    prependedComments += 'Appiphony Lightning JS\r\n';
    prependedComments += '\r\n';
    prependedComments += 'Version: ' + versionNumber + '\r\n';
    prependedComments += 'Website: http://aljs.appiphony.com\r\n';
    prependedComments += 'GitHub: https://github.com/appiphony/appiphony-lightning-js\r\n';
    prependedComments += 'License: BSD 2-Clause License\r\n';
    prependedComments += '-------------------------------------------------- */\r\n';
    
    var appendedComments = '\r\n';
    appendedComments += '/* --------------------------------------------------\r\n';
    appendedComments += 'Copyright ' + copyrightYear + ' Appiphony, LLC\r\n\r\n';
    appendedComments += 'Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\r\n\r\n';
    appendedComments += '1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.\r\n';
    appendedComments += '2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.\r\n\r\n';
    appendedComments += 'THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\r\n';
    appendedComments += '-------------------------------------------------- */\r\n';
        
    return gulp.src(['./dist/**/*', '!./dist/**/*.zip'])
        .pipe(insert.prepend(prependedComments))
        .pipe(insert.append(appendedComments))
        .pipe(gulp.dest('./dist'));
});

gulp.task('zip', function() {
    return gulp.src(['./dist/**/*', '!./dist/**/*.zip'])
        .pipe(zip('aljs.zip'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('dist', function() {
    return runSequence('concat', 'concatWithMoment', 'uglify', 'insert', 'zip');
});

gulp.task('watch', function() {
    gulp.watch('./aljs-ember-app/templates/**/*.hbs', ['emberTemplates']);
    gulp.watch('./aljs-ember-app/**/*.js', ['neuter']);
    gulp.watch(['./public/src/**/*.js', '!./public/src/**/*.min.js', '!./public/src/jquery.aljs-all.js', '!./public/src/jquery.aljs-all-with-moment.js'], ['dist']);
});

gulp.task('default', ['build'], function() {
    return runSequence('emberTemplates', 'neuter', 'dist', 'watch');
});