/* globals require */

'use strict';

var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlReplace = require('gulp-html-replace');
var stringReplace = require('gulp-string-replace');
var cleanCSS = require('gulp-clean-css');
var inlineimg = require('gulp-js-base64-inject');
var cssBase64 = require('gulp-css-base64');
var del = require('del');
var rename = require('gulp-rename');
var gulpUtil = require('gulp-util');

var debug = require('gulp-debug');

var TITLE = "Playable ad";
var SOURCES = require("./src/game/src.json");

const browserSync = require('browser-sync').create();
const argv = require('yargs').argv;

//----------------------------------------------------------------------------------------------------------------------
gulp.task('image-base64', [], function () {
    return gulp.src(['src/game/js/**/*.js'])
        // .pipe(debug())
        .pipe(inlineimg({
            //basepath: 'src/game/img'
        }))
        .pipe(gulp.dest('temp/base64-js'));
});

gulp.task('compress-body-js', ['image-base64'], function () {
    return gulp.src('temp/base64-js/**/*.js')
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('./temp/js/body'));
});

gulp.task('concat-body-js', ['compress-body-js'], function () {
    var sources = SOURCES.map(function(src){
        return "temp/js/body/" + src;
    });
    var tasks = gulp.src(sources)
        .pipe(concat('body.js'))
        .pipe(gulp.dest('temp/js'));

    return merge(tasks);
});

gulp.task('base64-css', [], function () {
    return gulp.src('src/game/css/*.css')
        .pipe(cssBase64({
            maxWeightResource: 1024*1024,
            extensionsAllowed: ['.png', '.jpg', '.ttf', '.woff', '.eot', '.svg']
        }))
        .pipe(gulp.dest('temp/base64-css'));
});

gulp.task('compress-css', ['base64-css'], function () {
    return gulp.src('temp/base64-css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat("style.css"))
        .pipe(gulp.dest('temp/css'));
});

gulp.task('replace-assets', ['concat-body-js'], function () {
    var fullSourceTasks = gulp.src('src/game/html/playable.html')
        .pipe(htmlReplace({
            'body-js': {
                src: gulp.src('temp/js/body.js'),
                tpl: '<script type="text/javascript">%s</script>'
            },
            'playable-css': {
                src: gulp.src('temp/css/*.css'),
                tpl: '<style type="text/css">%s</style>'
            },
            'playable-config': {
                src: gulp.src('src/game/js/config.js'),
                tpl: '<script type="text/javascript">%s</script>'
            },
            'playable-title': {
                src: TITLE,
                tpl: '%s'
            }
        }))
        .pipe(rename('playable-full-source.html'))
        .pipe(gulp.dest('temp/'));

    var cssLink = 'style.css';
    var jsLink = 'game.js';
    var configLink = 'config.js';

    var linkTasks = gulp.src('src/game/html/playable.html')
        .pipe(htmlReplace({
            'body-js': {
                src: jsLink,
                tpl: '<script type="text/javascript" src="%s"></script>'
            },
            'playable-css': {
                src: cssLink,
                tpl: '<link type="text/css" rel="stylesheet" href="%s">'
            },
            'playable-config': {
                src: configLink,
                tpl: '<script type="text/javascript" src="%s"></script>'
            },
            'playable-title': {
                src: TITLE,
                tpl: '%s'
            }
        }))
        .pipe(rename('playable-links.html'))
        .pipe(gulp.dest('temp/'));

    return merge([fullSourceTasks, linkTasks]);
});

gulp.task('cleanup-old-digest', ['replace-assets'], function () {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('release', ['cleanup-old-digest'], function () {
    var htmlTask = gulp.src('temp/playable-links.html')
        .pipe(rename('index.html'))
        .pipe(stringReplace(/\s{2,}/g, ''))
        .pipe(stringReplace(/(\r\n|\n|\r)/gm, ''))
        .pipe(gulp.dest('dist'));

    var jsTask = gulp.src('temp/js/body.js')
        .pipe(rename('game.js'))
        .pipe(gulp.dest('dist'));

    var configTask = gulp.src('src/game/js/config.js')
        .pipe(gulp.dest('dist'));

    var cssTask = gulp.src('temp/css/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist'));
    return merge([htmlTask, jsTask, cssTask, configTask]);
});

gulp.task('release-full-source', ['cleanup-old-digest'], function () {
    var tasks = gulp.src('temp/playable-full-source.html')
        .pipe(rename('index-standalone.html'))
        .pipe(gulp.dest('dist'));
    return merge(tasks);
});


gulp.task('watch', () => {
  gulp.watch(['src/game/js/*.js', 'src/game/js/**/*.js', 'src/game/html/**', 'src/css/*.css'], ['default']);
})

gulp.task('reload', (done) => {
  browserSync.reload();
  done();
});


const initBrowsersync = function initBrowsersync() {
  browserSync.init({
    open: !argv.noopen,
    browser: argv.browser,
    server: {
      baseDir: 'dist',
      index: 'index.html',
    },
    reloadThrottle: argv.reloadThrottle || 0,
  });
};



// Delete temp folder
gulp.task('cleanup-unused-files', ['release-full-source'], function () {
    var size = ~~fs.statSync(path.resolve('dist/index.html')).size;
    // console.log("TOTAL SIZE: " + Math.round(size / 1024 / 1024 * 100) / 100 + "Mb");
    return del([
        'temp'
    ]);
});

gulp.task('publish', [
    'image-base64',
    'compress-body-js',
    'concat-body-js',
    'base64-css',
    'compress-css',
    'replace-assets',
    'cleanup-old-digest',
    'release',
    'release-full-source',
    'cleanup-unused-files',
    'reload',
]);

gulp.task('default', [
    'watch',
    'publish',
    // 'reload',
]);
