var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    pug = require('gulp-pug'),
    imagemin = require('gulp-imagemin');

var browserSync = require('browser-sync').create();

var path = {
    SRC: './src',
    BUILD: './docs',
    BUILDAssets: './docs/assets'
};
var folder = {
    css: '/css',
    scss: '/scss/',
    js: '/js/',
    pug: '/pug/',
    images: '/images/'
};

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: path.BUILD + '/'
        }
    })
});

/*
 *  Task to compile SCSS into CSS
 */

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

/*
 *  Task to uglify JAVASCRIPT
 */

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

/*
 *  Task to compile PUG files to HTML
 */

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

/*
 *  Task to minimize Images and moving to docs folder
 */

gulp.task('images', function (callback) {
    pump([
        gulp.src(path.SRC + folder.images + '*.*'),
        imagemin(),
        gulp.dest(path.BUILDAssets + folder.images)
    ], callback)
});

/*
 *  Task for watches
 */

gulp.task('watch', ['browserSync', 'sass', 'javascript', 'pug'], function () {
    gulp.watch(path.SRC + folder.scss + '**/*.scss', ['sass']);
    gulp.watch(path.SRC + folder.js + '**/*.js', ['javascript']);
    gulp.watch(path.SRC + folder.pug + '**/*.pug', ['pug']);
});

gulp.task('default', ['watch', 'sass', 'pug', 'images']);
