var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('uglify', function() {
    return gulp.src(['src/**/*.js', '!src/**/*.min.js'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(['src/**/*.js', '!src/**/*.min.js'], ['uglify']);
});

gulp.task('default', ['uglify', 'watch']);