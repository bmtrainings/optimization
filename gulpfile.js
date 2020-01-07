var gulp = require('gulp');
var sass = require('gulp-sass');
var order = require('gulp-order');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('styles-optimized', function() {
	return gulp.src('assets/css/optimized/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest('assets/css/optimized'));
});

gulp.task('styles-unoptimized', function() {
	return gulp.src('assets/css/unoptimized/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('assets/css/unoptimized'));
});

gulp.task('styles-unoptimized-jquery', function() {
	return gulp.src('assets/css/unoptimized-jquery/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('assets/css/unoptimized-jquery'));
});

gulp.task('scripts', function() {
	return gulp.src('assets/js/optimized/src/*.js')
		.pipe(order([
			'hammer.min.js',
			'lazysizes.js',
			'slider.js',
			'trips.js',
			'filters.js',
			'sortingOptions.js',
			'index.js'
		]))
		.pipe(concat('scripts.js'))
		.pipe(uglify({'keep_fnames': true}))
		.pipe(gulp.dest('assets/js/optimized'));
});

gulp.task('watch', function() {
	gulp.watch('assets/css/optimized/*.scss', gulp.series('styles-optimized'));
	gulp.watch('assets/css/unoptimized/*.scss', gulp.series('styles-unoptimized'));
	gulp.watch('assets/css/unoptimized-jquery/*.scss', gulp.series('styles-unoptimized-jquery'));
	gulp.watch('assets/js/optimized/src/*.js', gulp.series('scripts'));
});
