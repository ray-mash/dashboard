var gulp = require('gulp');
// var webserver = require('gulp-webserver-io');
var webserver = require('gulp-webserver');
var morgan  = require('morgan');

gulp.task('serve', function () {
  // log all requests to the console

  morgan('dev');

  gulp.src('app')
  .pipe(webserver({
    livereload: true,
    port: 9001,
    fallback: 'app/index.html',
    // ioDebugger: true, // enable the ioDebugger
    open: true
    // open: 'http://localhost:9001/',
    // proxies: [
    //   {
    //     source: '/', target: 'http://demoncat.standardbank.co.za'
    //   }
    // ]
  //  http://demoncat.standardbank.co.za/frequencies/deploy
  }));
});

gulp.task('default', function () {
  // place code for your default task here
});