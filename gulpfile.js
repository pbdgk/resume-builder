var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: "./frontend",
    port: 1337,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./frontend/*.html')
    .pipe(gulp.dest('./frontend'))
    .pipe(connect.reload());
});


gulp.task('css', function() {
  gulp.src('.frontend/css/*.css')
    .pipe(gulp.dest('./frontend'))
    .pipe(connect.reload());

});


gulp.task('watch', function () {
  gulp.watch(['./frontend/*.html'], ['html', 'css']);
});

gulp.task('default', ['connect', 'watch']);
