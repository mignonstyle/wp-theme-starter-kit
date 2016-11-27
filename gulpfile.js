// $ npm install --save-dev gulp
// $ npm run build

var gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	sassLint     = require('gulp-sass-lint'),
	rename       = require('gulp-rename'),
	csso         = require('gulp-csso'),
	postcss      = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	doiuse       = require('doiuse'),
	mqpacker     = require('css-mqpacker'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify'),
	watch        = require('gulp-watch'),
	plumber      = require('gulp-plumber'),
	browserSync  = require( 'browser-sync' );







//var path         = require( 'path' );
//var changed      = require( 'gulp-changed' );


//
//var requireDir   = require( 'require-dir' );


// ------------------------------------------------
// Auto-polyfill
// Corrective action due to travis error in autoprefixer.
// ------------------------------------------------
require('es6-promise').polyfill();

// ------------------------------------------------
// Browsers setting
// ------------------------------------------------
var browsers = [
	'last 2 version',
	'> 3%'
];

// ------------------------------------------------
// Paths setting
// ------------------------------------------------
var paths = {
	// base paths
	"phpSrc": "./**/*.php",

	// scss
	"scssSrc": "./src/scss/**/*.scss",
	"scssDir": "./css/",

	// js
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
gulp.task('scss', function(){
	return gulp.src(paths.scssSrc)
		.pipe(plumber({
			errorHandler: function(err){
				console.log(err.messageFormatted);
				this.emit('end');
			}
		}))

		.pipe(sassLint())
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError())

		.pipe(sass())

		.pipe(postcss([
			doiuse({
				browsers: browsers,
				// CSS3 2D Transforms not supported by Opera Mini.
				ignore: ['transforms2d', 'rem'],
				// an optional array of file globs to match against original source file path, to ignore
				ignoreFiles: ['**/normalize.scss']
			}),
			autoprefixer({browsers: browsers}),
			mqpacker()
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

gulp.task('js-concat', function(){
	return gulp.src(paths.jsSrc)
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.jsDir));
});

gulp.task('js-min', ['js-concat'], function(){
	return gulp.src(paths.jsSrc)
		.pipe(plumber())
		.pipe(uglify({preserveComments: 'license'}))
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest(paths.jsDir));
});

gulp.task('js', ['js-concat', 'js-min']);

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
gulp.task('watch', [
		'scss',
		'js',
		'browser-sync',
	], function(){
		gulp.watch([paths.phpSrc], ['bs-reload']);
		gulp.watch([paths.scssSrc], ['scss', 'bs-reload']);
		gulp.watch([paths.jsSrc], ['js', 'bs-reload']);
});

gulp.task('default', [
		'scss',
		'js',
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
