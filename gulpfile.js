// $ npm install --save-dev gulp
// $ npm run build

var gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	sassLint     = require('gulp-sass-lint'),
	rename       = require('gulp-rename'),
	csso         = require('gulp-csso'),
	postcss      = require('gulp-postcss'),
	autoprefixer = require('autoprefixer');

// var watch        = require( 'gulp-watch' );


//var path         = require( 'path' );
//var changed      = require( 'gulp-changed' );
// var concat       = require( 'gulp-concat' );
//var plumber      = require( 'gulp-plumber' );
// var uglify       = require( 'gulp-uglify' );
//var requireDir   = require( 'require-dir' );
// var browserSync  = require( 'browser-sync' );

// ------------------------------------------------
// Browsers setting (autoprefixer)
// ------------------------------------------------
var browsers = [
	'last 2 versions'
];

// ------------------------------------------------
// Paths setting
// ------------------------------------------------

var paths = {
	// base paths
	// "phpSrc": "./**/*.php",

	// scss
	"scssSrc": "./src/scss/**/*.scss",
	"scssDir": "./css/",

	// "jsSrc": "./src/js/**/*.js",
	// "jsDir": "./js/",

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
/*
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
*/
// ------------------------------------------------
// Sass Tasks
// ------------------------------------------------
gulp.task('scss', function(){
	return gulp.src(paths.scssSrc)
		.pipe(sassLint())
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError())

		.pipe(sass())
		.pipe(postcss([
			autoprefixer({browsers: browsers})
		]))
		.pipe(gulp.dest(paths.scssDir))

		// add minify
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(csso())
		.pipe(gulp.dest(paths.scssDir));
});

// ------------------------------------------------
// JS Tasks
// ------------------------------------------------
/*
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
*/
// ------------------------------------------------
// Gulp Tasks
// ------------------------------------------------
/*
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
*/
gulp.task('watch', function(){
	return gulp.watch([paths.scssSrc], ['scss']);
});

gulp.task('default', [
		'scss',
		//'watch',
	],
	function(){
});

/*
gulp.task( 'default', [
	'scss',
	'js',
	'js-min',
	//'watch'
	], function() {
} );
*/
// ------------------------------------------------
// Test Tasks
// ------------------------------------------------
/*
gulp.task( 'test:sass', function() {
	return gulp.src( paths.scssSrc )
		.pipe( sassLint() )
		.pipe( sassLint.format() )
		.pipe( sassLint.failOnError() )
} );
*/
