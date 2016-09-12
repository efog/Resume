var concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    gulp = require('gulp'),
    gulpFilter = require('gulp-filter'),
    gulpInject = require('gulp-inject'),
    minifycss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    wiredep = require('wiredep');
var jsFiles = ['*.js', 'views/**/*.js'],
    srcFiles = ['*.js', 'views/**/*.js', 'app/*.js', 'app/**/*.js'];

var inject = () => {
    var stream = wiredep.stream;
    var bowerOptions = {
        'bowerJson': require('./bower.json'),
        'directory': './bower',
        'ignorePath': ''
    };
    var injectOptions = {
        'ignorePath': '/dist',
        'relative': true
    };

    var injectSrc = gulp.src([
        './src/**/*.js',
        './src/**/*.css'],
        {
            'read': false
        });

    return gulp.src('./index.html')
        .pipe(stream(bowerOptions))
        .pipe(gulpInject(injectSrc, injectOptions))
        .pipe(gulp.dest('./'));
};

gulp.task('inject', () => {
    return inject();
});

gulp.task('build', ['inject']);