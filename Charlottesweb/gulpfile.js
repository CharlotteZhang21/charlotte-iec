var del = require('del');
var gulp = require('gulp');
var path = require('path');
var argv = require('yargs').argv;
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var buffer = require('gulp-buffer');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var exorcist = require('exorcist');
var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');

/**
 * Using different folders/file names? Change these constants:
 */

var PUB_PATH = 'dist';
var SCRIPTS_PATH = PUB_PATH + '/scripts';
var DEV_PATH = 'builds';
var SOURCE_PATH = DEV_PATH + '/src';
var STATIC_PATH = DEV_PATH + '/static';
var SASS_PATH = DEV_PATH + '/scss';
var IMG_PATH = DEV_PATH + '/static/images';
var ENTRY_FILE = SOURCE_PATH + '/index.js';
var OUTPUT_FILE = 'main.js';

var keepFiles = false;

/**
 * Simple way to check for development/production mode.
 */
function isProduction() {
    return argv.production;
}

/**
 * Logs the current build mode on the console.
 */
function logBuildMode() {
    
    if (isProduction()) {
        gutil.log(gutil.colors.green('Running production build...'));
    } else {
        gutil.log(gutil.colors.yellow('Running development build...'));
    }

}

/**
 * Deletes all content inside the './dist' folder.
 * If 'keepFiles' is true, no files will be deleted. This is a dirty workaround since we can't have
 * optional task dependencies :(
 * Note: keepFiles is set to true by gulp.watch (see serve()) and reseted here to avoid conflicts.
 */
function cleanBuild() {
    if (!keepFiles) {
        del(['dist/**/*.*']);
    } else {
        keepFiles = false;
    }
}

/**
 * Copies the content of the './static' folder into the '/dist' folder.
 * Check out README.md for more info on the '/static' folder.
 */
function copyStatic() {
    return gulp.src(STATIC_PATH + '/**/*')
        .pipe(gulp.dest(PUB_PATH));
}


function build() {

    var sourcemapPath = SCRIPTS_PATH + '/' + OUTPUT_FILE + '.map';
    logBuildMode();

    return browserify({
            paths: [path.join(__dirname, 'src')],
            entries: ENTRY_FILE,
            debug: true,
            transform: [
                [
                    babelify, {
                        presets: ["es2015"]
                    }
                ]
            ]
        })
        .transform(babelify)
        .bundle().on('error', function(error) {
            gutil.log(gutil.colors.red('[Build Error]', error.message));
            this.emit('end');
        })
        .pipe(gulpif(!isProduction(), exorcist(sourcemapPath)))
        .pipe(source(OUTPUT_FILE))
        .pipe(buffer())
        .pipe(gulpif(isProduction(), uglify()))
        .pipe(gulp.dest(SCRIPTS_PATH));

}

/**
 * Starts the Browsersync server.
 * Watches for file changes in the 'src' folder.
 */
function serve() {
    
    var options = {
        server: {
            baseDir: PUB_PATH
        },
        open: true // Change it to true if you wish to allow Browsersync to open a browser window.
    };
    
    browserSync(options);
    
    // Watches for changes in files inside the './src' folder.
    gulp.watch(SOURCE_PATH + '/**/*.js', ['watch-js']);
    
    gulp.watch(SASS_PATH + '/**/*.scss', ['sass']);

    // gulp.watch(SOURCE_PATH + '/**/*.html', ['html']);

    gulp.watch(SOURCE_PATH + '/*.html', ['html']);
    
    // Watches for changes in files inside the './static' folder. Also sets 'keepFiles' to true (see cleanBuild()).
    gulp.watch(STATIC_PATH + '/**/*', ['watch-static']).on('change', function() {
        keepFiles = true;
    });

}

function buildHtml() {
	return gulp.src('SOURCE_PATH' + '/*.html')
		.pipe(gulpif(isProduction(), uglify()))
		.pipe(gulp.dest(PUB_PATH));
}

function buildSass() {
    return gulp.src(SASS_PATH + '/main.scss')
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest(STATIC_PATH + '/styles'));
};


gulp.task('cleanBuild', cleanBuild);
gulp.task('copyStatic', ['cleanBuild'], copyStatic);
gulp.task('build', build);
gulp.task('fastBuild', build);
gulp.task('serve', ['build', 'sass', 'html', 'copyStatic'], serve);
gulp.task('watch-js', ['fastBuild'], browserSync.reload); // Rebuilds and reloads the project when executed.
gulp.task('sass', buildSass);
gulp.task('html', buildHtml);
gulp.task('watch-static', browserSync.reload);
gulp.task('default', ['serve']);