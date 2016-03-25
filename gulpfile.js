var gulp = require('gulp'),
    wiredep = require('wiredep'),
    nodemon = require('gulp-nodemon'),
    jsHint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    flatten = require('gulp-flatten'),
    gulpFilter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    mainBowerFiles = require('main-bower-files'),
    jsFiles = ['*.js', 'views/**/*.js'],
    srcFiles = ['*.js', 'views/**/*.js', 'app/*.js', 'app/**/*.js'];


var injectFunc = function() {
    var stream = wiredep.stream,
        bowerOptions = {
            bowerJson: require('./bower.json'),
            directory: './bower',
            ignorePath: ''
        },
        injectOptions = {
            ignorePath: 'public/'
        },
        injectSrc = gulp.src([
            './public/dist/**/*.js',
            './public/dist/**/*.css',
            './public/assets/css/app.css',
            './public/assets/css/styles-6.css',
            './public/assets/js/min/*.js',
            './public/app/*.js',
            './public/app/**/*.js'],
            {
                read: false
            }),
        inject = require('gulp-inject');
    return gulp.src('./public/views/**/*.html')
        //.pipe(stream(bowerOptions))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./public/views'));
};

gulp.task('compact', function() {
    var path = './public/dist';
    var jsFilter = gulpFilter('**/*.js', {
        restore: true
    });
    var cssFilter = gulpFilter('**/*.css', {
        restore: true
    });
    var fontFilter = gulpFilter(['**/*.eot', '**/*.woff', '**/*.svg', '**/*.ttf']);

    var bowerFiles = mainBowerFiles();
    bowerFiles.forEach(function(f) { console.log(f); });
    return gulp.src(bowerFiles)
        // grab vendor js files from bower_components, minify and push in /public
        .pipe(jsFilter)
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path + '/js/'))
        .pipe(jsFilter.restore)
        // grab vendor css files from bower_components, minify and push in /public
        .pipe(cssFilter)        
        .pipe(concat('all.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(path + '/css/'))
        .pipe(cssFilter.restore)
        // grab vendor font files from bower_components and push in /public
        .pipe(fontFilter)
        .pipe(flatten())
        .pipe(gulp.dest(path + '/fonts/'));
});

gulp.task('serve', ['style', 'inject'], function() {
    var options = {
        script: 'app.js',
        delayTime: 1,
        env: {
            'PORT': 9090
        },
        watch: srcFiles
    };
    return nodemon(options)
        .on('restart', function() {
            console.log('Restarting...');
        });
});

gulp.task('style', function() {
    return gulp.src(jsFiles)
        .pipe(jsHint())
        .pipe(jsHint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});

gulp.task('inject', ['compact'], injectFunc);