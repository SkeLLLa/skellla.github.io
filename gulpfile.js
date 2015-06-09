var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	path = require('path'),
	imageminZopfli = require('imagemin-zopfli');

var p = {
	current: path.resolve(__dirname, '.')
};
p.src = path.resolve(p.current, 'src');
p.srcCss = path.resolve(p.src, 'static');
p.srcStyleCss = path.resolve(p.srcCss, 'style.css');
console.log('path', p);

gulp.task('build:images', function() {
	var pngFilter = $.filter(['*.png']);
	return gulp.src(['src/static/*/**/*.png', 'src/static/*/**/*.jpg', 'src/static/*/**/*.gif'])
		.pipe($.imagemin({
			progressive: true,
			interlaced: true,
			optimizationLevel: 5
		}))
		.pipe(pngFilter)
		.pipe(imageminZopfli({more: true})())
		.pipe(pngFilter.restore())
		.pipe(gulp.dest('static'));
});

gulp.task('build:sprite', function() {
	var spriteOutput;
	spriteOutput = gulp.src("./src/static/*.css")
		.pipe($.spriteGenerator({
			baseUrl: "./src/static",
			padding: 10,
			algorithm: 'alt-diagonal',
			spriteSheetName: "sprite.png",
			spriteSheetPath: ".",
			styleSheetName: "style.css",
		}));
	spriteOutput.css
		.pipe($.concat('style.css'))
		.pipe($.minifyCss({
			cache: true,
			rebase: false
		}))
		.pipe(gulp.dest("static"))
		.pipe($.zopfli({
			format: 'gzip',
			numiterations: 15,
			blocksplitting: true,
			blocksplittinglast: true,
			blocksplittingmax: 15,
			append: true
		}))
		.pipe(gulp.dest("static"));
	spriteOutput.img
		.pipe($.imagemin({
			progressive: true,
			interlaced: true,
			optimizationLevel: 5
		}))
		.pipe(imageminZopfli({more: true})())
		.pipe(gulp.dest("static"));
});

gulp.task('build:html', function() {
	return gulp.src("./src/*.html")
		.pipe($.minifyHtml())
		.pipe(gulp.dest("./"))
		.pipe($.zopfli({
			format: 'gzip',
			numiterations: 15,
			blocksplitting: true,
			blocksplittinglast: true,
			blocksplittingmax: 15,
			append: true
		}))
		.pipe(gulp.dest("./"));
});

gulp.task('build:js', function() {
	return gulp.src("./src/static/**/*.js")
		.pipe($.concat('all.js'))
		.pipe($.uglify({
			mangle: true,
			compress: {
				sequences: true,  // join consecutive statemets with the “comma operator”
				properties: true,  // optimize property access: a["foo"] → a.foo
				dead_code: true,  // discard unreachable code
				drop_debugger: true,  // discard “debugger” statements
				drop_console: true,  // discard “console.*” statements
				unsafe: false, // some unsafe optimizations (see below)
				conditionals: true,  // optimize if-s and conditional expressions
				comparisons: true,  // optimize comparisons
				evaluate: true,  // evaluate constant expressions
				booleans: true,  // optimize boolean expressions
				loops: true,  // optimize loops
				unused: false,  // drop unused variables/functions
				hoist_funs: true,  // hoist function declarations
				hoist_vars: false, // hoist variable declarations
				if_return: true,  // optimize if-s followed by return/continue
				join_vars: true,  // join var declarations
				cascade: false,  // try to cascade `right` into `left` in sequences
				side_effects: false,  // drop side-effect-free statements
				warnings: false // warn about potentially dangerous optimizations/code
			}
		}))
		.pipe(gulp.dest("static"))
		.pipe($.zopfli({
			format: 'gzip',
			numiterations: 15,
			blocksplitting: true,
			blocksplittinglast: true,
			blocksplittingmax: 15,
			append: true
		}))
		.pipe(gulp.dest("static"));
});

gulp.task('default', ['build:html', 'build:images', 'build:sprite', 'build:js'], function() {

});