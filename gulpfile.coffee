babelify     = require 'babelify'
browserify   = require 'browserify'
del          = require 'del'
gulp         = require 'gulp'
sass         = require 'gulp-sass'
source       = require 'vinyl-source-stream'

paths = 
  js: 'src/js/**/*.js'
  css: 'src/css/**/*.scss'

gulp.task 'browserify', ->
  browserify('./src/js/app.js', {debug: false})
    .transform(babelify)
    .bundle()
    .on 'error', (err) ->
      console.log('Error : ' + err.message)
    .pipe(source('public_html/resources/js/app.js'))
    .pipe(gulp.dest('./'))

gulp.task 'sass', ->
  gulp.src(paths.css)
    .pipe(sass())
    .pipe(gulp.dest('public_html/resources/css/'))

gulp.task 'clean', ->
  del(['public_html/resources/js', 'public_html/resources/css'])

gulp.task 'watch', ->
  gulp.watch paths.js,  ['browserify']
  gulp.watch paths.css, ['sass']

gulp.task 'build', ['browserify', 'sass']
gulp.task 'default', ['clean', 'build', 'watch']

