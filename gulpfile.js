const gulp = require('gulp');
const gulpif = require('gulp-if');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');

const NODE_ENV = process.env.NODE_ENV || 'development';

const jsEntiries = {
	src: './js/',
	dest: '../js/',
	files: [
		'app.js',
	]
};

gulp.task('js', () => {
	jsEntiries.files.forEach(entry => {
		var filepath = jsEntiries.src + entry;
		browserify(filepath, {
			debug: NODE_ENV !== 'production',
			extensions: ['.js', '.jsx']
		})
		.transform(babelify, {
			presets: ['es2015', 'react']
		})
		.bundle()
		.on('error', err => {
			console.log(err.message);
			console.log(err.stack);
		})
		.pipe(source(entry))
		.pipe(buffer())
		.pipe(gulpif(NODE_ENV === 'production', uglify()))
		.pipe(gulp.dest(jsEntiries.dest));
	});
});

gulp.task('default', () => {
	gulp.watch(jsEntiries.src + '**/*.*', ['js']);
});
