var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	babel = require('gulp-babel');

gulp.task('scripts', function() {
	return gulp
		.src('./src/EventEmitter.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dist/test.js'));
});

gulp.task('watch', function() {
	gulp.watch('./src/EventEmitter.js', [ 'scripts' ]);
});

gulp.task('default', [ 'watch', 'scripts' ]);