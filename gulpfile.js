// $ npm install --save-dev gulp
// $ npm run build

var gulp         = require( 'gulp' );
var watch        = require( 'gulp-watch' );
var sass         = require( 'gulp-sass' );
var csso         = require( 'gulp-csso' );
var rename       = require( 'gulp-rename' );
//var path         = require( 'path' );
//var changed      = require( 'gulp-changed' );
var concat       = require( 'gulp-concat' );
//var plumber      = require( 'gulp-plumber' );
var uglify       = require( 'gulp-uglify' );
//var requireDir   = require( 'require-dir' );
var browserSync  = require( 'browser-sync' );

// ------------------------------------------------
// Paths setting
// ------------------------------------------------

var paths = {
    // base paths
    "phpSrc": "./**/*.php",

    "scssSrc": "./src/scss/**/*.scss",
    "scssDir": "./",

    "jsSrc": "./src/js/**/*.js",
    "jsDir": "./js/",

    // admin widget paths
    //"admin_scssSrc": "./src/admin/admin-widget/*.scss",

    //"widget_scssSrc": "./src/admin/admin-widget/widget-scss/**/*.scss",
    //"widget_scssDir": "./admin/widget/widget-css/",

    //"widget_jsSrc": "./src/admin/admin-widget/widget-js/**/*.js",
    //"widget_jsDir": "./admin/widget/widget-js/",
}

// ------------------------------------------------
// BrowserSync
// ------------------------------------------------
gulp.task( 'browser-sync', function() {
    browserSync.init( {
        proxy : "http://vccw-test.dev/",
        notify: true,
        xip   : false
    } );
} );

gulp.task( 'bs-reload', function() {
    browserSync.reload();
} );

// ------------------------------------------------
// Sass Tasks
// ------------------------------------------------
gulp.task( 'scss', function() {
    return gulp.src( paths.scssSrc )
        .pipe( sass() )
    .pipe( gulp.dest( paths.scssDir ) )
	/*
    .pipe( rename( {
        suffix: '.min'
    } ) )
	*/
    //.pipe( csso() )
    //.pipe( gulp.dest( paths.scssDir ) );
} );

// ------------------------------------------------
// JS Tasks
// ------------------------------------------------
gulp.task( 'js', function() {
    return gulp.src( paths.jsSrc )
        .pipe( concat( 'main.js' ) )
        .pipe( gulp.dest( paths.jsDir ) );
} );

gulp.task( 'js-min', ['js'], function() {
    return gulp.src( paths.jsSrc )
        .pipe( uglify( {preserveComments: 'license'} ) )
        .pipe( concat( 'main.min.js' ) )
        .pipe( gulp.dest( paths.jsDir ) );
} );

// ------------------------------------------------
// Gulp Tasks
// ------------------------------------------------
gulp.task( 'watch', [
    'scss',
    'js',
    'js-min',
    'browser-sync',
    'bs-reload'
], function() {
    gulp.watch( [paths.scssSrc], ['scss'] );
    gulp.watch( [paths.jsSrc], ['js', 'js-min'] );

    gulp.watch( [
        paths.phpSrc,
        paths.scssSrc,
        paths.jsSrc,
     ], function() {
        browserSync.reload();
    } );
} );

gulp.task( 'default', [
    'scss',
    'js',
    'js-min',
    //'watch'
    ], function() {
} );
