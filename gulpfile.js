var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var mainBowerFiles = require('main-bower-files');
var autoprefixer = require('gulp-autoprefixer');
var argv = require('yargs').argv;

var paths = {
  // Files to transfer directly to dist
  'transfer': [
                './src/static/**/*'
                // ,'./path/to/folder.orFile'
              ],
  // distribution paths
  'dist': {
    'root': './dist',
    'all': './dist/**/*',
    'templates': './dist/templates'
  },
  // source files
  'src': {
    'css': './src/styles/style.scss',
    'html': './src/index.html',
    'js': ['./src/scripts/app.js', './src/scripts/**/*.js'],
    'templates': './src/scripts/templates/**/*',
    'graphics': './src/icons/*.svg'
  },
  // watch paths
  'watch': {
    'html': ['./src/index.html', './src/html/**/*.html'],
    'js': './src/scripts/**/*.js',
    'css': './src/**/*.scss',
    'templates': './src/scripts/templates/**/*',
    'graphics': './src/icons/*.svg'
  }
};

gulp.task('default', ['serve']);
gulp.task('serve', ['build', 'webserver']);
gulp.task('build', ['style', 'script', 'html']);

/**
  This function will remove all files and folders from the
  dist folder. 
**/
gulp.task('clean', function() {
  return del(paths.dist.all, {force:true, read: false});
});

/**
  This function will compile any LESS files inside 
  paths.sec.less, add sourcemaps, minify the css, and output
  it to the /dist folder. Will also call for a live reload.
**/
gulp.task('style', function() {
  return gulp.src(paths.src.css)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', errorCallback))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulpif(!argv.production, sourcemaps.write()))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(livereload());
});
 
/**
  This function will concatenate srcJS files (in order of 
  array), add sourcemaps, and output to dist folder. Will 
  also trigger a live reload.
**/
gulp.task('script', ['scripts:internal', 'scripts:external']);

gulp.task('scripts:internal', function() {
  return gulp.src(paths.src.js)
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(uglify({mangle: false}).on('error', errorCallback))
    .pipe(gulpif(!argv.production, sourcemaps.write()))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(livereload());
});

gulp.task('scripts:external', function(){
  return gulp.src(mainBowerFiles('**/*.js'))
    .pipe(concat('vendor.min.js'))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest(paths.dist.root));
});

/**
  This function will watch path watch files for changes,
  and if changes are detected (via livereload command),
  will compile the changed file.
**/
gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(paths.watch.css, ['style']);
  gulp.watch(paths.watch.js, ['scripts:internal']);
});

gulp.task('html', function() {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest(paths.dist.root));
});

/**
  This function will turn on the web server,
  using /dist as base. Will  trigger livereload 
  on change.
**/
gulp.task('webserver', ['watch'], function() {
  return gulp.src(paths.dist.root)
    .pipe(webserver({
      livereload: true, 
      open: true
    }));
});

var errorCallback = function(err){
    gutil.log(gutil.colors.red('------ERROR------\n'+err.message));
    gutil.beep();
    this.emit('end');
};