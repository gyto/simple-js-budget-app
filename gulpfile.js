var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    pug = require('gulp-pug'),
    imagemin = require('gulp-imagemin'),
    realFavicon = require ('gulp-real-favicon'),
    fs = require('fs'),
    htmlmin = require('gulp-htmlmin');

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
    images: '/images/',
    favicon: '/favicon/'
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
       realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code),
       htmlmin({
          collapseWhitespace: true
       }),
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
 *  Task for favicon creation
 */

var FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('generate-favicon', function(done) {
    realFavicon.generateFavicon({
        masterPicture: path.SRC + folder.favicon + 'favicon.png',
        dest: path.BUILDAssets + folder.favicon,
        iconsPath: 'assets/favicon/',
        design: {
            ios: {
                pictureAspect: 'noChange',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#da532c',
                manifest: {
                    name: 'Simple Budget App',
                    shortName: 'Budget App',
                    startUrl: '/',
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
                threshold: 40.625,
                themeColor: '#da532c'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false,
            readmeFile: false,
            htmlCodeFile: false,
            usePathAsIs: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
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
