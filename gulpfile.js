var gulp = require('gulp'),
    wiredep = require('wiredep'),
    nodemon = require('gulp-nodemon'),
    jsHint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    jsFiles = ['*.js', 'views/**/*.js'],
    srcFiles = ['*.js', 'views/**/*.js', 'app/*.js', 'app/**/*.js'];


var injectFunc = function () {
    var stream = wiredep.stream,
        options = {
            bowerJson: require('./bower.json'),
            directory: './public/lib',
            ignorePath: '../'
        },
        injectOptions = {
            ignorePath: 'public/'
        },
        injectSrc = gulp.src(['./public/assets/css/app.css', './public/assets/css/styles.css', './public/assets/js/min/*.js', './public/app/*.js', './public/app/**/*.js'],
            {
                read: false
            }),
        inject = require('gulp-inject');
    return gulp.src('./public/views/**/*.html')
        .pipe(stream(options))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./public/views'));
};

gulp.task('serve', ['style', 'inject'], function () {
    var options = {
        script: 'app.js',
        delayTime: 1,
        env: {
            'PORT': 9090
        },
        watch: srcFiles
    };
    return nodemon(options)
        .on('restart', function () {
            console.log('Restarting...');
        });
});

gulp.task('style', function () {
    return gulp.src(jsFiles)
        .pipe(jsHint())
        .pipe(jsHint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});

gulp.task('inject', injectFunc);