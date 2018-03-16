var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    pug = require('gulp-pug');

var browserSync = require('browser-sync').create();

var path = {
    SRC: './src',
    BUILD: './build',
    BUILDAssets: './build/assets'
};
var folder = {
    css: '/css',
    scss: '/scss/',
    js: '/js/',
    pug: '/pug/',
    vendors: '/vendors/'
};

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: path.BUILD + '/'
        }
    })
});

gulp.task('sass', function (callback) {
    pump([
        gulp.src(path.SRC + folder.scss + '**/*.scss'),
        sass(),
        cleanCSS(),
        gulp.dest(path.BUILDAssets + folder.css),
        browserSync.reload({
            stream: true
        })
    ], callback);
});

gulp.task('javascript', function (callback) {
    pump([
        gulp.src(path.SRC + folder.js + '**/*.js'),
        uglify(),
        gulp.dest(path.BUILDAssets + folder.js),
        browserSync.reload({
            stream: true
        })
    ], callback);
});

gulp.task('pug', function (callback) {
   pump([
       gulp.src(path.SRC + folder.pug + '*.pug'),
       pug({}),
       gulp.dest(path.BUILD + '/'),
       browserSync.reload({
           stream: true
       })
   ], callback);
});

gulp.task('vendors', function () {
   return gulp.src(path.SRC + folder.vendors + '/*.css')
       .pipe(gulp.dest(path.BUILDAssets + folder.css))
});

gulp.task('watch', ['browserSync', 'sass', 'javascript', 'pug', 'vendors'], function () {
    gulp.watch(path.SRC + folder.scss + '**/*.scss', ['sass']);
    gulp.watch(path.SRC + folder.js + '**/*.js', ['javascript']);
    gulp.watch(path.SRC + folder.pug + '**/*.pug', ['pug']);
});

gulp.task('default', ['watch', 'sass', 'pug', 'vendors']);
