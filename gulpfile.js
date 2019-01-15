// @ts-check

'use strict';
/*
 *	1.less编译 压缩 合并 此处合并没有必要，一般预处理css都可以导包
 *	2.js合并 压缩 混淆
 *	3.img赋值
 *	4.html压缩
 */
 
// 在gulpfile中先载入gulp包，因为这个包提供了一些api
// 获取gulp包
var gulp = require('gulp');
var browserify = require('browserify');  
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
 
// 7.启动服务器
// var browserSync = require('browser-sync');
var browserSync = require('browser-sync').create();
var reload=browserSync.reload
 
// 2.js合并 压缩混淆
gulp.task('js',function(done){
	gulp.src('mvvm/src/*.js')
		browserify({
			insertGlobals: true,
			entries: 'mvvm/src/index.js',
			
			debug: false
		  })
		.transform(babelify.configure({
			// presets : ["es2015"]
			babelrc: false,
			presets: ['@babel/preset-env'],
			"plugins": ["@babel/plugin-proposal-class-properties"],
		}))
		.bundle()
		.pipe(source('mvvm.js'))
		.pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
		.pipe(sourcemaps.init({loadMaps: true}))
		// .pipe(uglify()) // now gulp-uglify works 
		.on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('mvvm/dist'))
        .pipe(browserSync.reload({stream:true}));
    done();
});

// 4.HTML处理
gulp.task('html',function(done){
    gulp.src('mvvm/*.html')
        .pipe(gulp.dest('mvvm/dist'))
        .pipe(reload({stream:true}));
    done();
});


gulp.task('serve',function(){
	browserSync.init({
		server:{
			baseDir: ['mvvm/dist/']
		},
	},function(err,bs){
		console.log(bs.options.getIn(['urls','local']));
	});
	gulp.watch('mvvm/src/*.js',gulp.series('js'));
	gulp.watch('mvvm/*.html',gulp.series('html'));
})

gulp.task('mvvm',gulp.series('js','html','serve'))