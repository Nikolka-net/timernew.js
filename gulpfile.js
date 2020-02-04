const gulp = require('gulp');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
// const webpack = webpackStream.webpack;
const del = require('del');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin'); // сжатие изображений
const pngquant = require('imagemin-pngquant'); // подключаем библиотеку для работы с png
const cache = require('gulp-cache');
const webpackConfig = require('./webpack.config.js');


gulp.task('js', done => {
	gulp.src('./js/main.js')
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Webpack',
				message: err.message,
			})),
		}))
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(rename({
			suffix: '.min',
		}))
		.pipe(gulp.dest('./dist/js'));
	done();
});

/* css */

gulp.task('css', cb => {
	gulp.src('./css/*.css')
		.pipe(plumber())
		.pipe(concat('style.css'))
		.pipe(cleancss()) // Сжимаем
		.pipe(rename({
			suffix: '.min',
		}))
		.pipe(gulp.dest('dist/css'));
	cb();
});

/* scripts */

gulp.task('scripts', cb => {
	gulp.src([
		'./libs/jquery-3.3.1.js', // Берем jQuery
		'./libs/bootstrap.js', // Берем bootstrap
	])
		.pipe(plumber())
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('dist/js')); // Выгружаем в папку dist/js
	cb();
});

/* img */

gulp.task('img', cb => {
	gulp.src('./images/**/*')
		.pipe(plumber())
		.pipe(cache(imagemin({ // С кешированием
			// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false,
			}],
			use: [pngquant()],
		})))
		.pipe(gulp.dest('dist/images'));
	cb();
});

/* clear cache */

gulp.task('clear', callback => (
	cache.clearAll(),
	console.log('cache cleared'),
	callback()));

/* deleted dist */

gulp.task('clean', cb => (
	del('dist'),
	console.log('dist deleted'),
	cb()));

/* build */

gulp.task('build', gulp.series('clean', 'img', 'js', cb => {
	const buildFonts = gulp.src('./fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));


	const buildCss = gulp.src('./css/style.min.css')
		.pipe(gulp.dest('dist/css'));

	const buildHtml = gulp.src('./*.html') // Переносим HTML в продакшен
		.pipe(gulp.dest('dist'))
		.pipe(notify('Done! Dist ready.'));
	cb();

	// const buildJs = gulp.src('./js/**/*')
	// .pipe(gulp.dest('dist/js'));

	// const buildVideo = gulp.src('./video/**/*')
	// .pipe(gulp.dest('dist/video'));

	// const buildMailer = gulp.src('./mailer/**/*')
	// .pipe(gulp.dest('dist/mailer'));

	// const buildPHP = gulp.src('./*.php')
	// .pipe(gulp.dest('dist'))
}));


// gulp.task('default', gulp.parallel('bs', 'less', 'watch'));
