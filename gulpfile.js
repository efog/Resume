var gulp = require('gulp'),
    jsHint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    jsFiles = ['*.js', 'views/**/*.js'];

gulp.task('style', function () {
    return gulp.src(jsFiles)
        .pipe(jsHint())
        .pipe(jsHint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});