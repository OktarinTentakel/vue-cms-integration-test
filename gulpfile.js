const gulp = require('gulp'),
	gutil = require('gulp-util'),
	fs = require('fs'),
	path = require('path'),
	sequence = require('run-sequence'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	handlebars = require('gulp-compile-handlebars'),
	handlebarsHelpers = require('handlebars-helpers')(['array', 'collection', 'comparison', 'math', 'object', 'string', 'url'], {handlebars : handlebars.Handlebars}),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	webpack = require('webpack'),
	webpackStream = require('webpack-stream'),
	UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
	VueLoaderPlugin = require('vue-loader/lib/plugin'),
	stylus = require('gulp-stylus'),
	autoprefixerStylus = require('autoprefixer-stylus'),
	browserSync = require('browser-sync').create(),
	watch = require('gulp-watch');



let browserSyncConfig = {
		server : {
			baseDir : path.resolve('./build/').replace(/\\/g, "/")
		},
		host : '0.0.0.0',
		open : false,
		snippetOptions : {
			// Ignore all HTML files within the templates folder
			//blacklist : ['/index.html', '/', '/?*']
		},
		notify : {
			styles : [
				'display: none',
				'padding: 15px',
				'font-family: sans-serif',
				'position: fixed',
				'font-size: 1em',
				'z-index: 9999',
				'bottom: 0px',
				'right: 0px',
				'border-top-left-radius: 5px',
				'background-color: #1b2032',
				'opacity: 0.4',
				'margin: 0',
				'color: white',
				'text-align: center'
			]
		},
		ghostMode : false
	},
	webpackConfig = {
		mode : 'production' /*'development'*/,
		cache : true,
		devtool : 'source-map',
		entry : [
			'babel-polyfill',
			'./src/js/init.js'
		],
		module : {
			rules : [
				{
					loader : 'json-loader',
					test : /\.json$/
				},
				{
					test : /\.js$/,
					loader : 'babel-loader',
					query : {
						plugins : ['transform-runtime'],
						presets : ['es2015'],
						cacheDirectory : true
					},
					include : [
						path.resolve(__dirname, 'src/js/')
					],
					exclude : /node_modules/
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					include : [
						path.resolve(__dirname, 'src/vue/')
					]
				}
			]
		},
		plugins : [
			new VueLoaderPlugin()
		],
		resolve: {
			extensions : ['.js'],
			modules : [
				path.resolve(__dirname, 'src/js/'),
				path.resolve(__dirname, 'src/vue/'),
				path.resolve(__dirname, 'node_modules/')
			],
			alias : {
				vue$ : path.resolve(__dirname, 'node_modules/@client/vue/dist/vue.esm.js'),
				lodash$ : path.resolve(__dirname, 'node_modules/@client/lodash/dist/lodash.js')
			}
		},
		output : {
			path : path.resolve(__dirname, './build/js/'),
			filename : 'app.js'
		},
		optimization : {
			minimizer : [
				new UglifyJsPlugin({
					cache : true,
					parallel : true,
					sourceMap : true
				})
			]
		}
	}
;



function compileTemplate(path, name){
	let options = {
		ignorePartials: false,
		batch : [
			'./src/hbs/partials/'
		],
		helpers : {
			vue : function(expr){
				return '{{ '+expr+' }}';
			}
		}
	};

	return gulp.src('./src/hbs/'+path+name+'.hbs')
		.pipe(handlebars({model : JSON.parse(fs.readFileSync('./src/hbs/'+path+name+'.json'))}, options))
		.pipe(rename(path+name+'.html'))
		.pipe(gulp.dest('./build/'));
}

gulp.task('handlebars', function(){
	return compileTemplate('', 'index');
});



gulp.task('js', function(){
	return gulp.src('./src/js/init.js')
		.pipe(webpackStream(webpackConfig, webpack))
		.on('error', function(err){
			// log error but continue with the task flow anyway
			// keeps watchers alive!
			gutil.log(err);
			this.emit('end');
		})
		.pipe(gulp.dest('./build/js/'))
	;
});



gulp.task('stylus', function(){
	return gulp.src([
		'./src/styl/main.styl'
	])
		.pipe(sourcemaps.init())
		.pipe(stylus({
			use : [autoprefixerStylus({browsers : ['last 2 versions', 'IE >= 10']})],
			compress : true,
			'hoist atrules' : true
		}).on('error', function(err){
			// log error but continue with the task flow anyway
			// keeps watchers alive!
			gutil.log(err);
			this.emit('end');
		}))
		.pipe(rename('main.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build//css'));
});



gulp.task('watch', function(){
	let watchConfig = {};

	watch(['./src/hbs/**/*.hbs', './src/hbs/**/*.json'], watchConfig, function(){ sequence('handlebars', function(){ browserSync.reload(); }) });
	watch(['./src/js/**/*.js', './src/vue/**/*.vue'], watchConfig, function(){ sequence('js', function(){ browserSync.reload('*.js'); }) });
	watch(['./src/styl/**/*.styl', './src/vue/**/*.styl'], watchConfig, function(){ sequence('stylus', function(){ browserSync.reload('*.css'); }) });
});



gulp.task('server', function(done){
	browserSync.init(browserSyncConfig, function(){
		done();
	});
});



gulp.task('build', function(){
	sequence('handlebars', 'js', 'stylus');
});



gulp.task('serve', ['build'], function(){
	sequence('server', 'watch');
});



gulp.task('default', function(){
	sequence('build');
});
