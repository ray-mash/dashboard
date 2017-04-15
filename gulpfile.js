var gulp = require('gulp');
var webserver = require('gulp-webserver-io');
// var webserver = require('gulp-webserver');

gulp.task('serve', function () {
  // log all requests to the console
  gulp.src('app')
  .pipe(webserver({
    livereload: true,
    port: 9001,
    fallback: 'app/index.html',
    ioDebugger: true, // enable the ioDebugger
    // open: true
    open: 'http://localhost:9001/',
    proxies: [
      {
        source: '/api', target: 'http://demoncat.standardbank.co.za'
      }
    ]
  }));
});
