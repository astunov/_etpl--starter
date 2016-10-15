'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require("browser-sync"),
    rimraf = require('rimraf'),
    inlineCss = require('gulp-inline-css'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),

    reload = browserSync.reload;

var path = {
  build: {
    html: 'build/',
    img: 'build/img/',
    imgtpl:'build/img/tpl/',
    css: 'src/style/'
  },
  src: {
    html:'src/*.html',
    img: 'src/img/**/*.*',
    imgtpl:'src/img/tpl/**/*.*',
    css: 'src/style.scss'
  },
  watch: {
    all: 'build/',
    html: 'src/*.html',
    jade: 'src/*.jade',
    img: 'src/img/',
    css: 'src/style.scss'
  }
};


var srcDir = 'src/';

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    open: false,
    logPrefix: "astunov",
    reloadDelay: 300,
};

var TINY_PNG_API = ' '; // input your api key here

gulp.task('jade:build', ['style:build'], function () {
   gulp.src([srcDir + '*.jade', '!' + srcDir + '_*.jade'])
      .pipe(plumber())
      .pipe(jade({pretty:true}))
      .pipe(inlineCss(
        {
          preserveMediaQueries:true,
          applyStyleTags: false,
          removeStyleTags: false
        }))
      .pipe(gulp.dest(path.build.html))
      .pipe(browserSync.stream());
});



gulp.task('style:build',  function () {
    gulp.src(path.src.css)
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('clean', function (cb) {
   rimraf('./build/*.html', cb);
});


gulp.task('watch', function(){
    watch([path.watch.jade], function(event, cb) {
        gulp.start('jade:build');
    });
    watch([path.watch.html], function(event, cb) {

    });
    watch([path.watch.css], function(event, cb) {
       gulp.start('jade:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('build', [
    'clean',
    'jade:build',
    'image:build',
]);

gulp.task('default', ['build', 'webserver', 'watch']);

