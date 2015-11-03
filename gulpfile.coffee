browserify   = require 'browserify'
coffee       = require 'gulp-coffee'
del          = require 'del'
glob         = require 'glob'
gulp         = require 'gulp'
reactify     = require 'reactify'
sass         = require 'gulp-sass'
source       = require 'vinyl-source-stream'

paths = 
  js: 'src/js/*.jsx'
  css: 'src/css/**/*.scss'

gulp.task 'browserify', ->
  browserify({
    entries: [glob.sync(paths.js)],
    transform: [reactify]
  }).bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('public_html/resources/js'))

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

