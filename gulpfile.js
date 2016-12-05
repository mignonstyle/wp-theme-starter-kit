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
	watch        = require('gulp-watch'),
	plumber      = require('gulp-plumber'),
	stylish      = require('jshint-stylish'),
	runSequence  = require('run-sequence'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify'),
	jshint       = require('gulp-jshint'),
	browserSync  = require('browser-sync');

// ------------------------------------------------
// Auto-polyfill
// Corrective action due to travis error in autoprefixer.
// ------------------------------------------------
require('es6-promise').polyfill();

// ------------------------------------------------
// Browsers setting
// ------------------------------------------------
var browsers = [
	'last 1 version',
	'> 50%'
];

// ------------------------------------------------
// Paths setting
// ------------------------------------------------
var paths = {
	'root'   : './',
	// php
	'phpSrc' : './**/*.php',
	// scss
	//'scssSrc': './src/scss/**/*.scss',
	'scssSrc': './sass/*.scss',
	// css
	//'scssDir': './css/',
	'scssDir': './',
	// js
	'jsSrc'  : './src/js/**/*.js',
	'jsDir'  : './js/',

	// admin widget paths
	//'admin_scssSrc': './src/admin/admin-widget/*.scss',

	//"widget_scssSrc": "./src/admin/admin-widget/widget-scss/**/*.scss",
	//"widget_scssDir": "./admin/widget/widget-css/",

	//"widget_jsSrc": "./src/admin/admin-widget/widget-js/**/*.js",
	//"widget_jsDir": "./admin/widget/widget-js/",
}

// ------------------------------------------------
// BrowserSync
// ------------------------------------------------
gulp.task('browser-sync', function(){
	browserSync.init({
		proxy : "http://vccw-test.dev/",
		notify: true,
		xip   : false
	});
});

gulp.task('bs-reload', function(){
	return gulp.src(paths.root)
		.pipe(browserSync.reload({
			stream: true,
			once: true
		}));
});

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
		/*
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(csso())
		.pipe(gulp.dest(paths.scssDir));
		*/
});

// ------------------------------------------------
// JS Tasks
// ------------------------------------------------
gulp.task('jshint', function(){
	return gulp.src(paths.jsSrc)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('js-concat', function(cb){
	return gulp.src(paths.jsSrc)
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.jsDir));
});

gulp.task('js-min', function(){
	return gulp.src(paths.jsSrc)
		.pipe(plumber())
		.pipe(uglify({preserveComments: 'license'}))
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest(paths.jsDir));
});

gulp.task('js', function(cb){
	runSequence('jshint', 'js-concat', 'js-min', cb);
});

// ------------------------------------------------
// Gulp Tasks
// ------------------------------------------------
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
